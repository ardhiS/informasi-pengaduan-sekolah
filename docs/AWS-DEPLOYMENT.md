# AWS Deployment Guide

## Website Pengaduan SMP PLUS AT-THAHIRIN

### 🌩️ AWS Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CloudFront    │    │   Application   │    │   Database      │
│   (CDN + SSL)   │    │   Load Balancer │    │   (RDS)         │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      S3         │    │      EC2        │    │   ElastiCache   │
│  (Static Files) │    │   Auto Scaling  │    │    (Redis)      │
│                 │    │     Group       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🏗️ Recommended AWS Services

#### **Option 1: Cost-Effective (Small Scale)**

- **Compute**: EC2 t3.micro/small (Free Tier eligible)
- **Database**: RDS PostgreSQL db.t3.micro (Free Tier)
- **Storage**: S3 for static files
- **CDN**: CloudFront
- **Load Balancer**: Application Load Balancer
- **SSL**: ACM (AWS Certificate Manager)

#### **Option 2: Production Ready (Medium Scale)**

- **Compute**: ECS Fargate or EC2 Auto Scaling
- **Database**: RDS PostgreSQL Multi-AZ
- **Cache**: ElastiCache Redis
- **Storage**: S3 + CloudFront
- **Monitoring**: CloudWatch + X-Ray
- **CI/CD**: CodePipeline + CodeBuild

#### **Option 3: Enterprise Scale (Large Scale)**

- **Compute**: EKS (Kubernetes) or ECS
- **Database**: Aurora PostgreSQL Serverless
- **Cache**: ElastiCache Redis Cluster
- **API Gateway**: API Gateway + Lambda
- **Monitoring**: CloudWatch + DataDog
- **Security**: WAF + Shield + GuardDuty

---

## 🚀 Option 1: EC2 + RDS Deployment (Recommended untuk Start)

### 📋 Prerequisites

- AWS Account dengan billing enabled
- AWS CLI installed dan configured
- Domain name (opsional, bisa gunakan Route 53)

### 1. Setup VPC & Security Groups

#### Create VPC

```bash
# Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=school-app-vpc}]'

# Create Internet Gateway
aws ec2 create-internet-gateway --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=school-app-igw}]'

# Attach Internet Gateway to VPC
aws ec2 attach-internet-gateway --vpc-id vpc-xxxxx --internet-gateway-id igw-xxxxx

# Create Public Subnet
aws ec2 create-subnet --vpc-id vpc-xxxxx --cidr-block 10.0.1.0/24 --availability-zone us-east-1a --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=school-app-public-subnet}]'

# Create Private Subnet for Database
aws ec2 create-subnet --vpc-id vpc-xxxxx --cidr-block 10.0.2.0/24 --availability-zone us-east-1b --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=school-app-private-subnet}]'
```

#### Security Groups

```bash
# Web Server Security Group
aws ec2 create-security-group \
  --group-name school-app-web \
  --description "Security group for web servers" \
  --vpc-id vpc-xxxxx

# Allow HTTP/HTTPS
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxx \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxx \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0

# Allow SSH (dari IP specific)
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxx \
  --protocol tcp \
  --port 22 \
  --cidr YOUR_IP/32

# Database Security Group
aws ec2 create-security-group \
  --group-name school-app-db \
  --description "Security group for database" \
  --vpc-id vpc-xxxxx

# Allow PostgreSQL dari web servers saja
aws ec2 authorize-security-group-ingress \
  --group-id sg-db-xxxxx \
  --protocol tcp \
  --port 5432 \
  --source-group sg-web-xxxxx
```

### 2. RDS PostgreSQL Setup

#### Create DB Subnet Group

```bash
aws rds create-db-subnet-group \
  --db-subnet-group-name school-app-db-subnet-group \
  --db-subnet-group-description "Subnet group for school app database" \
  --subnet-ids subnet-xxxxx subnet-yyyyy
```

#### Create RDS Instance

```bash
aws rds create-db-instance \
  --db-instance-identifier school-app-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 14.9 \
  --master-username postgres \
  --master-user-password 'YourSecurePassword123!' \
  --allocated-storage 20 \
  --storage-type gp2 \
  --vpc-security-group-ids sg-db-xxxxx \
  --db-subnet-group-name school-app-db-subnet-group \
  --backup-retention-period 7 \
  --storage-encrypted \
  --deletion-protection
```

### 3. EC2 Instance Setup

#### Launch EC2 Instance

