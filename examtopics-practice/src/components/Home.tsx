import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAllProgress } from '../hooks/useAllProgress';
import { Exam } from '../types';
import { getExamDescription, getExamName } from '../utils/examUtils';
import FloatingButtons from './FloatingButtons';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';
import UserMenu from './UserMenu';

const Home: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const { getProgressStats } = useAllProgress();
  const { t, language } = useLanguage();

  useEffect(() => {
    const loadExams = async () => {
      try {
        const response = await fetch('/exams/exams.json');
        const data = await response.json();
        setExams(data);
      } catch (error) {
        console.error('Error loading exams:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExams();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
      case t('beginner'):
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
      case t('intermediate'):
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
      case t('advanced'):
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'AWS':
        return 'bg-orange-100 text-orange-800';
      case 'Azure':
        return 'bg-blue-100 text-blue-800';
      case 'GCP':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredExams = exams.filter(exam => {
    const examName = getExamName(exam, language);
    const examDescription = getExamDescription(exam, language);

    const matchesSearch = examName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      examDescription.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesCategory = selectedCategory === 'all' || exam.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' ||
      exam.difficulty === selectedDifficulty ||
      (selectedDifficulty === t('beginner') && exam.difficulty === 'Beginner') ||
      (selectedDifficulty === t('intermediate') && exam.difficulty === 'Intermediate') ||
      (selectedDifficulty === t('advanced') && exam.difficulty === 'Advanced');

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const categories = ['all', ...Array.from(new Set(exams.map(exam => exam.category)))];
  const difficulties = ['all', t('beginner'), t('intermediate'), t('advanced')];

  const handleExamClick = (exam: Exam, mode: 'exam' | 'practice' = 'exam') => {
    const url = mode === 'practice'
      ? `/exam/${exam.id}?mode=practice`
      : `/exam/${exam.id}`;
    navigate(url, { state: { exam } });
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loadingExamList')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Header - Sticky */}
      <div className="sticky top-0 z-50 bg-gray-100 dark:bg-gray-900 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white transition-colors truncate flex-1 min-w-0">
                {t('examPracticePlatform')}
              </h1>
              <div className="flex items-center gap-2 flex-shrink-0">
                <UserMenu />
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4 transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                🔍 {t('search')}
              </label>
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                📂 {t('category')}
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? t('all') : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                ⚡ {t('difficulty')}
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? t('all') : difficulty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {
          filteredExams.length > 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 text-sm transition-colors">
              <p className="mb-3">
                {t('totalExams')}: {exams.length} |&nbsp;
                {t('filteredResults')}: {filteredExams.length}
              </p>
            </div>
          )
        }

        {/* Exam Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              onClick={() => handleExamClick(exam)}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-all cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <h3
                  className="text-xl font-semibold text-gray-800 dark:text-white line-clamp-2 transition-colors cursor-help"
                  title={getExamName(exam, language)}
                >
                  {getExamName(exam, language)}
                </h3>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exam.difficulty)}`}>
                    {exam.difficulty}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(exam.category)}`}>
                    {exam.category}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 transition-colors">
                {getExamDescription(exam, language)}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{exam.questionCount}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{t('questions')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{exam.estimatedTime}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{t('minutes')}</div>
                </div>
              </div>

              {/* Progress */}
              {(() => {
                const progressStats = getProgressStats(exam.id);

                if (progressStats && progressStats.totalAnswers > 0) {
                  const percentage = Math.round((progressStats.totalAnswers / exam.questionCount) * 100);

                  return (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">{t('progress')}</span>
                        <span className="text-sm text-blue-600 dark:text-blue-300">{percentage}%</span>
                      </div>
                      <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-blue-600 dark:text-blue-300 mt-1">
                        <span>{progressStats.totalAnswers}/{exam.questionCount} {t('questionsAnswered')}</span>
                        <span>{progressStats.accuracy}% {t('accuracy')}</span>
                      </div>
                      {progressStats.markedForTraining > 0 && (
                        <div className="text-xs text-orange-600 dark:text-orange-300 mt-1">
                          📚 {progressStats.markedForTraining} {t('markedForTraining')}
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              })()}

              {/* Tags */}
              <div className="mb-4">
                <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
                  {exam.tags.slice(0, isMobile ? 4 : 5).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full transition-colors whitespace-nowrap flex-shrink-0 border border-gray-200 dark:border-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                  {exam.tags.length > (isMobile ? 4 : 5) && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full transition-colors whitespace-nowrap flex-shrink-0 border border-gray-200 dark:border-gray-600">
                      +{exam.tags.length - (isMobile ? 4 : 5)}
                    </span>
                  )}
                </div>
              </div>

              {/* Exam Buttons */}
              {(() => {
                const progressStats = getProgressStats(exam.id);
                const hasProgress = progressStats && progressStats.totalAnswers > 0;
                const hasTraining = progressStats && progressStats.markedForTraining > 0;

                // Case 1: No progress - show only Start Exam button
                if (!hasProgress) {
                  return (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExamClick(exam);
                      }}
                      className="w-full py-2 px-4 rounded-lg transition-colors font-medium bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {t('startExam')}
                    </button>
                  );
                }

                // Case 2: Has progress and has training - show both buttons on same line
                if (hasProgress && hasTraining) {
                  return (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExamClick(exam);
                        }}
                        className="flex-1 py-2 px-4 rounded-lg transition-colors font-medium bg-green-600 hover:bg-green-700 text-white"
                      >
                        {t('continueExam')}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExamClick(exam, 'practice');
                        }}
                        className="flex-1 py-2 px-4 rounded-lg transition-colors font-medium bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        {t('practiceExam')}
                      </button>
                    </div>
                  );
                }

                // Case 3: Has progress but no training - show only Continue Exam button
                return (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExamClick(exam);
                    }}
                    className="w-full py-2 px-4 rounded-lg transition-colors font-medium bg-green-600 hover:bg-green-700 text-white"
                  >
                    {t('continueExam')}
                  </button>
                );
              })()}
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredExams.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 transition-colors">
              {t('noResults')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 transition-colors">
              {t('tryChangingFilters')}
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm transition-colors">
          <p>{t('copyright')}</p>
        </footer>
      </div>

      {/* Floating Buttons */}
      <FloatingButtons
        onScrollToTop={handleScrollToTop}
        onScrollToCurrentQuestion={() => { }}
        hasCurrentQuestion={false}
      />
    </div>
  );
};

export default Home;
