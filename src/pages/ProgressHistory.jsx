import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
// import GroupService from '../apis/group'; // Commented out - using dummy data

// Dummy data for progress history
const DUMMY_GROUP_NAME = 'Quran Memorization Group';

const DUMMY_PROGRESS_SUMMARY = {
  today: {
    completed: 3,
    total: 5,
    completionRate: 60
  },
  week: {
    completed: 18,
    total: 25,
    completionRate: 72
  },
  month: {
    completed: 65,
    total: 100,
    completionRate: 65
  },
  year: {
    completed: 245,
    total: 365,
    completionRate: 67
  }
};

const DUMMY_PROGRESS_DATA = {
  today: {
    stats: {
      total: 5,
      completed: 3,
      missed: 2,
      completionRate: 60
    },
    records: [
      {
        taskTitle: 'Fajr Prayer',
        taskDescription: 'Perform Fajr prayer on time',
        status: 'completed',
        createdAt: new Date().toISOString(),
        group: { name: 'Quran Memorization Group' }
      },
      {
        taskTitle: 'Quran Recitation',
        taskDescription: 'Recite 2 pages of Quran',
        status: 'completed',
        createdAt: new Date().toISOString(),
        group: { name: 'Quran Memorization Group' }
      },
      {
        taskTitle: 'Dhikr After Salah',
        taskDescription: 'Complete morning and evening adhkar',
        status: 'completed',
        createdAt: new Date().toISOString(),
        group: { name: 'Quran Memorization Group' }
      },
      {
        taskTitle: 'Tahajjud Prayer',
        taskDescription: 'Wake up for night prayer',
        status: 'missed',
        createdAt: new Date().toISOString(),
        group: { name: 'Quran Memorization Group' }
      },
      {
        taskTitle: 'Islamic Study',
        taskDescription: 'Study hadith for 30 minutes',
        status: 'missed',
        createdAt: new Date().toISOString(),
        group: { name: 'Quran Memorization Group' }
      }
    ]
  },
  week: {
    stats: {
      total: 25,
      completed: 18,
      missed: 7,
      completionRate: 72
    },
    records: [
      {
        taskTitle: 'Fajr Prayer',
        taskDescription: 'Perform Fajr prayer on time',
        status: 'completed',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        group: { name: 'Quran Memorization Group' }
      },
      {
        taskTitle: 'Fajr Prayer',
        taskDescription: 'Perform Fajr prayer on time',
        status: 'completed',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        group: { name: 'Quran Memorization Group' }
      },
      {
        taskTitle: 'Fajr Prayer',
        taskDescription: 'Perform Fajr prayer on time',
        status: 'completed',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        group: { name: 'Quran Memorization Group' }
      },
      {
        taskTitle: 'Fajr Prayer',
        taskDescription: 'Perform Fajr prayer on time',
        status: 'completed',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        group: { name: 'Quran Memorization Group' }
      },
      {
        taskTitle: 'Fajr Prayer',
        taskDescription: 'Perform Fajr prayer on time',
        status: 'missed',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        group: { name: 'Quran Memorization Group' }
      },
      {
        taskTitle: 'Quran Recitation',
        taskDescription: 'Recite 2 pages of Quran',
        status: 'completed',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        group: { name: 'Quran Memorization Group' }
      },
      {
        taskTitle: 'Quran Recitation',
        taskDescription: 'Recite 2 pages of Quran',
        status: 'completed',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        group: { name: 'Quran Memorization Group' }
      },
      {
        taskTitle: 'Quran Recitation',
        taskDescription: 'Recite 2 pages of Quran',
        status: 'completed',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        group: { name: 'Quran Memorization Group' }
      },
      {
        taskTitle: 'Quran Recitation',
        taskDescription: 'Recite 2 pages of Quran',
        status: 'missed',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        group: { name: 'Quran Memorization Group' }
      },
      {
        taskTitle: 'Dhikr After Salah',
        taskDescription: 'Complete morning and evening adhkar',
        status: 'completed',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        group: { name: 'Quran Memorization Group' }
      },
      {
        taskTitle: 'Dhikr After Salah',
        taskDescription: 'Complete morning and evening adhkar',
        status: 'completed',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        group: { name: 'Quran Memorization Group' }
      },
      {
        taskTitle: 'Dhikr After Salah',
        taskDescription: 'Complete morning and evening adhkar',
        status: 'completed',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        group: { name: 'Quran Memorization Group' }
      },
      {
        taskTitle: 'Dhikr After Salah',
        taskDescription: 'Complete morning and evening adhkar',
        status: 'completed',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        group: { name: 'Quran Memorization Group' }
      },
      {
        taskTitle: 'Tahajjud Prayer',
        taskDescription: 'Wake up for night prayer',
        status: 'completed',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        group: { name: 'Quran Memorization Group' }
      },
      {
        taskTitle: 'Tahajjud Prayer',
        taskDescription: 'Wake up for night prayer',
        status: 'completed',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        group: { name: 'Quran Memorization Group' }
      },
      {
        taskTitle: 'Tahajjud Prayer',
        taskDescription: 'Wake up for night prayer',
        status: 'missed',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        group: { name: 'Quran Memorization Group' }
      },
      {
        taskTitle: 'Tahajjud Prayer',
        taskDescription: 'Wake up for night prayer',
        status: 'missed',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        group: { name: 'Quran Memorization Group' }
      },
      {
        taskTitle: 'Islamic Study',
        taskDescription: 'Study hadith for 30 minutes',
        status: 'completed',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        group: { name: 'Quran Memorization Group' }
      },
      {
        taskTitle: 'Islamic Study',
        taskDescription: 'Study hadith for 30 minutes',
        status: 'completed',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        group: { name: 'Quran Memorization Group' }
      },
      {
        taskTitle: 'Islamic Study',
        taskDescription: 'Study hadith for 30 minutes',
        status: 'missed',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        group: { name: 'Quran Memorization Group' }
      },
      {
        taskTitle: 'Charity',
        taskDescription: 'Give sadaqah or help someone',
        status: 'completed',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        group: { name: 'Quran Memorization Group' }
      },
      {
        taskTitle: 'Charity',
        taskDescription: 'Give sadaqah or help someone',
        status: 'completed',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        group: { name: 'Quran Memorization Group' }
      },
      {
        taskTitle: 'Charity',
        taskDescription: 'Give sadaqah or help someone',
        status: 'missed',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        group: { name: 'Quran Memorization Group' }
      },
      {
        taskTitle: 'Dua for Parents',
        taskDescription: 'Make special dua for parents',
        status: 'completed',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        group: { name: 'Quran Memorization Group' }
      },
      {
        taskTitle: 'Dua for Parents',
        taskDescription: 'Make special dua for parents',
        status: 'completed',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        group: { name: 'Quran Memorization Group' }
      }
    ]
  },
  month: {
    stats: {
      total: 100,
      completed: 65,
      missed: 35,
      completionRate: 65
    },
    records: [] // Will use week records as sample
  },
  year: {
    stats: {
      total: 365,
      completed: 245,
      missed: 120,
      completionRate: 67
    },
    records: [] // Will use week records as sample
  },
  all: {
    stats: {
      total: 500,
      completed: 340,
      missed: 160,
      completionRate: 68
    },
    records: [] // Will use week records as sample
  }
};

