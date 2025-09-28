import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAllProgress } from '../hooks/useAllProgress';
import { useExams } from '../hooks/useExams';
import { Exam } from '../types';
import { getExamDescription, getExamName } from '../utils/examUtils';
import ExamCard from './ExamCard';
import FloatingButtons from './FloatingButtons';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';
import UserMenu from './UserMenu';

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const { getProgressStats } = useAllProgress();
  const { t, language } = useLanguage();
  const { exams, loading, error } = useExams();


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
  }).sort((a, b) => {
    // Sort exams with progress first, then by progress percentage (descending)
    const progressA = getProgressStats(a.id);
    const progressB = getProgressStats(b.id);

    const hasProgressA = progressA && progressA.totalAnswers > 0;
    const hasProgressB = progressB && progressB.totalAnswers > 0;

    // If one has progress and the other doesn't, prioritize the one with progress
    if (hasProgressA && !hasProgressB) return -1;
    if (!hasProgressA && hasProgressB) return 1;

    // If both have progress, sort by progress percentage (descending)
    if (hasProgressA && hasProgressB) {
      const percentageA = Math.round((progressA.totalAnswers / a.questionCount) * 100);
      const percentageB = Math.round((progressB.totalAnswers / b.questionCount) * 100);
      return percentageB - percentageA;
    }

    // If neither has progress, maintain original order (by name)
    const nameA = getExamName(a, language);
    const nameB = getExamName(b, language);
    return nameA.localeCompare(nameB);
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
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">{t('loadingExamList')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{t('errorLoadingExams')}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('retry')}
          </button>
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
        {(() => {
          const examsWithProgress = filteredExams.filter(exam => {
            const progress = getProgressStats(exam.id);
            return progress && progress.totalAnswers > 0;
          });

          const examsWithoutProgress = filteredExams.filter(exam => {
            const progress = getProgressStats(exam.id);
            return !progress || progress.totalAnswers === 0;
          });

          return (
            <>
              {/* Exams with Progress */}
              {examsWithProgress.length > 0 && (
                <>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                      📊 {t('examsInProgress')} ({examsWithProgress.length})
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {examsWithProgress.map((exam) => (
                      <ExamCard
                        key={exam.id}
                        exam={exam}
                        language={language}
                        isMobile={isMobile}
                        getProgressStats={getProgressStats}
                        onExamClick={handleExamClick}
                        getDifficultyColor={getDifficultyColor}
                        getCategoryColor={getCategoryColor}
                        t={t}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Exams without Progress */}
              {examsWithoutProgress.length > 0 && (
                <>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                      🆕 {t('availableExams')} ({examsWithoutProgress.length})
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {examsWithoutProgress.map((exam) => (
                      <ExamCard
                        key={exam.id}
                        exam={exam}
                        language={language}
                        isMobile={isMobile}
                        getProgressStats={getProgressStats}
                        onExamClick={handleExamClick}
                        getDifficultyColor={getDifficultyColor}
                        getCategoryColor={getCategoryColor}
                        t={t}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          );
        })()}

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
