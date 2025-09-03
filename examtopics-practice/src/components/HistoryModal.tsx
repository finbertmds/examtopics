import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useProgress } from '../hooks/useProgress';

interface HistoryEntry {
  _id: string;
  examId: string;
  progress: Record<string, any>;
  markedForTraining: string[];
  score: {
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
  };
  answeredCount: number;
  submittedAt: string;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  examId?: string; // If provided, shows only that exam's history
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, examId }) => {
  const { t } = useLanguage();
  const { getHistory, getExamStats } = useProgress(examId || '');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'history' | 'stats'>('history');

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, examId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [historyData, statsData] = await Promise.all([
        getHistory(examId),
        examId ? getExamStats(examId) : null
      ]);
      setHistory(historyData || []);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading history data:', error);
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
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'history'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {t('history')}
            </button>
            {examId && (
              <button
                onClick={() => setActiveTab('stats')}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'stats'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {t('statistics')}
              </button>
            )}
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
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    {t('noHistoryFound')}
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
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">{t('examId')}:</span>
                          <span className="ml-1 font-medium">{entry.examId}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-6">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
