'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/services/auth';
import AddNoteModal from '@/app/components/AddNoteModal';
import ViewNoteModal from '@/app/components/ViewNoteModal';
import { Bar, Pie } from 'react-chartjs-2';
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

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ClientPageProps {
  id: string;
}

export default function ClientPage({ id }: ClientPageProps) {
  const router = useRouter();
  const [client, setClient] = useState<any>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState<any[]>([]);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);

  const fetchClientDetails = useCallback(async () => {
    try {
      const response = await fetch(`https://backend.doxcert.com/api/clients/careclients/${id}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch client');
      const data = await response.json();
      setClient(data);
    } catch (err) {
      setError('Failed to load client details');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }
    fetchClientDetails();
  }, [router, fetchClientDetails]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">Client Details</h1>
          {client && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h2 className="font-semibold">Name</h2>
                  <p>{client.name}</p>
                </div>
                {/* Add more client details here */}
              </div>
              <div className="mt-6">
                <h2 className="font-semibold mb-2">Notes</h2>
                {notes.map(note => (
                  <div key={note.id} className="mb-2 p-2 bg-gray-50 rounded">
                    {note.text}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      {isNoteModalOpen && (
        <AddNoteModal
          clientId={parseInt(id, 10)}
          onClose={() => setIsNoteModalOpen(false)}
          onSuccess={() => {
            setIsNoteModalOpen(false);
            fetchClientDetails();
          }}
        />
      )}
    </div>
  );
} 