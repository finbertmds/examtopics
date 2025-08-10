import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Exam } from '../types';
import { ThemeToggle } from './ThemeToggle';

const Home: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const navigate = useNavigate();
  const { getAllProgress } = useLocalStorage();

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
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
    const matchesSearch = exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || exam.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || exam.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const categories = ['all', ...Array.from(new Set(exams.map(exam => exam.category)))];
  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const handleExamClick = (exam: Exam) => {
    navigate(`/exam/${exam.id}`, { state: { exam } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách đề thi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex justify-between items-center mb-6">
            <div></div>
            <ThemeToggle />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2 transition-colors">
            🎯 Exam Practice Platform
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg transition-colors">
            Luyện thi chứng chỉ AWS với các bộ đề chất lượng
          </p>
        </header>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                🔍 Tìm kiếm
              </label>
              <input
                type="text"
                placeholder="Tìm theo tên, mô tả hoặc tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                📂 Danh mục
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Tất cả' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                ⚡ Độ khó
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? 'Tất cả' : difficulty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {
          filteredExams.length > 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 text-sm transition-colors">
              <p className="mt-1">
                Tổng số đề thi: {exams.length} | 
                Đã lọc: {filteredExams.length} kết quả
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
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white line-clamp-2 transition-colors">
                  {exam.name}
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
                {exam.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{exam.questionCount}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Câu hỏi</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{exam.estimatedTime}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Phút</div>
                </div>
              </div>

              {/* Progress */}
              {(() => {
                const allProgress = getAllProgress();
                const examProgress = allProgress[exam.id];
                const answeredCount = examProgress ? Object.keys(examProgress.answers).length : 0;
                const percentage = examProgress ? Math.round((answeredCount / exam.questionCount) * 100) : 0;
                
                return examProgress && answeredCount > 0 ? (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-blue-800">Tiến độ</span>
                      <span className="text-sm text-blue-600">{percentage}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      {answeredCount}/{exam.questionCount} câu đã làm
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {exam.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full transition-colors"
                  >
                    {tag}
                  </span>
                ))}
                {exam.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full transition-colors">
                    +{exam.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Start Button */}
              {(() => {
                const allProgress = getAllProgress();
                const examProgress = allProgress[exam.id];
                const answeredCount = examProgress ? Object.keys(examProgress.answers).length : 0;
                const hasProgress = answeredCount > 0;
                
                return (
                  <button className={`w-full py-2 px-4 rounded-lg transition-colors font-medium ${
                    hasProgress 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}>
                    {hasProgress ? '🔄 Tiếp tục làm bài' : '🚀 Bắt đầu làm bài'}
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
              Không tìm thấy đề thi phù hợp
            </h3>
            <p className="text-gray-600 dark:text-gray-300 transition-colors">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm transition-colors">
          <p>© 2025 Exam Practice Platform</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
