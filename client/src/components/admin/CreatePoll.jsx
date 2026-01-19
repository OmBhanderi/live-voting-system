import React, { useState } from 'react';
import { pollAPI } from '../../services/api';
import { validatePollForm } from '../../utils/validators';
import Button from '../common/Button';

const CreatePoll = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    options: ['', ''],
    allowMultipleVotes: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddOption = () => {
    if (formData.options.length < 10) {
      setFormData({
        ...formData,
        options: [...formData.options, ''],
      });
    }
  };

  const handleRemoveOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData({ ...formData, options: newOptions });
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate form
    const validation = validatePollForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      await pollAPI.create({
        title: formData.title.trim(),
        description: formData.description.trim(),
        options: formData.options.filter(opt => opt.trim()),
        allowMultipleVotes: formData.allowMultipleVotes,
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        options: ['', ''],
        allowMultipleVotes: false,
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      setErrors({
        submit: err.response?.data?.error || 'Failed to create poll',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Poll</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Poll Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="What is your question?"
            maxLength={200}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add more context to your poll..."
            rows={3}
            maxLength={1000}
          />
        </div>

        {/* Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Options * (Min: 2, Max: 10)
          </label>
          <div className="space-y-3">
            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Option ${index + 1}`}
                  maxLength={200}
                />
                {formData.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          {errors.options && (
            <p className="mt-1 text-sm text-red-600">{errors.options}</p>
          )}
          
          {formData.options.length < 10 && (
            <button
              type="button"
              onClick={handleAddOption}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              + Add Option
            </button>
          )}
        </div>

        {/* Multiple Votes */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="allowMultiple"
            checked={formData.allowMultipleVotes}
            onChange={(e) => setFormData({ ...formData, allowMultipleVotes: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="allowMultiple" className="ml-2 text-sm text-gray-700">
            Allow multiple votes from same user
          </label>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex space-x-3">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? 'Creating...' : 'Create Poll'}
          </Button>
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreatePoll;