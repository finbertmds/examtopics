import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { useExams } from '../hooks/useExams';
import { useProgress } from '../hooks/useProgress';
import { HistoryEntry } from '../types';
import { getExamName } from '../utils/examUtils';
import { toast } from 'react-toastify';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  examId?: string; // If provided, shows only that exam's history
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, examId }) => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { getHistory, getExamStats, getCompletedExamIds, getDailyTracking } = useProgress();
  const { exams, findExamById } = useExams();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'history' | 'stats' | 'tracking'>('history');
  const [selectedExamForStats, setSelectedExamForStats] = useState<string>(examId || '');
  const [completedExamIds, setCompletedExamIds] = useState<string[]>([]);
  const [dailyTracking, setDailyTracking] = useState<Array<{ date: string; count: number }>>([]);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, examId]);

  useEffect(() => {
    const loadCompletedIds = async () => {
      if (!examId) {
        try {
          const ids = await getCompletedExamIds();
          setCompletedExamIds(ids);
          if (ids.length > 0 && !selectedExamForStats) {
            setSelectedExamForStats(ids[0]);
          }
        } catch (error) {
          console.error('Error loading completed exam IDs:', error);
          toast.error('Error loading completed exam IDs')
        }
      }
    };
    loadCompletedIds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, examId]);

  useEffect(() => {
    const loadStats = async () => {
      if (activeTab === 'stats' && selectedExamForStats) {
        setLoading(true);
        try {
          const statsData = await getExamStats(selectedExamForStats);
          setStats(statsData);
        } catch (error) {
          console.error('Error loading stats:', error);
          toast.error('Error loading stats')
          setStats(null);
        } finally {
          setLoading(false);
        }
      }
    };
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExamForStats, activeTab]);

  useEffect(() => {
    const loadTracking = async () => {
      if (activeTab === 'tracking') {
        setLoading(true);
        try {
          const trackingData = await getDailyTracking(examId);

          // Validate and filter data
          let validData: Array<{ date: string; count: number }> = [];
          if (Array.isArray(trackingData)) {
            validData = trackingData.filter((item: any): item is { date: string; count: number } => {
              const isValid = item && item.date && typeof item.count === 'number';
              if (!isValid) {
                console.log('Invalid item:', item);
              }
              return isValid;
            });
          }
          setDailyTracking(validData);
        } catch (error) {
          console.error('Error loading daily tracking:', error);
          toast.error('Error loading daily tracking')
          setDailyTracking([]);
        } finally {
          setLoading(false);
        }
      }
    };
    loadTracking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const historyData = await getHistory(examId);
      setHistory(historyData || []);
      if (examId && activeTab === 'stats') {
        const statsData = await getExamStats(examId);
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error loading history data:', error);
      toast.error('Error loading history data')
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatChartDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600 dark:text-green-400';
    if (accuracy >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getAccuracyBgColor = (accuracy: number) => {
    if (accuracy >= 80) return 'bg-green-100 dark:bg-green-900';
    if (accuracy >= 60) return 'bg-yellow-100 dark:bg-yellow-900';
    return 'bg-red-100 dark:bg-red-900';
  };

  const getExamDisplayName = (examId: string): string => {
    const exam = exams.find(e => e.code === examId);
    if (exam) {
      return getExamName(exam, language);
    }
    return examId; // Fallback to examId if exam not found
  };

  const handleExamClick = async (examIdFromHistory: string) => {
    const exam = await findExamById(examIdFromHistory);
    if (exam) {
      navigate(`/exam/${examIdFromHistory}`, { state: { exam } });
      onClose(); // Close the modal
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-4xl transform rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {examId ? `${t('exam')} History` : t('allHistory')}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'history'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              {t('history')}
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'stats'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              {t('statistics')}
            </button>
            <button
              onClick={() => setActiveTab('tracking')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'tracking'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              {t('tracking')}
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">{t('loading')}</span>
              </div>
            ) : activeTab === 'history' ? (
              <div className="space-y-4">
                {history.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-500 dark:text-gray-400 mb-3">
                      {t('noHistoryFound')}
                    </div>
                    <div className="inline-block bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-left max-w-md">
                      <div className="flex items-start gap-3">
                        <div className="text-blue-600 dark:text-blue-400 text-xl flex-shrink-0">💡</div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          {t('submitExamHint')}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  history.map((entry, index) => (
                    <div
                      key={entry._id || index}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getAccuracyBgColor(entry.score.accuracy)} ${getAccuracyColor(entry.score.accuracy)}`}>
                            {entry.score.accuracy}%
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {entry.score.correctAnswers}/{entry.score.totalQuestions} {t('correct')}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(entry.submittedAt)}
                        </div>
                      </div>

                      {!examId && (
                        <div className="mb-3 pb-3 border-b border-gray-200 dark:border-gray-600">
                          <div className="text-sm">
                            <span className="text-gray-500 dark:text-gray-400">{t('exam')}:</span>
                            <button
                              onClick={() => handleExamClick(entry.examId)}
                              className="ml-1 font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline cursor-pointer transition-colors"
                            >
                              {getExamDisplayName(entry.examId)}
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">{t('answered')}:</span>
                          <span className="ml-1 font-medium">{entry.answeredCount}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">{t('training')}:</span>
                          <span className="ml-1 font-medium">{entry.markedForTraining.length}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">{t('accuracy')}:</span>
                          <span className={`ml-1 font-medium ${getAccuracyColor(entry.score.accuracy)}`}>
                            {entry.score.accuracy}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : activeTab === 'stats' ? (
              <div className="space-y-6">
                {!examId && completedExamIds.length > 0 && (
                  <div className="mb-4 flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      {t('selectExam')}:
                    </label>
                    <select
                      value={selectedExamForStats}
                      onChange={(e) => setSelectedExamForStats(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    >
                      {completedExamIds.map(id => (
                        <option key={id} value={id}>{getExamDisplayName(id)}</option>
                      ))}
                    </select>
                  </div>
                )}
                {stats ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {stats.totalSubmissions}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {t('totalSubmissions')}
                      </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {stats.avgAccuracy?.toFixed(1) || 0}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {t('averageAccuracy')}
                      </div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {stats.avgAnsweredCount?.toFixed(0) || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {t('averageAnswered')}
                      </div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {stats.maxAccuracy?.toFixed(1) || 0}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {t('bestScore')}
                      </div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {stats.minAccuracy?.toFixed(1) || 0}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {t('worstScore')}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    {t('noStatsAvailable')}
                  </div>
                )}
              </div>
            ) : activeTab === 'tracking' ? (
              <div className="space-y-6">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">{t('loading')}</span>
                  </div>
                ) : dailyTracking.length > 0 ? (
                  <>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {t('dailyProgress')}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('questionsAnsweredDaily')}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Days: {dailyTracking.length} | Total {t('questions')}: {dailyTracking.reduce((sum, item) => sum + item.count, 0)}
                      </p>
                    </div>
                    <div className="w-full bg-white dark:bg-gray-800 rounded-lg p-4" style={{ minHeight: '350px' }}>
                      <ResponsiveContainer width="100%" height={350}>
                        <LineChart
                          data={dailyTracking}
                          margin={{ top: 5, right: 30, left: 20, bottom: 80 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" className="opacity-30" />
                          <XAxis
                            dataKey="date"
                            stroke="#6B7280"
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            tickFormatter={formatChartDate}
                          />
                          <YAxis
                            stroke="#6B7280"
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            allowDecimals={false}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1F2937',
                              border: '1px solid #374151',
                              borderRadius: '0.5rem',
                              color: '#F3F4F6'
                            }}
                            labelStyle={{ color: '#9CA3AF', marginBottom: '4px' }}
                            formatter={(value: any) => [value, t('questionsAnswered')]}
                            labelFormatter={(label: string) => formatDate(label)}
                          />
                          <Legend
                            wrapperStyle={{ color: '#6B7280', paddingTop: '20px' }}
                          />
                          <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            dot={{ fill: '#3B82F6', r: 4 }}
                            activeDot={{ r: 6 }}
                            name={t('questionsAnswered')}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <div>{t('noTrackingData')}</div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
