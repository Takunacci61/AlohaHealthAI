'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated } from '@/services/auth';
import AddNoteModal from '@/app/components/AddNoteModal';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import ViewNoteModal from '@/app/components/ViewNoteModal';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ClientDetails {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  address: string;
  contact_number: string;
  care_notes: string;
  emergency_contact_name: string;
  emergency_contact_number: string;
  care_status: string;
  assigned_caregiver: number;
}

interface Note {
  id: number;
  created_at: string;
  note_text: string;
  sentiment: string;
  emotion_tags: Record<string, any>;
  care_client: number;
  created_by: number;
}

const NotesTable = ({ notes }: { notes: Note[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const itemsPerPage = 5;

  // Filter and sort notes
  const filteredNotes = notes.filter(note => 
    note.note_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.sentiment.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (sortConfig.key === 'created_at') {
      return sortConfig.direction === 'asc' 
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(filteredNotes.length / itemsPerPage);
  const paginatedNotes = filteredNotes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header with Search */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Client Notes History
              </h3>
              <span className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full">
                {notes.length} Notes
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-64 px-4 py-2 pr-8 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <svg
                className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Date & Time</span>
                    {sortConfig.key === 'created_at' && (
                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        {sortConfig.direction === 'asc' ? (
                          <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 4.414l-3.293 3.293a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        ) : (
                          <path fillRule="evenodd" d="M5.293 12.293a1 1 0 011.414 0L10 15.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        )}
                      </svg>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Note Content
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Sentiment
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Created By
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notes.length > 0 ? (
                paginatedNotes.map((note, index) => (
                  <tr 
                    key={note.id}
                    className={`hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                    onClick={() => {
                      setSelectedNote(note);
                      setIsViewModalOpen(true);
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(note.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(note.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 whitespace-pre-wrap max-w-xl">
                        {note.note_text}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${note.sentiment === 'Positive' 
                          ? 'bg-green-100 text-green-800'
                          : note.sentiment === 'Negative'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 mr-1.5 rounded-full
                          ${note.sentiment === 'Positive'
                            ? 'bg-green-400'
                            : note.sentiment === 'Negative'
                            ? 'bg-red-400'
                            : 'bg-yellow-400'
                          }"
                        />
                        {note.sentiment}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            ID: {note.created_by}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <svg className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900">No notes available</span>
                      <p className="text-sm text-gray-500 mt-1">
                        Notes added to this client will appear here
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredNotes.length)} of {filteredNotes.length} notes
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`inline-flex items-center px-3 py-1.5 border text-sm font-medium rounded-md ${
                      currentPage === i + 1
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-600'
                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Note Modal */}
      <ViewNoteModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedNote(null);
        }}
        note={selectedNote}
      />
    </>
  );
};

interface SentimentCount {
  sentiment: string;
  count: number;
}

interface EmotionDistribution {
  [key: string]: number;
}

interface AnalyticsData {
  sentiment_distribution: SentimentCount[];
  emotion_distribution: EmotionDistribution;
  analysis_summary: string;
}

const SentimentAnalysis = ({ clientId }: { clientId: number }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!clientId) {
        setError('Invalid client ID');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://backend.doxcert.com/api/clients/anaytics/client/${clientId}/note-distribution/`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }

        const data = await response.json();
        setAnalyticsData(data);
      } catch (err) {
        setError('Failed to load analytics data');
        console.error('Error fetching analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [clientId]);

  // Chart options
  const chartOptions = {
    pie: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom' as const,
        },
        title: {
          display: true,
          text: 'Sentiment Distribution',
          font: {
            size: 16,
          },
        },
      },
    },
    bar: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Emotion Distribution',
          font: {
            size: 16,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value: any) {
              return value.toFixed(1) + '%';
            },
          },
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-500 p-4 bg-red-50 rounded-md">
          {error || 'Failed to load analytics'}
        </div>
      </div>
    );
  }

  // Process sentiment data
  const processedSentiments = analyticsData.sentiment_distribution.reduce((acc, curr) => {
    const sentiment = curr.sentiment.toLowerCase();
    if (sentiment.includes('uncategorised') || sentiment.includes('uncategorized')) {
      acc.uncategorized = (acc.uncategorized || 0) + curr.count;
    } else if (sentiment.includes('neutral')) {
      acc.neutral = (acc.neutral || 0) + curr.count;
    } else if (sentiment.includes('negative')) {
      acc.negative = (acc.negative || 0) + curr.count;
    } else if (sentiment.includes('positive')) {
      acc.positive = (acc.positive || 0) + curr.count;
    }
    return acc;
  }, {} as Record<string, number>);

  const totalSentiments = Object.values(processedSentiments).reduce((a, b) => a + b, 0);

  const sentimentData = {
    labels: ['Positive', 'Neutral', 'Negative', 'Uncategorized'],
    datasets: [{
      data: [
        (processedSentiments.positive || 0) / totalSentiments * 100,
        (processedSentiments.neutral || 0) / totalSentiments * 100,
        (processedSentiments.negative || 0) / totalSentiments * 100,
        (processedSentiments.uncategorized || 0) / totalSentiments * 100,
      ],
      backgroundColor: [
        'rgba(72, 187, 120, 0.8)',
        'rgba(66, 153, 225, 0.8)',
        'rgba(245, 101, 101, 0.8)',
        'rgba(156, 163, 175, 0.8)',
      ],
      borderColor: [
        'rgba(72, 187, 120, 1)',
        'rgba(66, 153, 225, 1)',
        'rgba(245, 101, 101, 1)',
        'rgba(156, 163, 175, 1)',
      ],
      borderWidth: 1,
    }],
  };

  // Process emotion data
  const emotions = Object.entries(analyticsData.emotion_distribution)
    .map(([emotion, value]) => ({
      emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
      value: value * 100
    }))
    .sort((a, b) => b.value - a.value);

  const emotionData = {
    labels: emotions.map(e => e.emotion),
    datasets: [{
      label: 'Emotion Distribution',
      data: emotions.map(e => e.value),
      backgroundColor: emotions.map((_, index) => 
        `rgba(${index * 30 + 100}, ${index * 20 + 100}, ${index * 40 + 100}, 0.8)`
      ),
      borderColor: emotions.map((_, index) => 
        `rgba(${index * 30 + 100}, ${index * 20 + 100}, ${index * 40 + 100}, 1)`
      ),
      borderWidth: 1,
    }],
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Sentiment & Emotion Analysis</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Pie Chart */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="h-[300px] flex items-center justify-center">
            <Pie data={sentimentData} options={chartOptions.pie} />
          </div>
          <div className="mt-4">
            <div className="grid grid-cols-4 gap-4 text-center">
              {Object.entries(processedSentiments).map(([sentiment, count]) => (
                <div key={sentiment}>
                  <div className="text-sm font-medium text-gray-500 capitalize">{sentiment}</div>
                  <div className={`text-lg font-semibold ${
                    sentiment === 'positive' ? 'text-green-600' :
                    sentiment === 'negative' ? 'text-red-600' :
                    sentiment === 'neutral' ? 'text-blue-600' :
                    'text-gray-600'
                  }`}>
                    {((count / totalSentiments) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Emotion Bar Chart */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="h-[300px] flex items-center justify-center">
            <Bar data={emotionData} options={chartOptions.bar} />
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-500 text-center">
              {emotions.length > 0 && (
                <>
                  Most common emotion: <span className="font-semibold text-gray-900">
                    {emotions[0].emotion} ({emotions[0].value.toFixed(1)}%)
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add this new Summary Note section */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg 
              className="h-5 w-5 text-yellow-400" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-yellow-800">Summary Note</h4>
            <div className="mt-2 text-sm text-yellow-700">
              {analyticsData.analysis_summary !== "Unable to generate analysis summary at this time." ? (
                <p>{analyticsData.analysis_summary}</p>
              ) : (
                <p className="italic">Analysis summary is not available at this time.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Updated Summary Section */}
      <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
        <h4 className="text-sm font-medium text-indigo-900 mb-2">Analysis Summary</h4>
        <p className="text-sm text-indigo-700">
          {analyticsData.analysis_summary !== "Unable to generate analysis summary at this time." ? (
            analyticsData.analysis_summary
          ) : (
            // Fallback summary when API doesn't provide one
            <>
              {emotions.length > 0 && processedSentiments.positive !== undefined && (
                <>
                  This client generally shows {
                    processedSentiments.positive > processedSentiments.negative ? 'positive' : 'negative'
                  } sentiment ({((processedSentiments.positive || 0) / totalSentiments * 100).toFixed(1)}%) 
                  with {emotions[0].emotion.toLowerCase()} being the dominant emotion ({emotions[0].value.toFixed(1)}%). 
                  {processedSentiments.negative > 0 && 
                    ` There are some instances of negative sentiment that might need attention.`
                  }
                  {processedSentiments.uncategorized > 0 && 
                    ` Note: ${((processedSentiments.uncategorized / totalSentiments) * 100).toFixed(1)}% of sentiments remain uncategorized.`
                  }
                </>
              )}
            </>
          )}
        </p>

        {/* Additional Insights */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-3">
            <h5 className="text-sm font-medium text-gray-900 mb-2">Primary Emotions</h5>
            <div className="space-y-2">
              {emotions.slice(0, 3).map(emotion => (
                <div key={emotion.emotion} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{emotion.emotion}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {emotion.value.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-3">
            <h5 className="text-sm font-medium text-gray-900 mb-2">Sentiment Overview</h5>
            <div className="space-y-2">
              {Object.entries(processedSentiments)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([sentiment, count]) => (
                  <div key={sentiment} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 capitalize">{sentiment}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {((count / totalSentiments) * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ClientPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [client, setClient] = useState<ClientDetails | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
    } else {
      fetchClientDetails();
      fetchClientNotes();
    }
  }, [params.id, router]);

  const fetchClientDetails = async () => {
    try {
      const response = await fetch(`https://backend.doxcert.com/api/clients/careclients/${params.id}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch client details');
      }

      const data = await response.json();
      setClient(data);
    } catch (err) {
      setError('Failed to load client details');
      console.error('Error fetching client details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClientNotes = async () => {
    try {
      const response = await fetch(`https://backend.doxcert.com/api/clients/client-notes/${params.id}/notes/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch client notes');
      }

      const data = await response.json();
      setNotes(data);
    } catch (err) {
      console.error('Error fetching client notes:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getGenderIcon = (gender: string) => {
    const baseClasses = "h-16 w-16 rounded-full p-3";
    const isFemaleLike = gender?.toLowerCase() === 'female';
    const colorClasses = isFemaleLike 
      ? "bg-pink-100 text-pink-600" 
      : "bg-blue-100 text-blue-600";

    return (
      <div className={`${baseClasses} ${colorClasses}`}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d={isFemaleLike 
              ? "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              : "M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
            }
          />
        </svg>
      </div>
    );
  };

  const handleNoteAdded = () => {
    fetchClientNotes();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="text-red-500 p-4 bg-red-50 rounded-md">{error}</div>
        </div>
      </div>
    );
  }

  if (isLoading || !client) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {getGenderIcon(client.gender)}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {client.first_name} {client.last_name}
                </h1>
                <p className="mt-1 text-sm text-gray-500">Client Profile</p>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="mr-2 -ml-1 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SentimentAnalysis clientId={parseInt(params.id)} />

        <div className="bg-white shadow rounded-lg mt-6">
          {/* Status Banner */}
          <div className={`px-4 py-3 rounded-t-lg border-b ${getStatusColor(client.care_status)}`}>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Status: {client.care_status}</span>
              <span className="text-sm">ID: {params.id}</span>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200">
                    Personal Information
                  </h3>
                  <dl className="mt-4 space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                      <dd className="mt-1 text-sm text-gray-900">{new Date(client.date_of_birth).toLocaleDateString()}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Gender</dt>
                      <dd className="mt-1 text-sm text-gray-900">{client.gender}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Address</dt>
                      <dd className="mt-1 text-sm text-gray-900">{client.address}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Contact Number</dt>
                      <dd className="mt-1 text-sm text-gray-900">{client.contact_number}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200">
                    Emergency Contact
                  </h3>
                  <dl className="mt-4 space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Name</dt>
                      <dd className="mt-1 text-sm text-gray-900">{client.emergency_contact_name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Contact Number</dt>
                      <dd className="mt-1 text-sm text-gray-900">{client.emergency_contact_number}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200">
                    Care Information
                  </h3>
                  <dl className="mt-4 space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Assigned Caregiver ID</dt>
                      <dd className="mt-1 text-sm text-gray-900">{client.assigned_caregiver || 'Not assigned'}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            {/* Care Notes Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200">
                Care Notes
              </h3>
              <div className="mt-4 bg-gray-50 rounded-md p-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {client.care_notes || 'No care notes available.'}
                </p>
              </div>
            </div>

            {/* Notes Table Section */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 pb-2">
                  Client Notes History
                </h3>
                <button
                  onClick={() => setIsNoteModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  <svg 
                    className="mr-2 -ml-1 h-5 w-5" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 4v16m8-8H4" 
                    />
                  </svg>
                  Add Note
                </button>
              </div>
              <NotesTable notes={notes} />
            </div>
          </div>
        </div>
      </main>

      {/* Add Note Modal */}
      <AddNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        clientId={parseInt(params.id)}
        onSuccess={handleNoteAdded}
      />
    </div>
  );
} 