// Copy week records to other periods for demonstration
DUMMY_PROGRESS_DATA.month.records = [...DUMMY_PROGRESS_DATA.week.records];
DUMMY_PROGRESS_DATA.year.records = [...DUMMY_PROGRESS_DATA.week.records];
DUMMY_PROGRESS_DATA.all.records = [...DUMMY_PROGRESS_DATA.week.records];

const ProgressHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { groupId } = useParams();

  // Group info state
  const [groupName, setGroupName] = useState('');

  // Progress History states
  const [progressData, setProgressData] = useState(null);
  const [progressSummary, setProgressSummary] = useState(null);
  const [progressPeriod, setProgressPeriod] = useState('week');
  const [progressLoading, setProgressLoading] = useState(true);
  const [progressSearch, setProgressSearch] = useState('');

  useEffect(() => {
    if (user && user.id) {
      loadGroupInfo();
      loadProgressHistory();
    }
  }, [user, groupId]);

  // Load group info - USING DUMMY DATA
  const loadGroupInfo = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      setGroupName(DUMMY_GROUP_NAME);
    } catch (error) {
      console.error('Error loading group info:', error);
    }
  };

  // Load progress history - USING DUMMY DATA
  const loadProgressHistory = async (period = progressPeriod) => {
    try {
      setProgressLoading(true);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Set dummy data based on period
      setProgressData(DUMMY_PROGRESS_DATA[period]);
      setProgressSummary(DUMMY_PROGRESS_SUMMARY);

    } catch (error) {
      console.error('Error loading progress:', error);
      toast.error('Failed to load progress history');
    } finally {
      setProgressLoading(false);
    }
  };

  // COMMENTED OUT: Original API implementation
  /*
  const loadGroupInfo = async () => {
    try {
      const response = await GroupService.getGroupDetails(groupId);
      if (response.data && response.data.group) {
        setGroupName(response.data.group.name);
      }
    } catch (error) {
      console.error('Error loading group info:', error);
    }
  };

  const loadProgressHistory = async (period = progressPeriod) => {
    try {
      setProgressLoading(true);
      const [historyResponse, summaryResponse] = await Promise.all([
        GroupService.getProgressHistory(period, null, null, groupId),
        GroupService.getProgressSummary(groupId)
      ]);
      
      if (historyResponse.data) {
        setProgressData(historyResponse.data);
      }
      if (summaryResponse.data) {
        setProgressSummary(summaryResponse.data);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
      toast.error('Failed to load progress history');
    } finally {
      setProgressLoading(false);
    }
  };
  */

  // Handle period change
  const handlePeriodChange = (newPeriod) => {
    setProgressPeriod(newPeriod);
    loadProgressHistory(newPeriod);
  };

  if (!user || !user.id) {
    return (
      <div className="min-h-screen bg-primary-600">
        <Navbar />
        <div className="pt-24 p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mb-4"></div>
          <p className="text-white">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-600 bg-gradient-to-b from-primary-700 to-primary-800">
      <Navbar />

      <div className="max-w-[95%] mx-auto px-4 pt-32 pb-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-indigo-100 mb-6">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-gray-200 pb-4 mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition duration-150"
                >
                  <i className="fas fa-arrow-left text-lg"></i>
                </button>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    <i className="fas fa-chart-line text-indigo-600 mr-3"></i>
                    My Progress History
                  </h1>
                  {groupName && (
                    <p className="text-sm text-gray-500 mt-1 ml-10">
                      <i className="fas fa-users mr-2"></i>
                      {groupName}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <i className="fas fa-user mr-2"></i>
                {user.name || user.email}
              </div>
            </div>

            {/* Period Selector */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['today', 'week', 'month', 'year', 'all'].map(period => (
                <button
                  key={period}
                  onClick={() => handlePeriodChange(period)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-150 ${progressPeriod === period
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>

            {progressLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-gray-500">Loading your progress...</p>
              </div>
            ) : (
              <>
                {/* Summary Cards */}
                {progressSummary && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-blue-50 rounded-xl p-5 border border-blue-200 hover:shadow-md transition duration-150">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-blue-600 font-medium">Today</div>
                        <i className="fas fa-calendar-day text-blue-400"></i>
                      </div>
                      <div className="text-3xl font-bold text-blue-800">{progressSummary.today?.completed || 0}</div>
                      <div className="text-xs text-blue-500 mb-2">of {progressSummary.today?.total || 0} tasks</div>
                      <div className="bg-blue-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 rounded-full h-2.5 transition-all duration-500"
                          style={{ width: `${progressSummary.today?.completionRate || 0}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-blue-600 mt-1 text-right font-medium">
                        {progressSummary.today?.completionRate || 0}%
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-xl p-5 border border-green-200 hover:shadow-md transition duration-150">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-green-600 font-medium">This Week</div>
                        <i className="fas fa-calendar-week text-green-400"></i>
                      </div>
                      <div className="text-3xl font-bold text-green-800">{progressSummary.week?.completed || 0}</div>
                      <div className="text-xs text-green-500 mb-2">of {progressSummary.week?.total || 0} tasks</div>
                      <div className="bg-green-200 rounded-full h-2.5">
                        <div
                          className="bg-green-600 rounded-full h-2.5 transition-all duration-500"
                          style={{ width: `${progressSummary.week?.completionRate || 0}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-green-600 mt-1 text-right font-medium">
                        {progressSummary.week?.completionRate || 0}%
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-xl p-5 border border-purple-200 hover:shadow-md transition duration-150">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-purple-600 font-medium">This Month</div>
                        <i className="fas fa-calendar-alt text-purple-400"></i>
                      </div>
                      <div className="text-3xl font-bold text-purple-800">{progressSummary.month?.completed || 0}</div>
                      <div className="text-xs text-purple-500 mb-2">of {progressSummary.month?.total || 0} tasks</div>
                      <div className="bg-purple-200 rounded-full h-2.5">
                        <div
                          className="bg-purple-600 rounded-full h-2.5 transition-all duration-500"
                          style={{ width: `${progressSummary.month?.completionRate || 0}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-purple-600 mt-1 text-right font-medium">
                        {progressSummary.month?.completionRate || 0}%
                      </div>
                    </div>

                    <div className="bg-orange-50 rounded-xl p-5 border border-orange-200 hover:shadow-md transition duration-150">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-orange-600 font-medium">This Year</div>
                        <i className="fas fa-calendar text-orange-400"></i>
                      </div>
                      <div className="text-3xl font-bold text-orange-800">{progressSummary.year?.completed || 0}</div>
                      <div className="text-xs text-orange-500 mb-2">of {progressSummary.year?.total || 0} tasks</div>
                      <div className="bg-orange-200 rounded-full h-2.5">
                        <div
                          className="bg-orange-600 rounded-full h-2.5 transition-all duration-500"
                          style={{ width: `${progressSummary.year?.completionRate || 0}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-orange-600 mt-1 text-right font-medium">
                        {progressSummary.year?.completionRate || 0}%
                      </div>
                    </div>
                  </div>
                )}

                {/* Stats for Selected Period */}
                {progressData && progressData.stats && (
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8 border border-indigo-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <i className="fas fa-chart-bar text-indigo-600 mr-2"></i>
                      {progressPeriod.charAt(0).toUpperCase() + progressPeriod.slice(1)} Statistics
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center bg-white rounded-lg p-4 shadow-sm">
                        <div className="text-3xl font-bold text-indigo-600">{progressData.stats.total}</div>
                        <div className="text-sm text-gray-500 mt-1">Total Tasks</div>
                      </div>
                      <div className="text-center bg-white rounded-lg p-4 shadow-sm">
                        <div className="text-3xl font-bold text-green-600">{progressData.stats.completed}</div>
                        <div className="text-sm text-gray-500 mt-1">Completed</div>
                      </div>
                      <div className="text-center bg-white rounded-lg p-4 shadow-sm">
                        <div className="text-3xl font-bold text-red-600">{progressData.stats.missed}</div>
                        <div className="text-sm text-gray-500 mt-1">Missed</div>
                      </div>
                      <div className="text-center bg-white rounded-lg p-4 shadow-sm">
                        <div className="text-3xl font-bold text-blue-600">{progressData.stats.completionRate}%</div>
                        <div className="text-sm text-gray-500 mt-1">Success Rate</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Task Records Section */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <i className="fas fa-history text-indigo-600 mr-2"></i>
                      Task History
                    </h3>

                    {/* Progress Search Bar */}
                    <div className="relative mb-6">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fas fa-search text-gray-400"></i>
                      </div>
                      <input
                        type="text"
                        placeholder="Search tasks by name..."
                        value={progressSearch}
                        onChange={(e) => setProgressSearch(e.target.value)}
                        className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white text-sm transition-all duration-200"
                      />
                      {progressSearch && (
                        <button
                          onClick={() => setProgressSearch('')}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          <i className="fas fa-times-circle"></i>
                        </button>
                      )}
                    </div>

                    {/* Task List */}
                    <div className="space-y-4">
                      {progressData && progressData.records && progressData.records.length > 0 ? (
                        (() => {
                          // Group records by taskTitle and filter by search
                          const groupedTasks = progressData.records
                            .filter(record => record.taskTitle.toLowerCase().includes(progressSearch.toLowerCase()))
                            .reduce((acc, record) => {
                              const key = record.taskTitle;
                              if (!acc[key]) {
                                acc[key] = {
                                  taskTitle: record.taskTitle,
                                  taskDescription: record.taskDescription,
                                  completedCount: 0,
                                  missedCount: 0,
                                  records: [],
                                  lastCompletedAt: null,
                                  groups: new Set()
                                };
                              }
                              if (record.status === 'completed') {
                                acc[key].completedCount++;
                                if (!acc[key].lastCompletedAt || new Date(record.createdAt) > new Date(acc[key].lastCompletedAt)) {
                                  acc[key].lastCompletedAt = record.createdAt;
                                }
                              } else {
                                acc[key].missedCount++;
                              }
                              acc[key].records.push(record);
                              if (record.group?.name) {
                                acc[key].groups.add(record.group.name);
                              }
                              return acc;
                            }, {});

                          const taskGroups = Object.values(groupedTasks);

                          if (taskGroups.length === 0 && progressSearch) {
                            return (
                              <div className="text-center py-12 text-gray-500">
                                <i className="fas fa-search text-4xl text-gray-300 mb-4"></i>
                                <p>No tasks found matching "{progressSearch}"</p>
                                <button
                                  onClick={() => setProgressSearch('')}
                                  className="mt-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                                >
                                  Clear search
                                </button>
                              </div>
                            );
                          }

                          return taskGroups.map((taskGroup, index) => (
                            <div
                              key={index}
                              className={`p-5 rounded-xl border-2 transition duration-150 hover:shadow-md ${taskGroup.completedCount > 0 && taskGroup.missedCount === 0
                                ? 'border-green-200 bg-green-50'
                                : taskGroup.completedCount === 0
                                  ? 'border-red-200 bg-red-50'
                                  : 'border-yellow-200 bg-yellow-50'
                                }`}
                            >
                              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 flex-wrap mb-2">
                                    <h4 className="font-bold text-gray-900 text-lg">{taskGroup.taskTitle}</h4>
                                    <span className="px-3 py-1 text-xs rounded-full font-medium bg-green-200 text-green-800 flex items-center gap-1">
                                      <i className="fas fa-check-circle"></i>
                                      {taskGroup.completedCount} {taskGroup.completedCount === 1 ? 'time' : 'times'}
                                    </span>
                                    <span className="px-3 py-1 text-xs rounded-full font-medium bg-red-200 text-red-800 flex items-center gap-1">
                                      <i className="fas fa-times-circle"></i>
                                      {taskGroup.missedCount} {taskGroup.missedCount === 1 ? 'miss' : 'misses'}
                                    </span>
                                  </div>
                                  {taskGroup.taskDescription && (
                                    <p className="text-sm text-gray-600 mb-3">{taskGroup.taskDescription}</p>
                                  )}
                                  <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                                    {taskGroup.lastCompletedAt && (
                                      <span className="flex items-center">
                                        <i className="fas fa-calendar-check mr-1 text-green-500"></i>
                                        Last completed: {new Date(taskGroup.lastCompletedAt).toLocaleDateString()}
                                      </span>
                                    )}
                                    {taskGroup.groups.size > 0 && (
                                      <span className="flex items-center">
                                        <i className="fas fa-users mr-1 text-indigo-500"></i>
                                        {Array.from(taskGroup.groups).join(', ')}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col items-center bg-white rounded-lg p-3 shadow-sm min-w-[100px]">
                                  <div className="text-2xl font-bold text-indigo-600">
                                    {Math.round((taskGroup.completedCount / (taskGroup.completedCount + taskGroup.missedCount)) * 100)}%
                                  </div>
                                  <div className="text-xs text-gray-500">Success Rate</div>
                                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div
                                      className={`h-2 rounded-full transition-all duration-300 ${Math.round((taskGroup.completedCount / (taskGroup.completedCount + taskGroup.missedCount)) * 100) >= 70
                                        ? 'bg-green-500'
                                        : Math.round((taskGroup.completedCount / (taskGroup.completedCount + taskGroup.missedCount)) * 100) >= 40
                                          ? 'bg-yellow-500'
                                          : 'bg-red-500'
                                        }`}
                                      style={{ width: `${Math.round((taskGroup.completedCount / (taskGroup.completedCount + taskGroup.missedCount)) * 100)}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ));
                        })()
                      ) : (
                        <div className="text-center py-16 text-gray-500">
                          <i className="fas fa-history text-5xl text-gray-300 mb-4"></i>
                          <p className="text-lg font-medium">No task history found for this period</p>
                          <p className="text-sm text-gray-400 mt-2">Complete or miss some tasks to see your progress here</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressHistory;
