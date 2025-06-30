import React, { useState, useEffect } from 'react';
import {
  Users,
  GraduationCap,
  BookOpen,
  Activity,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  PlayCircle,
  Database,
  Eye,
  Plus,
} from 'lucide-react';
import {
  classesService,
  subjectsService,
  usersService,
} from '../services/dataService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClasses: 0,
    totalSubjects: 0,
    recentActivities: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [usersResponse, classesResponse, subjectsResponse] =
        await Promise.all([
          usersService.getAll().catch(() => ({ data: [] })),
          classesService.getAll().catch(() => ({ data: [] })),
          subjectsService.getAll().catch(() => ({ data: [] })),
        ]);

      setStats({
        totalUsers: usersResponse.data?.length || 0,
        totalClasses: classesResponse.data?.length || 0,
        totalSubjects: subjectsResponse.data?.length || 0,
        recentActivities: 0, // We'll implement this later
      });
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      change: '+12%',
      changeType: 'positive',
    },
    {
      name: 'Total Classes',
      value: stats.totalClasses,
      icon: GraduationCap,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      change: '+8%',
      changeType: 'positive',
    },
    {
      name: 'Total Subjects',
      value: stats.totalSubjects,
      icon: BookOpen,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      change: '+3%',
      changeType: 'positive',
    },
    {
      name: 'Recent Activities',
      value: stats.recentActivities,
      icon: Activity,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      change: '+15%',
      changeType: 'positive',
    },
  ];

  const apiEndpoints = [
    { name: 'Authentication API', status: 'active' },
    { name: 'Users API', status: 'active' },
    { name: 'Classes API', status: 'active' },
    { name: 'Subjects API', status: 'active' },
  ];

  const quickActions = [
    {
      title: 'Test All Endpoints',
      description: 'Run comprehensive API tests',
      icon: PlayCircle,
      color: 'bg-primary-50 hover:bg-primary-100 text-primary-900',
      descColor: 'text-primary-700',
    },
    {
      title: 'Create Sample Data',
      description: 'Generate test users, classes, and subjects',
      icon: Plus,
      color: 'bg-green-50 hover:bg-green-100 text-green-900',
      descColor: 'text-green-700',
    },
    {
      title: 'View API Logs',
      description: 'Monitor API requests and responses',
      icon: Eye,
      color: 'bg-orange-50 hover:bg-orange-100 text-orange-900',
      descColor: 'text-orange-700',
    },
  ];

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='spinner'></div>
      </div>
    );
  }

  return (
    <div className='space-y-4 xs:space-y-6'>
      {/* Header */}
      <div className='flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3'>
        <h1 className='text-mobile-2xl font-bold text-gray-900'>Dashboard</h1>
        <button
          onClick={fetchDashboardData}
          className='btn-primary flex items-center space-x-2 self-start xs:self-auto'
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className='alert alert-error'>
          <div className='flex items-start'>
            <AlertCircle className='h-5 w-5 mt-0.5 flex-shrink-0' />
            <div className='ml-3'>
              <div className='font-medium'>Error</div>
              <div className='mt-1'>{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className='grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 lg:gap-6'>
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className='card p-4 xs:p-6 hover:shadow-lg transition-shadow duration-200'
          >
            <div className='flex items-center'>
              <div className={`${stat.color} rounded-lg p-2 xs:p-3`}>
                <stat.icon className='h-5 w-5 xs:h-6 xs:w-6 text-white' />
              </div>
              <div className='ml-3 xs:ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-xs xs:text-sm font-medium text-gray-500 truncate'>
                    {stat.name}
                  </dt>
                  <dd className='flex items-baseline mt-1'>
                    <div className='text-xl xs:text-2xl font-semibold text-gray-900'>
                      {stat.value}
                    </div>
                    <div className='ml-2 flex items-baseline text-xs xs:text-sm font-semibold text-green-600'>
                      <TrendingUp className='h-3 w-3 xs:h-4 xs:w-4 flex-shrink-0 self-center' />
                      <span className='ml-1'>{stat.change}</span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* API Testing Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-6'>
        <div className='card p-4 xs:p-6'>
          <h3 className='text-mobile-lg font-medium text-gray-900 mb-3 xs:mb-4 flex items-center'>
            <Database className='h-5 w-5 mr-2 text-primary-600' />
            API Endpoints Testing
          </h3>
          <div className='space-y-2 xs:space-y-3'>
            {apiEndpoints.map((endpoint, index) => (
              <div
                key={index}
                className='flex items-center justify-between p-2 xs:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200'
              >
                <span className='text-mobile-sm font-medium text-gray-900'>
                  {endpoint.name}
                </span>
                <span className='inline-flex items-center px-2 xs:px-2.5 py-0.5 xs:py-1 rounded-full text-2xs xs:text-xs font-medium bg-green-100 text-green-800'>
                  <CheckCircle className='h-3 w-3 mr-1' />
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className='card p-4 xs:p-6'>
          <h3 className='text-mobile-lg font-medium text-gray-900 mb-3 xs:mb-4 flex items-center'>
            <PlayCircle className='h-5 w-5 mr-2 text-primary-600' />
            Quick Actions
          </h3>
          <div className='space-y-2 xs:space-y-3'>
            {quickActions.map((action, index) => (
              <button
                key={index}
                className={`w-full text-left p-3 xs:p-4 rounded-lg transition-all duration-200 touch-manipulation ${action.color}`}
              >
                <div className='flex items-start space-x-3'>
                  <action.icon className='h-5 w-5 mt-0.5 flex-shrink-0' />
                  <div className='min-w-0 flex-1'>
                    <div className='font-medium text-mobile-sm'>
                      {action.title}
                    </div>
                    <div
                      className={`text-2xs xs:text-sm mt-1 ${action.descColor}`}
                    >
                      {action.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className='card p-4 xs:p-6'>
        <h3 className='text-mobile-lg font-medium text-gray-900 mb-3 xs:mb-4 flex items-center'>
          <Activity className='h-5 w-5 mr-2 text-primary-600' />
          API Testing History
        </h3>
        <div className='text-center py-8 xs:py-12'>
          <Activity className='h-12 w-12 xs:h-16 xs:w-16 text-gray-300 mx-auto mb-3 xs:mb-4' />
          <div className='text-mobile-sm text-gray-500'>
            API testing history will appear here as you interact with different
            endpoints...
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
