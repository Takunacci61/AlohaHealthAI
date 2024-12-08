import React, { useState, useEffect } from 'react';
import{ getCurrentUserId } from '@/services/auth';
import toast from 'react-hot-toast';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: number;
  onSuccess?: () => void;
}

interface ToastType {
  id: string;
}

export default function AddNoteModal({ isOpen, onClose, clientId, onSuccess }: AddNoteModalProps) {
  const [noteText, setNoteText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [spellingErrors, setSpellingErrors] = useState([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (spellingErrors.length > 0) {
      const toastId = toast((t: ToastType) => (
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">Spelling Errors Detected</p>
            <p className="mt-1 text-sm text-gray-500">Would you like to continue anyway?</p>
            <div className="mt-3 flex space-x-2">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  handleSubmitWithSpellingErrors();
                }}
                className="rounded-md bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-600 hover:bg-amber-200"
              >
                Continue
              </button>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200"
              >
                Review Changes
              </button>
            </div>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="inline-flex text-gray-400 hover:text-gray-500"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      ), {
        duration: 5000,
        position: 'top-center',
        style: {
          background: 'white',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          maxWidth: '500px',
          width: '100%',
        },
      });
      return;
    }

    await handleSubmitWithSpellingErrors();
  };

  const handleSubmitWithSpellingErrors = async () => {
    setIsSubmitting(true);
    setError('');

    const userId = getCurrentUserId();
    if (!userId) {
      toast.error('Authentication error. Please log in again.', {
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          padding: '16px',
          borderRadius: '8px',
        },
        icon: '🔒',
      });
      setIsSubmitting(false);
      return;
    }

    const loadingToast = toast.loading('Saving note...', {
      style: {
        background: 'white',
        padding: '16px',
        borderRadius: '8px',
      },
    });

    try {
      const response = await fetch('https://backend.doxcert.com/api/clients/client-notes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          note_text: noteText,
          care_client: clientId,
          created_by: userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add note');
      }

      toast.success('Note saved successfully!', {
        id: loadingToast,
        duration: 3000,
        icon: '✅',
        style: {
          background: '#F0FDF4',
          color: '#166534',
          padding: '16px',
          borderRadius: '8px',
        },
      });

      setNoteText('');
      onSuccess?.();
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add note. Please try again.';
      toast.error(errorMessage, {
        id: loadingToast,
        duration: 4000,
        icon: '❌',
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          padding: '16px',
          borderRadius: '8px',
        },
      });
      console.error('Error adding note:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl shadow-xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Add Care Note</h2>
            <p className="text-sm text-gray-500 mt-1">Document your observations and care details</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Text Editor Toolbar */}
              <div className="flex items-center space-x-3 p-2 bg-white border border-gray-300 rounded-t-md shadow-sm">
                <div className="flex items-center divide-x divide-gray-200">
                  <div className="flex items-center space-x-2 pr-3">
                    <button
                      type="button"
                      className="p-2 hover:bg-gray-100 rounded transition-colors"
                      title="Bold"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h8a4 4 0 100-8H6v8zm0 0h8a4 4 0 110 8H6v-8z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="p-2 hover:bg-gray-100 rounded transition-colors"
                      title="Italic"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l-4 4m4-4l-4-4" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="p-2 hover:bg-gray-100 rounded transition-colors"
                      title="Bullet List"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2 px-3">
                    <select 
                      className="text-sm border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option>Normal Text</option>
                      <option>Heading 1</option>
                      <option>Heading 2</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Text Editor Area */}
              <div className="relative">
                <textarea
                  id="note"
                  rows={12}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full border-gray-300 rounded-b-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 font-sans text-base leading-relaxed resize-none"
                  placeholder="Enter your detailed notes here..."
                  required
                />
                
                {/* Word Count */}
                <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                  {noteText.trim().split(/\s+/).filter(Boolean).length} words
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-500">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Press Ctrl+Enter to submit
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Adding...' : 'Add Note'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 