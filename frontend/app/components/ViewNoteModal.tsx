'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface Note {
  id: number;
  created_at: string;
  note_text: string;
  sentiment: string;
  emotion_tags: Record<string, number>;
  ai_evaluated_notes: string;
  care_client: number;
  created_by: number;
}

interface ViewNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
}

export default function ViewNoteModal({ isOpen, onClose, note }: ViewNoteModalProps) {
  if (!note) return null;

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex justify-between items-start mb-4">
                  <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                    Note Details
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Date and Time */}
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Created on {new Date(note.created_at).toLocaleDateString()}</span>
                    <span>{new Date(note.created_at).toLocaleTimeString()}</span>
                  </div>

                  {/* Note Content */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900 whitespace-pre-wrap">{note.note_text}</p>
                  </div>

                  {/* Sentiment */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Sentiment:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-sm font-medium ${getSentimentColor(note.sentiment)}`}>
                      {note.sentiment}
                    </span>
                  </div>

                  {/* Emotions */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Emotions Detected:</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(note.emotion_tags).map(([emotion, value]) => (
                        <div
                          key={emotion}
                          className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full text-sm"
                        >
                          {emotion}: {(Number(value) * 100).toFixed(1)}%
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Evaluated Notes - New Section */}
                  {note.ai_evaluated_notes && (
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                      <h4 className="text-sm font-medium text-purple-900 mb-2 flex items-center">
                        <svg 
                          className="h-5 w-5 mr-2 text-purple-600" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        AI Analysis
                      </h4>
                      <p className="text-sm text-purple-900 whitespace-pre-wrap">
                        {note.ai_evaluated_notes}
                      </p>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <dl className="grid grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Note ID</dt>
                        <dd className="text-sm text-gray-900">{note.id}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Created By</dt>
                        <dd className="text-sm text-gray-900">Staff ID: {note.created_by}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 