'use client';

import { useEffect, useState, useCallback } from 'react';
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

interface ClientData {
  id: number;
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
  emotion_tags: Record<string, number>;
  ai_evaluated_notes: string;
  care_client: number;
  created_by: number;
}

interface ClientDetailsProps {
  id: string;
}

export default function ClientDetails({ id }: ClientDetailsProps) {
  const router = useRouter();
  const [client, setClient] = useState<ClientData | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  const fetchClientDetails = useCallback(async () => {
    if (!id) {
      setError('Invalid client ID');
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`https://backend.doxcert.com/api/clients/careclients/${id}/`, {
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
  }, [id]);

  const fetchClientNotes = useCallback(async () => {
    if (!id) return;
    
    try {
      const response = await fetch(`https://backend.doxcert.com/api/clients/client-notes/${id}/notes/`, {
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
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
    } else {
      fetchClientDetails();
      fetchClientNotes();
    }
  }, [router, fetchClientDetails, fetchClientNotes]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="text-red-500 p-4">{error}</div>
        </div>
      </div>
    );
  }

  if (!client || isLoading) {
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

  // ... rest of your existing component code
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Your existing JSX */}
        </div>
      </div>
    </div>
  );
} 