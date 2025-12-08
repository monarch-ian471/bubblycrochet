import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ExternalLink, Save, X, Upload } from 'lucide-react';
import { JourneyResource } from '../../types/types';

interface JourneyManagementProps {
  journeyData: {
    styles: JourneyResource[];
    tools: JourneyResource[];
    resources: JourneyResource[];
    stores: JourneyResource[];
  };
  onSaveResource: (resource: JourneyResource) => void;
  onDeleteResource: (id: string, category: string) => void;
}

export const JourneyManagement: React.FC<JourneyManagementProps> = ({
  journeyData,
  onSaveResource,
  onDeleteResource
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'styles' | 'tools' | 'resources' | 'stores'>('styles');
  const [isEditing, setIsEditing] = useState(false);
  const [editingResource, setEditingResource] = useState<JourneyResource | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    thumbnailUrl: ''
  });

  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const categories = [
    { id: 'styles', label: 'Crochet Styles & Patterns' },
    { id: 'tools', label: 'Essential Tools' },
    { id: 'resources', label: 'Learning Resources' },
    { id: 'stores', label: 'Best Stores' }
  ];

  const currentResources = journeyData[selectedCategory] || [];

  const handleEdit = (resource: JourneyResource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title,
      description: resource.description,
      url: resource.url,
      thumbnailUrl: resource.thumbnailUrl
    });
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setEditingResource(null);
    setFormData({
      title: '',
      description: '',
      url: '',
      thumbnailUrl: ''
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.description || !formData.url || !formData.thumbnailUrl) {
      alert('Please fill in all fields');
      return;
    }

    const resource: JourneyResource = {
      id: editingResource?.id || `journey_${Date.now()}`,
      title: formData.title,
      description: formData.description,
      url: formData.url,
      thumbnailUrl: formData.thumbnailUrl,
      category: selectedCategory,
      createdAt: editingResource?.createdAt || Date.now()
    };

    onSaveResource(resource);
    setIsEditing(false);
    setFormData({ title: '', description: '', url: '', thumbnailUrl: '' });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingResource(null);
    setFormData({ title: '', description: '', url: '', thumbnailUrl: '' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      onDeleteResource(id, selectedCategory);
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file: File) => file.type.startsWith('image/'));

    if (imageFile) {
      // Convert to base64 or upload to a service
      // For demo purposes, we'll use a FileReader to create a data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setFormData({ ...formData, thumbnailUrl: dataUrl });
      };
      reader.readAsDataURL(imageFile as Blob);
    } else {
      alert('Please drop an image file');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setFormData({ ...formData, thumbnailUrl: dataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Journey Management</h2>
          <p className="text-gray-600 mt-1">Manage educational resources and helpful links</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          <Plus size={20} />
          Add Resource
        </button>
      </div>

      {/* Category Selector */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as any)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedCategory === cat.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-purple-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              {editingResource ? 'Edit Resource' : 'Add New Resource'}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter resource title"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"
                placeholder="Brief description of the resource"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                URL
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Thumbnail Image
              </label>
              
              {/* Drag and Drop Area */}
              <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
                  isDragging
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-300 bg-gray-50 hover:border-purple-400'
                }`}
              >
                <div className="text-center">
                  <Upload className={`mx-auto mb-4 ${isDragging ? 'text-purple-600' : 'text-gray-400'}`} size={48} />
                  <p className="text-gray-600 mb-2">
                    {isDragging ? 'Drop image here' : 'Drag and drop an image here'}
                  </p>
                  <p className="text-sm text-gray-400 mb-4">or</p>
                  <label className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 cursor-pointer transition">
                    Browse Files
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-400 mt-3">or paste an image URL below</p>
                </div>
              </div>

              {/* URL Input Alternative */}
              <input
                type="url"
                value={formData.thumbnailUrl}
                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 mt-3"
                placeholder="https://example.com/image.jpg"
              />

              {formData.thumbnailUrl && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <img
                    src={formData.thumbnailUrl}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/128?text=Invalid+URL';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition font-semibold"
              >
                <Save size={18} />
                Save Resource
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resources List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Preview</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Title</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Description</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">URL</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentResources.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    No resources yet. Click "Add Resource" to get started.
                  </td>
                </tr>
              ) : (
                currentResources.map((resource) => (
                  <tr key={resource.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <img
                        src={resource.thumbnailUrl}
                        alt={resource.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-800 max-w-xs truncate">
                        {resource.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-md line-clamp-2">
                        {resource.description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm"
                      >
                        <ExternalLink size={14} />
                        <span className="max-w-xs truncate">Link</span>
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(resource)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(resource.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
