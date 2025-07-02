import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  GraduationCap,
  BookOpen,
  MessageSquare,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Database,
  Plus,
  Trash2,
  Download,
  Upload,
  Play,
  Settings,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { useTranslation } from '../utils/translations';
import api from '../services/api';

const SampleDataGenerator = () => {
  const { isDarkMode, language } = useTheme();
  const { t } = useTranslation(language);
  const navigate = useNavigate();
  const {
    state,
    actions,
    users,
    classes,
    subjects,
    complaints,
    isLoading: globalLoading,
    isInitialized,
  } = useData();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResults, setGenerationResults] = useState({});
  const [logs, setLogs] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState({
    users: true,
    classes: true,
    subjects: true,
    complaints: false,
  });

  const [customCounts, setCustomCounts] = useState({
    users: { admin: 2, guru: 5, siswa: 20 },
    classes: 10,
    subjects: 8,
    complaints: 15,
  });

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

  // Initialize component
  useEffect(() => {
    if (isInitialized) {
      addLog('Data context initialized successfully', 'success');
      const summary = actions.getSummary();
      addLog(
        `📊 Current Data: ${summary.totalUsers} users, ${summary.totalClasses} classes, ${summary.totalSubjects} subjects, ${summary.totalComplaints} complaints`,
        'info'
      );
    }
  }, [isInitialized]);

  // Manual refresh function that uses DataContext
  const refreshDataStatus = async () => {
    addLog('Refreshing data status...', 'info');
    try {
      await actions.fetchAllData();
      addLog('✅ Data refreshed successfully', 'success');
    } catch (error) {
      addLog(`❌ Failed to refresh data: ${error.message}`, 'error');
    }
  };

  const dataCategories = [
    {
      id: 'users',
      title: t('users', 'Users'),
      description: t(
        'generateUsersDesc',
        'Generate admin, teacher, and student accounts'
      ),
      icon: Users,
      color: 'blue',
      details: [
        `Current total: ${users.total} users`,
        `Will add: ${customCounts.users.admin} Admin + ${customCounts.users.guru} Guru + ${customCounts.users.siswa} Siswa`,
        `Breakdown: ${users.admin} Admin, ${users.guru} Guru, ${users.siswa} Siswa`,
      ],
    },
    {
      id: 'classes',
      title: t('classes', 'Classes'),
      description: t(
        'generateClassesDesc',
        'Generate class data with assignments'
      ),
      icon: GraduationCap,
      color: 'green',
      details: [
        `Current total: ${classes.total} classes`,
        `Will add: ${customCounts.classes} new classes`,
        'Class schedules and assignments',
      ],
    },
    {
      id: 'subjects',
      title: t('subjects', 'Subjects'),
      description: t(
        'generateSubjectsDesc',
        'Generate academic subjects and curriculum'
      ),
      icon: BookOpen,
      color: 'purple',
      details: [
        `Current total: ${subjects.total} subjects`,
        `Will add: ${customCounts.subjects} new subjects`,
        'Subject-class mappings',
      ],
    },
    {
      id: 'complaints',
      title: t('complaints', 'Complaints'),
      description: t(
        'generateComplaintsDesc',
        'Generate sample complaints and responses'
      ),
      icon: MessageSquare,
      color: 'orange',
      details: [
        `Current total: ${complaints.total} complaints`,
        `Will add: ${customCounts.complaints} new complaints`,
        'Various complaint categories',
      ],
    },
  ];

  const generateSampleData = async (category) => {
    addLog(`Starting ${category} data generation...`, 'info');

    try {
      console.log(
        `🔄 SampleDataGenerator: Starting ${category} generation with count:`,
        customCounts[category]
      );

      // Prepare request payload with proper structure
      const requestPayload = {
        count: customCounts[category],
      };

      console.log(
        `📦 SampleDataGenerator: Request payload for ${category}:`,
        requestPayload
      );

      const response = await api.post(
        `/api/sample-data/${category}`,
        requestPayload
      );

      console.log(
        `✅ SampleDataGenerator: ${category} API response:`,
        response.data
      );

      setGenerationResults((prev) => ({
        ...prev,
        [category]: { status: 'success', data: response.data },
      }));

      addLog(`✅ ${category} data generated successfully`, 'success');

      // Refresh data through DataContext instead of local function
      console.log(
        `🔄 SampleDataGenerator: Refreshing ${category} data through DataContext...`
      );
      await actions.refreshCategory(category);
      console.log(`✅ SampleDataGenerator: ${category} data refreshed`);

      // Trigger dashboard refresh event with detailed information
      window.dispatchEvent(
        new CustomEvent('dataUpdated', {
          detail: {
            type: 'sampleDataGenerated',
            category,
            timestamp: new Date().toISOString(),
            action: 'generate',
          },
        })
      );

      return true;
    } catch (error) {
      console.error(
        `❌ SampleDataGenerator: ${category} generation failed:`,
        error
      );

      // Extract more detailed error information
      const errorDetail =
        error.response?.data?.message || error.message || 'Unknown error';
      const errorStatus = error.response?.status || 'Unknown status';
      const errorData = error.response?.data || {};

      console.error(`❌ Error details:`, {
        status: errorStatus,
        message: errorDetail,
        data: errorData,
        category: category,
        requestPayload: { count: customCounts[category] },
      });

      setGenerationResults((prev) => ({
        ...prev,
        [category]: {
          status: 'error',
          error: errorDetail,
          errorStatus: errorStatus,
          errorData: errorData,
        },
      }));

      addLog(
        `❌ Failed to generate ${category} data: ${errorDetail} (Status: ${errorStatus})`,
        'error'
      );
      return false;
    }
  };

  const generateAllData = async () => {
    setIsGenerating(true);
    setGenerationResults({});
    setLogs([]);

    addLog('Starting comprehensive sample data generation...', 'info');

    const selectedCats = Object.keys(selectedCategories).filter(
      (cat) => selectedCategories[cat]
    );

    for (const category of selectedCats) {
      await generateSampleData(category);
      // Small delay between operations
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    addLog('Sample data generation completed!', 'success');
    setIsGenerating(false);
  };

  const clearAllData = async () => {
    if (
      !window.confirm(
        'Are you sure you want to clear all sample data? This action cannot be undone.'
      )
    ) {
      return;
    }

    addLog('Clearing all sample data...', 'info');

    try {
      await api.delete('/api/sample-data/all');
      addLog('✅ All sample data cleared successfully', 'success');
      setGenerationResults({});

      // Refresh data through DataContext
      await actions.fetchAllData();

      // Trigger dashboard refresh event
      window.dispatchEvent(
        new CustomEvent('dataUpdated', {
          detail: {
            type: 'sampleDataCleared',
            timestamp: new Date().toISOString(),
            action: 'clear_all',
          },
        })
      );
    } catch (error) {
      addLog(`❌ Failed to clear data: ${error.message}`, 'error');
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50',
        border: isDarkMode ? 'border-blue-700' : 'border-blue-200',
        text: isDarkMode ? 'text-blue-300' : 'text-blue-700',
        button: 'bg-blue-600 hover:bg-blue-700 text-white',
      },
      green: {
        bg: isDarkMode ? 'bg-green-900/30' : 'bg-green-50',
        border: isDarkMode ? 'border-green-700' : 'border-green-200',
        text: isDarkMode ? 'text-green-300' : 'text-green-700',
        button: 'bg-green-600 hover:bg-green-700 text-white',
      },
      purple: {
        bg: isDarkMode ? 'bg-purple-900/30' : 'bg-purple-50',
        border: isDarkMode ? 'border-purple-700' : 'border-purple-200',
        text: isDarkMode ? 'text-purple-300' : 'text-purple-700',
        button: 'bg-purple-600 hover:bg-purple-700 text-white',
      },
      orange: {
        bg: isDarkMode ? 'bg-orange-900/30' : 'bg-orange-50',
        border: isDarkMode ? 'border-orange-700' : 'border-orange-200',
        text: isDarkMode ? 'text-orange-300' : 'text-orange-700',
        button: 'bg-orange-600 hover:bg-orange-700 text-white',
      },
    };
    return colors[color] || colors.blue;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className='h-5 w-5 text-green-500' />;
      case 'error':
        return <XCircle className='h-5 w-5 text-red-500' />;
      default:
        return <AlertTriangle className='h-5 w-5 text-gray-400' />;
    }
  };

  return (
    <div className='space-y-6'>
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
              {t('sampleDataGenerator', 'Sample Data Generator')}
            </h1>
            <p
              className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {t(
                'generateTestDataDesc',
                'Generate test data for development and testing'
              )}
            </p>
          </div>
        </div>

        <div className='flex items-center space-x-2'>
          <button
            onClick={refreshDataStatus}
            disabled={globalLoading || isGenerating}
            className={`btn-secondary flex items-center space-x-2 ${
              isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            } disabled:opacity-50`}
          >
            <RefreshCw
              className={`h-4 w-4 ${globalLoading ? 'animate-spin' : ''}`}
            />
            <span className='hidden xs:inline'>
              {globalLoading
                ? t('refreshing', 'Refreshing...')
                : t('refreshData', 'Refresh')}
            </span>
          </button>

          <button
            onClick={clearAllData}
            className={`btn-secondary flex items-center space-x-2 text-red-600 hover:bg-red-50 ${
              isDarkMode ? 'hover:bg-red-900/20' : ''
            }`}
          >
            <Trash2 className='h-4 w-4' />
            <span className='hidden xs:inline'>
              {t('clearAllData', 'Clear All')}
            </span>
          </button>

          <button
            onClick={generateAllData}
            disabled={isGenerating}
            className='btn-primary flex items-center space-x-2'
          >
            {isGenerating ? (
              <>
                <RefreshCw className='h-4 w-4 animate-spin' />
                <span>{t('generating', 'Generating...')}</span>
              </>
            ) : (
              <>
                <Play className='h-4 w-4' />
                <span>{t('generateAll', 'Generate All')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Current Data Status */}
      <div
        className={`card p-6 ${
          isDarkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <h3
          className={`text-lg font-semibold mb-4 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}
        >
          {t('currentDataStatus', 'Current Data Status')}
        </h3>

        <div className='grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4'>
          <div
            className={`p-4 rounded-lg border ${
              isDarkMode
                ? 'bg-blue-900/20 border-blue-700'
                : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className='flex items-center space-x-2 mb-2'>
              <Users className='h-5 w-5 text-blue-600' />
              <h4
                className={`font-medium ${
                  isDarkMode ? 'text-blue-300' : 'text-blue-700'
                }`}
              >
                {t('users', 'Users')}
              </h4>
            </div>
            <div
              className={`text-2xl font-bold ${
                isDarkMode ? 'text-blue-300' : 'text-blue-700'
              }`}
            >
              {users.total}
            </div>
            <div
              className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {users.admin} Admin, {users.guru} Guru, {users.siswa} Siswa
            </div>
          </div>

          <div
            className={`p-4 rounded-lg border ${
              isDarkMode
                ? 'bg-green-900/20 border-green-700'
                : 'bg-green-50 border-green-200'
            }`}
          >
            <div className='flex items-center space-x-2 mb-2'>
              <GraduationCap className='h-5 w-5 text-green-600' />
              <h4
                className={`font-medium ${
                  isDarkMode ? 'text-green-300' : 'text-green-700'
                }`}
              >
                {t('classes', 'Classes')}
              </h4>
            </div>
            <div
              className={`text-2xl font-bold ${
                isDarkMode ? 'text-green-300' : 'text-green-700'
              }`}
            >
              {classes.total}
            </div>
            <div
              className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Active classes
            </div>
          </div>

          <div
            className={`p-4 rounded-lg border ${
              isDarkMode
                ? 'bg-purple-900/20 border-purple-700'
                : 'bg-purple-50 border-purple-200'
            }`}
          >
            <div className='flex items-center space-x-2 mb-2'>
              <BookOpen className='h-5 w-5 text-purple-600' />
              <h4
                className={`font-medium ${
                  isDarkMode ? 'text-purple-300' : 'text-purple-700'
                }`}
              >
                {t('subjects', 'Subjects')}
              </h4>
            </div>
            <div
              className={`text-2xl font-bold ${
                isDarkMode ? 'text-purple-300' : 'text-purple-700'
              }`}
            >
              {subjects.total}
            </div>
            <div
              className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Available subjects
            </div>
          </div>

          <div
            className={`p-4 rounded-lg border ${
              isDarkMode
                ? 'bg-orange-900/20 border-orange-700'
                : 'bg-orange-50 border-orange-200'
            }`}
          >
            <div className='flex items-center space-x-2 mb-2'>
              <MessageSquare className='h-5 w-5 text-orange-600' />
              <h4
                className={`font-medium ${
                  isDarkMode ? 'text-orange-300' : 'text-orange-700'
                }`}
              >
                {t('complaints', 'Complaints')}
              </h4>
            </div>
            <div
              className={`text-2xl font-bold ${
                isDarkMode ? 'text-orange-300' : 'text-orange-700'
              }`}
            >
              {complaints.total}
            </div>
            <div
              className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Total complaints
            </div>
          </div>
        </div>
      </div>

      {/* Data Categories Configuration and Generation Logs - Two Column Layout */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Left Column - Data Categories */}
        <div className='space-y-6'>
          <h3
            className={`text-lg font-semibold ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`}
          >
            {t('dataCategories', 'Data Categories')}
          </h3>

          <div className='space-y-4'>
            {dataCategories.map((category) => {
              const colors = getColorClasses(category.color);
              const isSelected = selectedCategories[category.id];
              const result = generationResults[category.id];

              return (
                <div
                  key={category.id}
                  className={`card p-4 border-2 transition-all ${
                    isSelected
                      ? `${colors.border} ${colors.bg}`
                      : isDarkMode
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className='flex flex-col gap-3'>
                    <div className='flex items-center space-x-3'>
                      <div className={`p-2 ${colors.button} rounded-lg`}>
                        <category.icon className='h-5 w-5' />
                      </div>
                      <div className='flex-1'>
                        <div className='flex items-center space-x-2 mb-1'>
                          <h4 className={`font-semibold ${colors.text}`}>
                            {category.title}
                          </h4>
                          {result && getStatusIcon(result.status)}
                        </div>
                        <p
                          className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          {category.description}
                        </p>
                      </div>
                    </div>

                    {/* Category Details */}
                    <div className='grid grid-cols-1 gap-1'>
                      {category.details.map((detail, index) => (
                        <div
                          key={index}
                          className={`text-xs p-2 rounded ${
                            isDarkMode
                              ? 'bg-gray-700/50 text-gray-300'
                              : 'bg-gray-50 text-gray-600'
                          }`}
                        >
                          • {detail}
                        </div>
                      ))}
                    </div>

                    {/* Controls */}
                    <div className='flex items-center justify-between pt-2'>
                      <label className='flex items-center space-x-2'>
                        <input
                          type='checkbox'
                          checked={isSelected}
                          onChange={(e) =>
                            setSelectedCategories((prev) => ({
                              ...prev,
                              [category.id]: e.target.checked,
                            }))
                          }
                          className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                        />
                        <span
                          className={`text-sm ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          {t('include', 'Include')}
                        </span>
                      </label>

                      <button
                        onClick={() => generateSampleData(category.id)}
                        disabled={isGenerating}
                        className={`px-3 py-1 rounded text-sm font-medium ${colors.button} disabled:opacity-50 min-w-[80px]`}
                      >
                        {t('generate', 'Generate')}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column - Generation Logs */}
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
              <Database className='h-5 w-5' />
              <span>{t('generationLogs', 'Generation Logs')}</span>
            </h3>
            <div className='flex items-center space-x-2'>
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
              <button
                onClick={() => {
                  const logText = logs
                    .map((log) => `[${log.timestamp}] ${log.message}`)
                    .join('\n');
                  navigator.clipboard.writeText(logText);
                  addLog('Logs copied to clipboard!', 'success');
                }}
                className={`text-sm px-3 py-1 rounded ${
                  isDarkMode
                    ? 'bg-blue-700 hover:bg-blue-600 text-blue-300'
                    : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
                }`}
              >
                {t('copyLogs', 'Copy Logs')}
              </button>
            </div>
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
                  'No logs yet. Generate some data to see results here.'
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
                      : log.type === 'warning'
                      ? 'text-yellow-400'
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

      {/* Usage Information */}
      <div
        className={`card p-6 ${
          isDarkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <h3
          className={`text-lg font-semibold mb-4 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}
        >
          {t('usageInformation', 'Usage Information')}
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <h4
              className={`font-medium mb-2 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`}
            >
              {t('whatThisDoes', 'What This Does')}
            </h4>
            <ul
              className={`space-y-1 text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <li>• Generates realistic test data for development</li>
              <li>• Creates users with different roles and permissions</li>
              <li>• Populates classes and subjects with relationships</li>
              <li>• Generates sample complaints for testing workflows</li>
            </ul>
          </div>

          <div>
            <h4
              className={`font-medium mb-2 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`}
            >
              {t('importantNotes', 'Important Notes')}
            </h4>
            <ul
              className={`space-y-1 text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <li>• This will create real data in your database</li>
              <li>• Use "Clear All" to remove generated data</li>
              <li>• Recommended for development environments only</li>
              <li>• Generated passwords are set to "password123"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleDataGenerator;
