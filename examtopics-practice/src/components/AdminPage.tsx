import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { useExams } from '../hooks/useExams';
import { examApi } from '../services/examApi';
import { Question } from '../types';

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

  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [questionNumberInput, setQuestionNumberInput] = useState<string>('');
  const [selectedQuestionExamCode, setSelectedQuestionExamCode] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [questionFormData, setQuestionFormData] = useState<any>({
    question_text: '',
    suggested_answer: '',
    answer: '',
    link: '',
    multiple_choice: false,
    answers: {},
    answer_images: [],
    question_images: [],
  });
  const [newAnswerKey, setNewAnswerKey] = useState('');
  const [newAnswerValue, setNewAnswerValue] = useState('');
  const [newAnswerImageUrl, setNewAnswerImageUrl] = useState('');
  const [newQuestionImageUrl, setNewQuestionImageUrl] = useState('');
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);
  const [isQuestionSaving, setIsQuestionSaving] = useState(false);

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

  const openQuestionModal = (exam: any) => {
    setSelectedQuestionExamCode(exam.code);
    setQuestionNumberInput('');
    setSelectedQuestion(null);
    setQuestionFormData({ suggested_answer: '', answer: '' });
    setQuestionModalOpen(true);
  };

  const closeQuestionModal = () => {
    setQuestionModalOpen(false);
    setSelectedQuestionExamCode(null);
    setQuestionNumberInput('');
    setSelectedQuestion(null);
    setQuestionFormData({ suggested_answer: '', answer: '' });
    setIsQuestionLoading(false);
    setIsQuestionSaving(false);
  };

  const handleQuestionNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestionNumberInput(e.target.value);
  };

  const handleQuestionFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setQuestionFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAnswerKeyChange = (oldKey: string, newKey: string) => {
    setQuestionFormData((prev: any) => {
      const answers = { ...prev.answers };
      if (!answers.hasOwnProperty(oldKey) || !newKey) return prev;
      const value = answers[oldKey];
      delete answers[oldKey];
      answers[newKey] = value;
      return { ...prev, answers };
    });
  };

  const handleAnswerValueChange = (key: string, value: string) => {
    setQuestionFormData((prev: any) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [key]: value,
      },
    }));
  };

  const removeAnswer = (key: string) => {
    setQuestionFormData((prev: any) => {
      const answers = { ...prev.answers };
      delete answers[key];
      return { ...prev, answers };
    });
  };

  const addAnswer = () => {
    if (!newAnswerKey.trim() || !newAnswerValue.trim()) {
      toast.error('Answer key and value are required.');
      return;
    }
    setQuestionFormData((prev: any) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [newAnswerKey.trim()]: newAnswerValue.trim(),
      },
    }));
    setNewAnswerKey('');
    setNewAnswerValue('');
  };

  const removeAnswerImage = (index: number) => {
    setQuestionFormData((prev: any) => ({
      ...prev,
      answer_images: prev.answer_images.filter((_: string, i: number) => i !== index),
    }));
  };

  const addAnswerImage = () => {
    if (!newAnswerImageUrl.trim()) {
      toast.error('Provide a valid answer image URL.');
      return;
    }
    setQuestionFormData((prev: any) => ({
      ...prev,
      answer_images: [...(prev.answer_images || []), newAnswerImageUrl.trim()],
    }));
    setNewAnswerImageUrl('');
  };

  const removeQuestionImage = (index: number) => {
    setQuestionFormData((prev: any) => ({
      ...prev,
      question_images: prev.question_images.filter((_: string, i: number) => i !== index),
    }));
  };

  const addQuestionImage = () => {
    if (!newQuestionImageUrl.trim()) {
      toast.error('Provide a valid question image URL.');
      return;
    }
    setQuestionFormData((prev: any) => ({
      ...prev,
      question_images: [...(prev.question_images || []), newQuestionImageUrl.trim()],
    }));
    setNewQuestionImageUrl('');
  };

  const loadQuestionDetails = async () => {
    if (!selectedQuestionExamCode) return;
    const questionNumber = Number(questionNumberInput);
    if (!questionNumber || questionNumber <= 0) {
      toast.error('Please enter a valid question number.');
      return;
    }

    setIsQuestionLoading(true);
    try {
      const question = await examApi.getQuestion(selectedQuestionExamCode, questionNumber);
      setSelectedQuestion(question);
      setQuestionFormData({
        question_text: question.question_text || '',
        suggested_answer: question.suggested_answer || '',
        answer: question.answer || '',
        link: question.link || '',
        multiple_choice: !!question.multiple_choice,
        answers: question.answers || {},
        answer_images: question.answer_images || [],
        question_images: question.question_images || [],
      });
      toast.success('Question details loaded.');
    } catch (error: any) {
      console.error('Failed to load question:', error);
      toast.error(error.message || 'Failed to load question.');
    } finally {
      setIsQuestionLoading(false);
    }
  };

  const saveQuestionDetails = async () => {
    if (!token || !selectedQuestionExamCode || !selectedQuestion) {
      toast.error('Please load a question before saving.');
      return;
    }

    setIsQuestionSaving(true);
    try {
      const updated = await examApi.updateQuestion(
        selectedQuestionExamCode,
        selectedQuestion.question_number,
        {
          question_text: questionFormData.question_text,
          answers: questionFormData.answers,
          link: questionFormData.link,
          multiple_choice: questionFormData.multiple_choice,
          answer_images: questionFormData.answer_images,
          question_images: questionFormData.question_images,
          suggested_answer: questionFormData.suggested_answer,
          answer: questionFormData.answer,
        },
        token
      );
      setSelectedQuestion(updated);
      toast.success('Question updated successfully.');
    } catch (error: any) {
      console.error('Failed to update question:', error);
      toast.error(error.message || 'Failed to update question.');
    } finally {
      setIsQuestionSaving(false);
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

  const answerEntries = Object.entries(questionFormData.answers || {}) as [string, string][];

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
                            onClick={() => openQuestionModal(exam)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                          >
                            Edit Question
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

        {questionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4">
            <div className="w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Question</h3>
                <button
                  type="button"
                  onClick={closeQuestionModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-300"
                >
                  Close
                </button>
              </div>
              <div className="space-y-4 overflow-y-auto px-6 py-5 max-h-[calc(90vh-5rem)]">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exam Code</label>
                    <input
                      type="text"
                      value={selectedQuestionExamCode || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Question Number</label>
                    <input
                      type="number"
                      min={1}
                      value={questionNumberInput}
                      onChange={handleQuestionNumberChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={loadQuestionDetails}
                    disabled={isQuestionLoading || !questionNumberInput}
                    className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${isQuestionLoading || !questionNumberInput ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} transition-colors`}
                  >
                    {isQuestionLoading ? 'Loading…' : 'Load Question'}
                  </button>
                  <button
                    type="button"
                    onClick={closeQuestionModal}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>

                {selectedQuestion && (
                  <div className="space-y-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Question Text</label>
                      <textarea
                        name="question_text"
                        value={questionFormData.question_text}
                        onChange={handleQuestionFormChange}
                        rows={5}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-y"
                      />
                    </div>

                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-100">Answers</p>
                        <div className="grid gap-2 sm:grid-cols-[1fr_3fr]">
                          <input
                            type="text"
                            placeholder="Key"
                            value={newAnswerKey}
                            onChange={e => setNewAnswerKey(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                          <input
                            type="text"
                            placeholder="Value"
                            value={newAnswerValue}
                            onChange={e => setNewAnswerValue(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={addAnswer}
                        className="mb-4 inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                      >
                        Add Answer
                      </button>
                      <div className="space-y-3">
                        {answerEntries.sort(([keyA], [keyB]) => keyA.localeCompare(keyB)).map(([key, value]) => (
                          <div key={key} className="grid gap-2 md:grid-cols-[120px_1fr_auto] items-start">
                            <input
                              type="text"
                              value={key}
                              onChange={e => handleAnswerKeyChange(key, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                            <input
                              type="text"
                              value={value}
                              onChange={e => handleAnswerValueChange(key, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                            <button
                              type="button"
                              onClick={() => removeAnswer(key)}
                              className="inline-flex items-center justify-center rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Suggested Answer</label>
                        <input
                          type="text"
                          name="suggested_answer"
                          value={questionFormData.suggested_answer}
                          onChange={handleQuestionFormChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Answer</label>
                        <input
                          type="text"
                          name="answer"
                          value={questionFormData.answer}
                          onChange={handleQuestionFormChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-[4fr_1fr]">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link</label>
                        <input
                          type="text"
                          name="link"
                          value={questionFormData.link}
                          onChange={handleQuestionFormChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div className="flex items-center gap-3 pt-6">
                        <input
                          id="multiple_choice"
                          type="checkbox"
                          name="multiple_choice"
                          checked={questionFormData.multiple_choice}
                          onChange={handleQuestionFormChange}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="multiple_choice" className="text-sm font-medium text-gray-700 dark:text-gray-300">Multiple Choice</label>
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-100 mb-3">Answer Images</p>
                      <div className="grid gap-2 sm:grid-cols-[4fr_1fr] mb-3">
                        <input
                          type="text"
                          placeholder="New answer image URL"
                          value={newAnswerImageUrl}
                          onChange={e => setNewAnswerImageUrl(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={addAnswerImage}
                          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                          Add Image
                        </button>
                      </div>
                      <div className="space-y-2">
                        {(questionFormData.answer_images || []).map((url: string, index: number) => (
                          <div key={`${url}-${index}`} className="flex items-center justify-between rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2">
                            <span className="truncate text-sm text-gray-700 dark:text-gray-200">{url}</span>
                            <button
                              type="button"
                              onClick={() => removeAnswerImage(index)}
                              className="text-sm font-medium text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-100 mb-3">Question Images</p>
                      <div className="grid gap-2 sm:grid-cols-[4fr_1fr] mb-3">
                        <input
                          type="text"
                          placeholder="New question image URL"
                          value={newQuestionImageUrl}
                          onChange={e => setNewQuestionImageUrl(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={addQuestionImage}
                          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                          Add Image
                        </button>
                      </div>
                      <div className="space-y-2">
                        {(questionFormData.question_images || []).map((url: string, index: number) => (
                          <div key={`${url}-${index}`} className="flex items-center justify-between rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2">
                            <span className="truncate text-sm text-gray-700 dark:text-gray-200">{url}</span>
                            <button
                              type="button"
                              onClick={() => removeQuestionImage(index)}
                              className="text-sm font-medium text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={saveQuestionDetails}
                        disabled={isQuestionSaving}
                        className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${isQuestionSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} transition-colors`}
                      >
                        {isQuestionSaving ? 'Saving…' : 'Save'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
