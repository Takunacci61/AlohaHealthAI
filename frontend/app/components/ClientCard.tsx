import { useState } from 'react';
import Link from 'next/link';
import AddNoteModal from './AddNoteModal';

interface ClientData {
  id: number;
  first_name: string;
  last_name: string;
  address: string;
  care_status: string;
  gender: string;
}

export default function ClientCard({ client }: { client: ClientData }) {
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 ring-1 ring-green-600/20';
      case 'inactive':
        return 'bg-red-100 text-red-800 ring-1 ring-red-600/20';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600/20';
      default:
        return 'bg-gray-100 text-gray-800 ring-1 ring-gray-600/20';
    }
  };

  const getGenderIcon = (gender: string) => {
    const isFemaleLike = gender?.toLowerCase() === 'female';
    const colorClasses = isFemaleLike 
      ? "bg-pink-50 text-pink-600 ring-1 ring-pink-600/20" 
      : "bg-blue-50 text-blue-600 ring-1 ring-blue-600/20";

    return (
      <div className={`flex-shrink-0 rounded-full p-2.5 ${colorClasses}`}>
        <svg 
          className="h-5 w-5"
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

  return (
    <>
      <Link href={`/dashboard/client/${client.id}`}>
        <div 
          className={`group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200/80 cursor-pointer ${
            isHovered ? 'transform -translate-y-1' : ''
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="p-5">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                {getGenderIcon(client.gender)}
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 truncate">
                    {client.first_name} {client.last_name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {client.address}
                  </p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${getStatusColor(client.care_status)}`}>
                {client.care_status}
              </span>
            </div>

            <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setIsNoteModalOpen(true);
                }}
                className="inline-flex items-center justify-center p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors duration-200"
                title="Add Notes"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="ml-2 text-sm font-medium">Add Note</span>
              </button>
            </div>
          </div>
        </div>
      </Link>

      <AddNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        clientId={client.id}
      />
    </>
  );
} 