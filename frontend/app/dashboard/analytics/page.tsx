'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated } from '@/services/auth';

export default function AnalyticsPage() {
  const router = useRouter();

  if (!isAuthenticated()) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900">Analytics Content</h2>
          <p className="mt-2 text-gray-600">Analytics data will be displayed here.</p>
        </div>
      </main>
    </div>
  );
} 