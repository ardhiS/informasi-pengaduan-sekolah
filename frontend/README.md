# School Management Dashboard Frontend

React + Vite + Tailwind CSS frontend untuk testing semua endpoint backend API.

## 🚀 Fitur Frontend

### 🔐 Authentication Features

- ✅ **Login/Logout System** - Test `POST /authentications`, `DELETE /authentications`
- ✅ **Auto Token Refresh** - Test `PUT /authentications`
- ✅ **Protected Routes** - Test JWT authorization
- ✅ **Role-based Access** - Test different user roles

### 👥 User Management

- ✅ **User List** - Test `GET /users`
- ✅ **User Profile** - Test `GET /users/{id}`, `PUT /users/{id}`
- ✅ **Role Display** - Test role validation
- ✅ **User Statistics** - Test data aggregation

### 🏫 Classes Management

- ✅ **CRUD Operations** - Test all `/classes` endpoints
- ✅ **Add Class** - Test `POST /classes`
- ✅ **Edit Class** - Test `PUT /classes/{id}`
- ✅ **Delete Class** - Test `DELETE /classes/{id}`
- ✅ **List Classes** - Test `GET /classes`
- ✅ **Search & Filter** - Test query parameters

### 📚 Subjects Management

- ✅ **CRUD Operations** - Test all `/subjects` endpoints
- ✅ **Add Subject** - Test `POST /subjects`
- ✅ **Edit Subject** - Test `PUT /subjects/{id}`
- ✅ **Delete Subject** - Test `DELETE /subjects/{id}`
- ✅ **List Subjects** - Test `GET /subjects`

### 📊 Dashboard

- ✅ **API Status** - Monitor all endpoints
- ✅ **Statistics** - Test data aggregation
- ✅ **Quick Actions** - Test common workflows

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+
- Backend API running on http://localhost:5000

### Install Dependencies

```bash
cd frontend
npm install
```

### Run Development Server

```bash
npm run dev
```

Frontend akan berjalan di: http://localhost:3000

## 🔧 Configuration

### API Base URL

Default: `http://localhost:5000`
Edit di: `src/services/api.js`

### Proxy Configuration

Vite proxy setup di: `vite.config.js`

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '')
  }
}
```

## 🧪 Testing Backend Endpoints

### 1. Authentication Testing

```bash
# Start backend
cd ..
npm run start:dev

# Start frontend
cd frontend
npm run dev
```

### 2. Login dengan Test Credentials

- Username: testuser
- Password: password123

### 3. Test All Features

1. **Login** → Test authentication
2. **Dashboard** → View API status
3. **Users** → Test user management
4. **Classes** → Test CRUD operations
5. **Subjects** → Test CRUD operations
6. **Profile** → Test user profile

## 📱 UI Components

### Modern Admin Dashboard Style

- ✅ **Responsive Design** - Mobile & desktop
- ✅ **Clean Interface** - Professional look
- ✅ **Interactive Elements** - Modals, forms, tables
- ✅ **Loading States** - API call feedback
- ✅ **Error Handling** - User-friendly messages
- ✅ **Success Notifications** - Operation feedback

### Component Structure

```
src/
├── components/
│   ├── Layout/
│   │   ├── Layout.jsx
│   │   ├── Header.jsx
│   │   └── Sidebar.jsx
│   └── ProtectedRoute.jsx
├── context/
│   ├── AuthContext.jsx
│   └── ApiContext.jsx
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Users.jsx
│   ├── Classes.jsx
│   ├── Subjects.jsx
│   └── Profile.jsx
└── services/
    ├── api.js
    └── dataService.js
```

## 🎯 Backend API Coverage

### ✅ Tested Endpoints

#### Authentication

- `POST /authentications` - Login
- `PUT /authentications` - Refresh token
- `DELETE /authentications` - Logout

#### Users

- `GET /users` - List users
- `GET /users/{id}` - Get user
- `PUT /users/{id}` - Update user
- `POST /users` - Register (via login form)

#### Classes

- `GET /classes` - List classes
- `GET /classes/{id}` - Get class
- `POST /classes` - Create class
- `PUT /classes/{id}` - Update class
- `DELETE /classes/{id}` - Delete class

#### Subjects

- `GET /subjects` - List subjects
- `GET /subjects/{id}` - Get subject
- `POST /subjects` - Create subject
- `PUT /subjects/{id}` - Update subject
- `DELETE /subjects/{id}` - Delete subject

#### Collaborations & Activities

- `POST /collaborations` - Add collaborator
- `DELETE /collaborations` - Remove collaborator
- `GET /classes/{id}/activities` - View activities

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deploy Options

- **Vercel** - Automatic deployment
- **Netlify** - Static hosting
- **GitHub Pages** - Free hosting

## 🔍 Troubleshooting

### Common Issues

1. **CORS Error** - Check backend CORS settings
2. **401 Unauthorized** - Check token validity
3. **Connection Refused** - Ensure backend is running
4. **Module Not Found** - Run `npm install`

### Debug Mode

Set environment variable:

```bash
VITE_DEBUG=true npm run dev
```

## 📋 Todo / Future Enhancements

- [ ] Collaboration management UI
- [ ] Activity logs display
- [ ] Bulk operations
- [ ] Data export functionality
- [ ] Real-time updates (WebSocket)
- [ ] Advanced search & filtering
- [ ] User preferences
- [ ] Dark mode toggle

## 🎉 Success!

Frontend sekarang siap untuk **test semua endpoint backend**!

### Quick Test Workflow:

1. ✅ Start backend: `npm run start:dev`
2. ✅ Start frontend: `cd frontend && npm run dev`
3. ✅ Login dengan test credentials
4. ✅ Test semua fitur CRUD
5. ✅ Monitor API calls di browser DevTools

**Total Coverage: 31+ endpoints dengan UI yang user-friendly!** 🚀