```bash
# Create Key Pair
aws ec2 create-key-pair --key-name school-app-key --query 'KeyMaterial' --output text > school-app-key.pem
chmod 400 school-app-key.pem

# Launch Instance
aws ec2 run-instances \
  --image-id ami-0c7217cdde317cfec \
  --count 1 \
  --instance-type t3.micro \
  --key-name school-app-key \
  --security-group-ids sg-web-xxxxx \
  --subnet-id subnet-xxxxx \
  --associate-public-ip-address \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=school-app-server}]' \
  --user-data file://user-data.sh
```

#### User Data Script (user-data.sh)

```bash
#!/bin/bash
yum update -y

# Install Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Install Git
yum install -y git

# Install PostgreSQL client
yum install -y postgresql15

# Install Nginx
amazon-linux-extras install nginx1 -y

# Install PM2 globally
npm install -g pm2

# Create app user
useradd --system --shell /bin/false --home /opt/school-app school-app

# Create app directory
mkdir -p /opt/school-app
chown school-app:school-app /opt/school-app

# Start and enable services
systemctl start nginx
systemctl enable nginx
```

### 4. Application Deployment

#### SSH ke Instance dan Setup

```bash
# SSH ke instance
ssh -i school-app-key.pem ec2-user@YOUR_EC2_PUBLIC_IP

# Switch to app user directory
sudo su - school-app -s /bin/bash
cd /opt/school-app

# Clone repository
git clone https://github.com/your-repo/school-app.git .

# Install dependencies
npm ci --only=production

# Build frontend
cd frontend
npm ci --only=production
npm run build
cd ..

# Create environment file
sudo tee /opt/school-app/.env << EOF
NODE_ENV=production

# Database (gunakan RDS endpoint)
PGHOST=school-app-db.xxxxx.us-east-1.rds.amazonaws.com
PGPORT=5432
PGUSER=postgres
PGPASSWORD=YourSecurePassword123!
PGDATABASE=school_management

# Server
HOST=0.0.0.0
PORT=5000

# JWT (generate secure keys)
ACCESS_TOKEN_KEY=$(openssl rand -base64 64)
REFRESH_TOKEN_KEY=$(openssl rand -base64 64)
ACCESS_TOKEN_AGE=1800
EOF

# Run migrations
npm run migrate up

# Setup PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 5. Nginx Configuration

```bash
# Create Nginx config
sudo tee /etc/nginx/conf.d/school-app.conf << 'EOF'
# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/m;

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Frontend static files
    location / {
        root /opt/school-app/frontend/dist;
        try_files $uri $uri/ /index.html;

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API proxy
    location /api/ {
        limit_req zone=api burst=20 nodelay;

        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check
    location /health {
        proxy_pass http://127.0.0.1:5000/health;
        access_log off;
    }
}
EOF

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx
```

### 6. SSL Certificate dengan ACM + ALB

#### Create Application Load Balancer

```bash
# Create ALB
aws elbv2 create-load-balancer \
  --name school-app-alb \
  --subnets subnet-xxxxx subnet-yyyyy \
  --security-groups sg-web-xxxxx \
  --scheme internet-facing \
  --type application

# Create Target Group
aws elbv2 create-target-group \
  --name school-app-targets \
  --protocol HTTP \
  --port 80 \
  --vpc-id vpc-xxxxx \
  --health-check-path /health \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3

# Register EC2 instance
aws elbv2 register-targets \
  --target-group-arn arn:aws:elasticloadbalancing:us-east-1:xxxxx:targetgroup/school-app-targets/xxxxx \
  --targets Id=i-xxxxx
```

#### Request SSL Certificate

```bash
# Request certificate (domain sudah di Route 53)
aws acm request-certificate \
  --domain-name your-domain.com \
  --subject-alternative-names www.your-domain.com \
  --validation-method DNS \
  --region us-east-1
```

#### Create HTTPS Listener

```bash
# Create HTTPS listener
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:us-east-1:xxxxx:loadbalancer/app/school-app-alb/xxxxx \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:us-east-1:xxxxx:certificate/xxxxx \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:xxxxx:targetgroup/school-app-targets/xxxxx

# Create HTTP to HTTPS redirect
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:us-east-1:xxxxx:loadbalancer/app/school-app-alb/xxxxx \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=redirect,RedirectConfig='{Protocol=HTTPS,Port=443,StatusCode=HTTP_301}'
```

---

## 🚀 Option 2: ECS Fargate Deployment (Serverless)

### 1. Containerize Application

#### Backend Dockerfile

```dockerfile
# /Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

CMD ["npm", "start"]
```

#### Frontend Dockerfile

```dockerfile
# /frontend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Frontend Nginx Config

```nginx
# /frontend/nginx.conf
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Frontend routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 2. ECR (Elastic Container Registry)

```bash
# Create ECR repositories
aws ecr create-repository --repository-name school-app/backend
aws ecr create-repository --repository-name school-app/frontend

# Get login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Build and push backend
docker build -t school-app/backend .
docker tag school-app/backend:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/school-app/backend:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/school-app/backend:latest

# Build and push frontend
cd frontend
docker build -t school-app/frontend .
docker tag school-app/frontend:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/school-app/frontend:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/school-app/frontend:latest
```

### 3. ECS Task Definition

#### Backend Task Definition

```json
{
  "family": "school-app-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::YOUR_ACCOUNT:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/school-app/backend:latest",
      "portMappings": [
        {
          "containerPort": 5000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "HOST",
          "value": "0.0.0.0"
        },
        {
          "name": "PORT",
          "value": "5000"
        }
      ],
      "secrets": [
        {
          "name": "PGHOST",
          "valueFrom": "arn:aws:ssm:us-east-1:YOUR_ACCOUNT:parameter/school-app/db-host"
        },
        {
          "name": "PGPASSWORD",
          "valueFrom": "arn:aws:ssm:us-east-1:YOUR_ACCOUNT:parameter/school-app/db-password"
        },
        {
          "name": "ACCESS_TOKEN_KEY",
          "valueFrom": "arn:aws:ssm:us-east-1:YOUR_ACCOUNT:parameter/school-app/jwt-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/school-app-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": [
          "CMD-SHELL",
          "curl -f http://localhost:5000/health || exit 1"
        ],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

### 4. ECS Service

```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name school-app-cluster --capacity-providers FARGATE

# Register task definition
aws ecs register-task-definition --cli-input-json file://backend-task-definition.json

# Create service
aws ecs create-service \
  --cluster school-app-cluster \
  --service-name school-app-backend \
  --task-definition school-app-backend:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx,subnet-yyyyy],securityGroups=[sg-xxxxx],assignPublicIp=ENABLED}" \
  --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:xxxxx:targetgroup/school-app-targets/xxxxx,containerName=backend,containerPort=5000
```

---

## 🗄️ Option 3: Aurora Serverless + Lambda (Advanced)

### 1. Aurora Serverless PostgreSQL

```bash
# Create Aurora Serverless cluster
aws rds create-db-cluster \
  --db-cluster-identifier school-app-aurora \
  --engine aurora-postgresql \
  --engine-mode serverless \
  --master-username postgres \
  --master-user-password 'SecurePassword123!' \
  --scaling-configuration MinCapacity=2,MaxCapacity=16,AutoPause=true,SecondsUntilAutoPause=300 \
  --enable-http-endpoint \
  --vpc-security-group-ids sg-xxxxx \
  --db-subnet-group-name school-app-db-subnet-group
```

### 2. Lambda Functions (API Gateway + Lambda)

#### Lambda Function Code Structure

```javascript
// lambda/complaints/index.js
const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,
  port: 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

exports.handler = async (event) => {
  const { httpMethod, path, body } = event;

  try {
    switch (httpMethod) {
      case 'GET':
        if (path === '/complaints') {
          return await getComplaints(event);
        } else if (path.match(/\/complaints\/\d+/)) {
          return await getComplaintById(event);
        }
        break;
      case 'POST':
        return await createComplaint(event);
      case 'PUT':
        return await updateComplaint(event);
      case 'DELETE':
        return await deleteComplaint(event);
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
```

#### SAM Template (Serverless Application Model)

```yaml
# template.yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Parameters:
  Environment:
    Type: String
    Default: prod

Globals:
  Function:
    Timeout: 30
    Runtime: nodejs18.x
    Environment:
      Variables:
        NODE_ENV: !Ref Environment

Resources:
  # API Gateway
  SchoolAppApi:
    Type: AWS::Serverless::Api
    Properties:
      StageName: !Ref Environment
      Cors:
        AllowMethods: "'*'"
        AllowHeaders: "'*'"
        AllowOrigin: "'*'"

  # Lambda Functions
  ComplaintsFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: lambda/complaints/
      Handler: index.handler
      VpcConfig:
        SecurityGroupIds:
          - !Ref LambdaSecurityGroup
        SubnetIds:
          - !Ref PrivateSubnet1
          - !Ref PrivateSubnet2
      Environment:
        Variables:
          DB_HOST: !GetAtt AuroraCluster.Endpoint.Address
          DB_USER: postgres
          DB_PASSWORD: !Ref DBPassword
          DB_NAME: school_management
      Events:
        ComplaintsApi:
          Type: Api
          Properties:
            RestApiId: !Ref SchoolAppApi
            Path: /complaints
            Method: ANY

  # Aurora Serverless
  AuroraCluster:
    Type: AWS::RDS::DBCluster
    Properties:
      Engine: aurora-postgresql
      EngineMode: serverless
      MasterUsername: postgres
      MasterUserPassword: !Ref DBPassword
      ScalingConfiguration:
        MinCapacity: 2
        MaxCapacity: 16
        AutoPause: true
        SecondsUntilAutoPause: 300

  # S3 for Frontend
  FrontendBucket:
    Type: AWS::S3::Bucket
    Properties:
      WebsiteConfiguration:
        IndexDocument: index.html
        ErrorDocument: index.html
      PublicAccessBlockConfiguration:
        BlockPublicAcls: false
        BlockPublicPolicy: false
        IgnorePublicAcls: false
        RestrictPublicBuckets: false

  # CloudFront Distribution
  CloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Origins:
          - Id: S3Origin
            DomainName: !GetAtt FrontendBucket.DomainName
            S3OriginConfig:
              OriginAccessIdentity: ''
          - Id: APIOrigin
            DomainName: !Sub '${SchoolAppApi}.execute-api.${AWS::Region}.amazonaws.com'
            CustomOriginConfig:
              HTTPPort: 443
              OriginProtocolPolicy: https-only
        DefaultCacheBehavior:
          TargetOriginId: S3Origin
          ViewerProtocolPolicy: redirect-to-https
          Compress: true
        CacheBehaviors:
          - PathPattern: '/api/*'
            TargetOriginId: APIOrigin
            ViewerProtocolPolicy: redirect-to-https
            CachePolicyId: 4135ea2d-6df8-44a3-9df3-4b5a84be39ad # CachingDisabled
        Enabled: true
        DefaultRootObject: index.html
```

---

## 📊 Cost Estimation (Monthly USD)

### Option 1: EC2 + RDS (Basic)

- **EC2 t3.micro**: $8.50 (Free Tier: $0)
- **RDS db.t3.micro**: $12.50 (Free Tier: $0)
- **ALB**: $16.20
- **Route 53**: $0.50
- **Data Transfer**: $5-10
- **Total**: ~$40-45 (Free Tier: ~$25)

### Option 2: ECS Fargate (Medium)

- **Fargate vCPU**: $14.40 (0.04 vCPU × 24h × 30d × $0.04048)
- **Fargate Memory**: $6.30 (0.5 GB × 24h × 30d × $0.004445)
- **RDS Multi-AZ**: $30-50
- **ALB**: $16.20
- **ECR**: $1
- **Total**: ~$70-90

### Option 3: Aurora Serverless + Lambda (Advanced)

- **Lambda**: $5-15 (depends on requests)
- **Aurora Serverless**: $40-100 (depends on usage)
- **API Gateway**: $3.50 per million requests
- **S3**: $5
- **CloudFront**: $10
- **Total**: ~$65-135

---

## 🔧 AWS Best Practices

### Security

- **IAM Roles**: Gunakan IAM roles, bukan access keys
- **VPC**: Deploy dalam private subnets
- **Security Groups**: Principle of least privilege
- **Secrets Manager**: Store sensitive data
- **WAF**: Enable untuk public-facing apps

### Monitoring

- **CloudWatch**: Set up alarms untuk CPU, memory, errors
- **X-Ray**: Distributed tracing untuk debugging
- **CloudTrail**: Audit trail untuk security

### Backup & Disaster Recovery

- **RDS Automated Backups**: 7-30 days retention
- **S3 Cross-Region Replication**: Untuk static assets
- **Multi-AZ Deployment**: Untuk high availability

### Cost Optimization

- **Reserved Instances**: Untuk production workloads
- **Spot Instances**: Untuk development/testing
- **S3 Lifecycle Policies**: Archive old data
- **CloudWatch Cost Monitoring**: Set budget alerts

---

## 🚀 CI/CD Pipeline dengan CodePipeline

### CodePipeline Configuration

```yaml
# buildspec.yml
version: 0.2

phases:
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
      - REPOSITORY_URI=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/school-app/backend
      - COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)
      - IMAGE_TAG=${COMMIT_HASH:=latest}
  build:
    commands:
      - echo Build started on `date`
      - echo Building the Docker image...
      - docker build -t $REPOSITORY_URI:latest .
      - docker tag $REPOSITORY_URI:latest $REPOSITORY_URI:$IMAGE_TAG
  post_build:
    commands:
      - echo Build completed on `date`
      - echo Pushing the Docker images...
      - docker push $REPOSITORY_URI:latest
      - docker push $REPOSITORY_URI:$IMAGE_TAG
      - echo Writing image definitions file...
      - printf '[{"name":"backend","imageUri":"%s"}]' $REPOSITORY_URI:$IMAGE_TAG > imagedefinitions.json
artifacts:
  files: imagedefinitions.json
```

Panduan AWS deployment ini memberikan multiple options sesuai dengan kebutuhan dan budget, dari yang paling cost-effective hingga enterprise-grade architecture.
