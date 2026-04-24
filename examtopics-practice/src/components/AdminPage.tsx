import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { useExams } from '../hooks/useExams';
import { examApi } from '../services/examApi';

const AdminPage: React.FC = () => {
  const { token, isAuthenticated } = useAuth();
  const { exams, loading: loadingExams, refreshExams } = useExams({ fetchMyExamsOnly: true, token: token || null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingExamCode, setEditingExamCode] = useState<string | null>(null);

  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    refreshExams();
    const loadMetadata = async () => {
      try {
        const metadata = await examApi.getMetadata();
        setAvailableCategories(metadata.categories);
        setAvailableTags(metadata.tags);
      } catch (error) {
        console.error('Failed to load metadata:', error);
      }
    };
    loadMetadata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    name_en: '',
    name_vi: '',
    name_ja: '',
    desc_en: '',
    desc_vi: '',
    desc_ja: '',
    category: '',
    difficulty: 'Beginner',
    estimatedTime: 60,
    tags: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-300">You must be logged in to access the Admin Panel.</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleEditClick = (exam: any) => {
    setEditingExamCode(exam.code);
    setFormData({
      code: exam.code,
      name_en: typeof exam.name === 'string' ? exam.name : (exam.name?.en || ''),
      name_vi: typeof exam.name === 'string' ? '' : (exam.name?.vi || ''),
      name_ja: typeof exam.name === 'string' ? '' : (exam.name?.ja || ''),
      desc_en: typeof exam.description === 'string' ? exam.description : (exam.description?.en || ''),
      desc_vi: typeof exam.description === 'string' ? '' : (exam.description?.vi || ''),
      desc_ja: typeof exam.description === 'string' ? '' : (exam.description?.ja || ''),
      category: exam.category || '',
      difficulty: exam.difficulty || 'Beginner',
      estimatedTime: Number(exam.estimatedTime) || 60,
      tags: exam.tags ? exam.tags.join(', ') : '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingExamCode(null);
    setFormData({
      code: '',
      name_en: '',
      name_vi: '',
      name_ja: '',
      desc_en: '',
      desc_vi: '',
      desc_ja: '',
      category: '',
      difficulty: 'Beginner',
      estimatedTime: 60,
      tags: '',
    });
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error('Authentication error. Please login again.');
      return;
    }

    if (!formData.code || (!formData.name_en && !formData.name_vi && !formData.name_ja)) {
      toast.error('Code and at least one Name are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      let questionsPayload: any[] = [];

      if (file) {
        const fileContent = await file.text();
        questionsPayload = JSON.parse(fileContent);
        if (!Array.isArray(questionsPayload)) {
          throw new Error('JSON file must contain an array of questions.');
        }
      }

      const payload = {
        code: formData.code,
        name: {
          en: formData.name_en || formData.name_vi || formData.name_ja,
          vi: formData.name_vi || formData.name_en || formData.name_ja,
          ja: formData.name_ja || formData.name_en || formData.name_vi,
        },
        description: {
          en: formData.desc_en || formData.desc_vi || formData.desc_ja,
          vi: formData.desc_vi || formData.desc_en || formData.desc_ja,
          ja: formData.desc_ja || formData.desc_en || formData.desc_vi,
        },
        category: formData.category,
        difficulty: formData.difficulty,
        estimatedTime: Number(formData.estimatedTime),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        questions: questionsPayload
      };

      let result;
      if (editingExamCode) {
        result = await examApi.updateExam(editingExamCode, payload, token);
      } else {
        result = await examApi.createExam(payload, token);
      }

      if (result.success !== false) { // Assuming updateExam might return bare object without success boolean wrapper if not aligned perfectly, so just check not explicitly false
        toast.success(editingExamCode ? 'Exam updated successfully!' : 'Exam created successfully!');

        // Reset form
        cancelEdit();

        // Refresh list
        refreshExams();

        // Refresh metadata to get newly added categories/tags
        const metadata = await examApi.getMetadata();
        setAvailableCategories(metadata.categories);
        setAvailableTags(metadata.tags);
      } else {
        toast.error(result.message);
      }

    } catch (error: any) {
      console.error('Error creating exam:', error);
      toast.error(error.message || 'Failed to create exam.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!window.confirm('Are you sure you want to delete this exam?')) return;

    try {
      await examApi.deleteExam(id, token);
      toast.success('Exam deleted successfully!');
      refreshExams();
    } catch (error: any) {
      console.error('Error deleting exam:', error);
      toast.error('Failed to delete exam.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors py-8 px-4">
      <div className="max-w-8xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">🛠 Admin Panel</h1>

        {/* Create Exam Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            {editingExamCode ? 'Update Exam' : 'Create New Exam'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exam Code (Unique) *</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                disabled={!!editingExamCode}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                placeholder="e.g. aws-sap-c02"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exam Name (English) *</label>
                <input
                  type="text"
                  name="name_en"
                  value={formData.name_en}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exam Name (Vietnamese)</label>
                <input
                  type="text"
                  name="name_vi"
                  value={formData.name_vi}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exam Name (Japanese)</label>
                <input
                  type="text"
                  name="name_ja"
                  value={formData.name_ja}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (English)</label>
                <textarea
                  name="desc_en"
                  value={formData.desc_en}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Vietnamese)</label>
                <textarea
                  name="desc_vi"
                  value={formData.desc_vi}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Japanese)</label>
                <textarea
                  name="desc_ja"
                  value={formData.desc_ja}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  list="category-options"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <datalist id="category-options">
                  {availableCategories.map(cat => <option key={cat} value={cat} />)}
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estimated Time (mins)</label>
                <input
                  type="number"
                  name="estimatedTime"
                  value={formData.estimatedTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-3 py-2 mb-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="AWS, SAA-C03, Cloud"
              />
              <div className="flex flex-wrap gap-1">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setFormData(prev => {
                        const newTags = prev.tags ? prev.tags.split(',').map(t => t.trim()).filter(t => t.toLowerCase() !== tag.toLowerCase()) : [];
                        return {
                          ...prev,
                          tags: newTags.length > 0 ? `${newTags.join(', ')}, ${tag}` : tag
                        };
                      });
                    }}
                    className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    +{tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload Questions JSON (Optional)</label>
              <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 mt-1">File should contain an array of question objects.</p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
                  ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 transition-colors'}`}
              >
                {isSubmitting ? (editingExamCode ? 'Updating...' : 'Creating...') : (editingExamCode ? 'Update Exam' : 'Create Exam')}
              </button>

              {editingExamCode && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={isSubmitting}
                  className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* My Exams List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">My Exams</h2>

          {loadingExams ? (
            <p className="text-gray-600 dark:text-gray-300">Loading exams...</p>
          ) : exams.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No exams found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Questions</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {exams.map((exam) => {
                    const nameStr = typeof exam.name === 'string' ? exam.name : ((exam.name as any)?.en || (exam.name as any)?.vi || 'Untitled');
                    return (
                      <tr key={exam.code}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {exam.code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {nameStr}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {exam.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {exam.questionCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => handleEditClick(exam)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(exam.code)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminPage;
