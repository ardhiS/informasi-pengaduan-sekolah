import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  ArrowLeft,
  Database,
  Users,
  GraduationCap,
  BookOpen,
  MessageSquare,
  Shield,
  Eye,
  Activity,
  AlertTriangle,
  Copy,
  Download,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../utils/translations';
import api from '../services/api';

const ApiTesting = () => {
  const { isDarkMode, language } = useTheme();
  const { t } = useTranslation(language);
  const navigate = useNavigate();

  const [isTestingAll, setIsTestingAll] = useState(false);
  const [testResults, setTestResults] = useState({});
  const [activeTest, setActiveTest] = useState(null);
  const [logs, setLogs] = useState([]);

  // Define all API endpoints to test
  const endpoints = [
    {
      category: 'Authentication',
      icon: Shield,
      color: 'blue',
      tests: [
        {
          id: 'auth-profile',
          name: 'Get Auth Profile',
          method: 'GET',
          url: '/auth/profile',
          description: 'Get authenticated user profile',
          requiresAuth: true,
        },
      ],
    },
    {
      category: 'Users',
      icon: Users,
      color: 'purple',
      tests: [
        {
          id: 'users-all',
          name: 'Get All Users',
          method: 'GET',
          url: '/users/all',
          description: 'Fetch all users (public endpoint)',
          requiresAuth: false,
        },
        {
          id: 'users-protected',
          name: 'Get Users (Protected)',
          method: 'GET',
          url: '/users',
          description: 'Fetch users with authentication',
          requiresAuth: true,
        },
      ],
    },
    {
      category: 'Classes',
      icon: GraduationCap,
      color: 'green',
      tests: [
        {
          id: 'classes-all',
          name: 'Get All Classes',
          method: 'GET',
          url: '/classes/all',
          description: 'Fetch all classes (public endpoint)',
          requiresAuth: false,
        },
        {
          id: 'classes-protected',
          name: 'Get Classes (Protected)',
          method: 'GET',
          url: '/classes',
          description: 'Fetch classes with authentication',
          requiresAuth: true,
        },
      ],
    },
    {
      category: 'Subjects',
      icon: BookOpen,
      color: 'indigo',
      tests: [
        {
          id: 'subjects-all',
          name: 'Get All Subjects',
          method: 'GET',
          url: '/subjects/all',
          description: 'Fetch all subjects (public endpoint)',
          requiresAuth: false,
        },
        {
          id: 'subjects-protected',
          name: 'Get Subjects (Protected)',
          method: 'GET',
          url: '/subjects',
          description: 'Fetch subjects with authentication',
          requiresAuth: true,
        },
      ],
    },
    {
      category: 'System Health',
      icon: Activity,
      color: 'emerald',
      tests: [
        {
          id: 'health-check',
          name: 'Health Check',
          method: 'GET',
          url: '/',
          description: 'Check if API server is running',
          requiresAuth: false,
        },
      ],
    },
    {
      category: 'Complaints',
      icon: MessageSquare,
      color: 'orange',
      tests: [
        {
          id: 'complaints-all',
          name: 'Get All Complaints',
          method: 'GET',
          url: '/complaints',
          description: 'Fetch all complaints',
          requiresAuth: true,
        },
      ],
    },
  ];

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [
      ...prev,
      {
        timestamp,
        message,
        type,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      },
    ]);
  };

  const runSingleTest = async (test) => {
    setActiveTest(test.id);
    addLog(`Testing ${test.name}...`, 'info');

    try {
      const startTime = Date.now();
      let response;

      // Skip auth-required tests if no token available
      if (test.requiresAuth && !localStorage.getItem('accessToken')) {
        const result = {
          status: 'skipped',
          statusCode: 401,
          error: 'Authentication required - no token available',
          timestamp: new Date().toISOString(),
        };
        setTestResults((prev) => ({ ...prev, [test.id]: result }));
        addLog(`⚠️ ${test.name} - Skipped (no auth token)`, 'warning');
        setActiveTest(null);
        return;
      }

      if (test.method === 'GET') {
        response = await api.get(test.url);
      } else if (test.method === 'POST') {
        response = await api.post(test.url, test.body || {});
      } else if (test.method === 'PUT') {
        response = await api.put(test.url, test.body || {});
      } else if (test.method === 'DELETE') {
        response = await api.delete(test.url);
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      const result = {
        status: 'success',
        statusCode: response.status,
        duration,
        data: response.data,
        timestamp: new Date().toISOString(),
      };

      setTestResults((prev) => ({ ...prev, [test.id]: result }));
      addLog(`✅ ${test.name} - ${response.status} (${duration}ms)`, 'success');
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;

      const result = {
        status: 'error',
        statusCode: error.response?.status || 0,
        error: error.response?.data?.message || error.message,
        duration: duration || 0,
        timestamp: new Date().toISOString(),
      };

      setTestResults((prev) => ({ ...prev, [test.id]: result }));

      // Better error messages
      let errorMsg = `❌ ${test.name} - `;
      if (error.response?.status === 401) {
        errorMsg += 'Unauthorized (401)';
      } else if (error.response?.status === 404) {
        errorMsg += 'Endpoint not found (404)';
      } else if (error.response?.status === 500) {
        errorMsg += 'Server error (500)';
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        errorMsg += 'Network error - Check if backend is running';
      } else {
        errorMsg += error.message;
      }

      addLog(errorMsg, 'error');
    }

    setActiveTest(null);
  };

  const runAllTests = async () => {
    setIsTestingAll(true);
    setTestResults({});
    setLogs([]);
    addLog('Starting comprehensive API testing...', 'info');

    for (const category of endpoints) {
      addLog(`Testing ${category.category} endpoints...`, 'info');

      for (const test of category.tests) {
        await runSingleTest(test);
        // Small delay between tests
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    addLog('All tests completed!', 'success');
    setIsTestingAll(false);
  };

  const getStatusColor = (result) => {
    if (!result) return 'gray';
    if (
      result.status === 'success' &&
      result.statusCode >= 200 &&
      result.statusCode < 300
    ) {
      return 'green';
    }
    if (result.status === 'skipped') {
      return 'yellow';
    }
    return 'red';
  };

  const getStatusIcon = (result) => {
    if (!result) return Clock;
    if (result.status === 'success') return CheckCircle;
    if (result.status === 'skipped') return AlertTriangle;
    return XCircle;
  };

  const exportResults = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      results: testResults,
      logs: logs,
      summary: {
        total: Object.keys(testResults).length,
        passed: Object.values(testResults).filter((r) => r.status === 'success')
          .length,
        failed: Object.values(testResults).filter((r) => r.status === 'error')
          .length,
      },
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `api-test-results-${new Date()
      .toISOString()
      .slice(0, 19)}.json`;
    link.click();
  };

  const copyLogsToClipboard = () => {
    const logsText = logs
      .map((log) => `[${log.timestamp}] ${log.message}`)
      .join('\n');
    navigator.clipboard.writeText(logsText);
    addLog('Logs copied to clipboard!', 'success');
  };

  return (
    <div className='space-y-4 xs:space-y-6'>
      {/* Header */}
      <div className='flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3'>
        <div className='flex items-center space-x-3'>
          <button
            onClick={() => navigate('/dashboard')}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            <ArrowLeft className='h-5 w-5' />
          </button>
          <div>
            <h1
              className={`text-mobile-2xl font-bold ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`}
            >
              {t('apiTesting', 'API Testing')}
            </h1>
            <p
              className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {t(
                'apiTestingDescription',
                'Test all API endpoints and monitor responses'
              )}
            </p>
          </div>
        </div>

        <div className='flex items-center space-x-2'>
          <button
            onClick={copyLogsToClipboard}
            className={`btn-secondary flex items-center space-x-2 ${
              logs.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={logs.length === 0}
          >
            <Copy className='h-4 w-4' />
            <span className='hidden xs:inline'>
              {t('copyLogs', 'Copy Logs')}
            </span>
          </button>

          <button
            onClick={exportResults}
            className={`btn-secondary flex items-center space-x-2 ${
              Object.keys(testResults).length === 0
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
            disabled={Object.keys(testResults).length === 0}
          >
            <Download className='h-4 w-4' />
            <span className='hidden xs:inline'>
              {t('exportResults', 'Export')}
            </span>
          </button>

          <button
            onClick={runAllTests}
            disabled={isTestingAll}
            className='btn-primary flex items-center space-x-2'
          >
            {isTestingAll ? (
              <>
                <RefreshCw className='h-4 w-4 animate-spin' />
                <span>{t('testing', 'Testing...')}</span>
              </>
            ) : (
              <>
                <Play className='h-4 w-4' />
                <span>{t('runAllTests', 'Run All Tests')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Test Summary */}
      {Object.keys(testResults).length > 0 && (
        <div className='grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4'>
          <div
            className={`card p-4 ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className='flex items-center space-x-3'>
              <div className='p-2 bg-blue-500 rounded-lg'>
                <Database className='h-5 w-5 text-white' />
              </div>
              <div>
                <div
                  className={`text-xl font-bold ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}
                >
                  {Object.keys(testResults).length}
                </div>
                <div
                  className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {t('totalTests', 'Total Tests')}
                </div>
              </div>
            </div>
          </div>

          <div
            className={`card p-4 ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className='flex items-center space-x-3'>
              <div className='p-2 bg-green-500 rounded-lg'>
                <CheckCircle className='h-5 w-5 text-white' />
              </div>
              <div>
                <div
                  className={`text-xl font-bold ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}
                >
                  {
                    Object.values(testResults).filter(
                      (r) => r.status === 'success'
                    ).length
                  }
                </div>
                <div
                  className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {t('passed', 'Passed')}
                </div>
              </div>
            </div>
          </div>

          <div
            className={`card p-4 ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className='flex items-center space-x-3'>
              <div className='p-2 bg-yellow-500 rounded-lg'>
                <AlertTriangle className='h-5 w-5 text-white' />
              </div>
              <div>
                <div
                  className={`text-xl font-bold ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}
                >
                  {
                    Object.values(testResults).filter(
                      (r) => r.status === 'skipped'
                    ).length
                  }
                </div>
                <div
                  className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {t('skipped', 'Skipped')}
                </div>
              </div>
            </div>
          </div>

          <div
            className={`card p-4 ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className='flex items-center space-x-3'>
              <div className='p-2 bg-red-500 rounded-lg'>
                <XCircle className='h-5 w-5 text-white' />
              </div>
              <div>
                <div
                  className={`text-xl font-bold ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}
                >
                  {
                    Object.values(testResults).filter(
                      (r) => r.status === 'error'
                    ).length
                  }
                </div>
                <div
                  className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {t('failed', 'Failed')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Endpoint Categories */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='space-y-6'>
          {endpoints.map((category) => (
            <div
              key={category.category}
              className={`card p-6 ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className='flex items-center space-x-3 mb-4'>
                <div className={`p-2 bg-${category.color}-500 rounded-lg`}>
                  <category.icon className='h-5 w-5 text-white' />
                </div>
                <h3
                  className={`text-lg font-medium ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}
                >
                  {category.category}
                </h3>
              </div>

              <div className='space-y-3'>
                {category.tests.map((test) => {
                  const result = testResults[test.id];
                  const StatusIcon = getStatusIcon(result);
                  const statusColor = getStatusColor(result);
                  const isActive = activeTest === test.id;

                  return (
                    <div
                      key={test.id}
                      className={`p-4 rounded-lg border transition-all ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className='flex items-center justify-between mb-2'>
                        <div className='flex items-center space-x-3'>
                          <StatusIcon
                            className={`h-5 w-5 ${
                              statusColor === 'green'
                                ? 'text-green-500'
                                : statusColor === 'red'
                                ? 'text-red-500'
                                : statusColor === 'yellow'
                                ? 'text-yellow-500'
                                : isDarkMode
                                ? 'text-gray-400'
                                : 'text-gray-500'
                            }`}
                          />
                          <div>
                            <div
                              className={`font-medium ${
                                isDarkMode ? 'text-gray-100' : 'text-gray-900'
                              }`}
                            >
                              {test.name}
                            </div>
                            <div
                              className={`text-sm ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}
                            >
                              {test.method} {test.url}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => runSingleTest(test)}
                          disabled={isActive || isTestingAll}
                          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                            isActive
                              ? isDarkMode
                                ? 'bg-gray-600 text-gray-300'
                                : 'bg-gray-200 text-gray-500'
                              : isDarkMode
                              ? 'bg-primary-900/30 hover:bg-primary-900/50 text-primary-300'
                              : 'bg-primary-50 hover:bg-primary-100 text-primary-700'
                          }`}
                        >
                          {isActive ? (
                            <RefreshCw className='h-4 w-4 animate-spin' />
                          ) : (
                            <Play className='h-4 w-4' />
                          )}
                        </button>
                      </div>

                      <p
                        className={`text-sm ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        {test.description}
                      </p>

                      {result && (
                        <div className='mt-3 pt-3 border-t border-gray-600'>
                          <div className='flex items-center justify-between text-sm'>
                            <span
                              className={`font-medium ${
                                result.status === 'success'
                                  ? 'text-green-500'
                                  : 'text-red-500'
                              }`}
                            >
                              {result.statusCode}{' '}
                              {result.status === 'success' ? 'OK' : 'ERROR'}
                            </span>
                            {result.duration && (
                              <span
                                className={`${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}
                              >
                                {result.duration}ms
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Logs Panel */}
        <div
          className={`card p-6 ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className='flex items-center justify-between mb-4'>
            <h3
              className={`text-lg font-medium flex items-center space-x-2 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`}
            >
              <Activity className='h-5 w-5' />
              <span>{t('testLogs', 'Test Logs')}</span>
            </h3>
            <button
              onClick={() => setLogs([])}
              className={`text-sm px-3 py-1 rounded ${
                isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              {t('clear', 'Clear')}
            </button>
          </div>

          <div
            className={`h-96 overflow-y-auto rounded-lg border p-4 font-mono text-sm ${
              isDarkMode
                ? 'bg-gray-900 border-gray-600 text-gray-300'
                : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}
          >
            {logs.length === 0 ? (
              <div
                className={`text-center ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                {t(
                  'noLogsYet',
                  'No logs yet. Run some tests to see results here.'
                )}
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className={`mb-2 ${
                    log.type === 'error'
                      ? 'text-red-400'
                      : log.type === 'success'
                      ? 'text-green-400'
                      : isDarkMode
                      ? 'text-gray-300'
                      : 'text-gray-700'
                  }`}
                >
                  <span
                    className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}
                  >
                    [{log.timestamp}]
                  </span>{' '}
                  {log.message}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTesting;
