'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface NewClientData {
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

export default function NewClientPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<NewClientData>({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: 'Male',
    address: '',
    contact_number: '',
    care_notes: '',
    emergency_contact_name: '',
    emergency_contact_number: '',
    care_status: 'Active',
    assigned_caregiver: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const loadingToast = toast.loading("Creating new client record...");

    try {
      const response = await fetch('https://backend.doxcert.com/api/clients/careclients/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create client');
      }

      const newClient = await response.json();
      toast.success('Client Created Successfully!', { id: loadingToast });
      setTimeout(() => {
        router.push(`/dashboard/client/${newClient.id}`);
      }, 1000);
    } catch (err) {
      toast.error(`Failed to create client: ${err instanceof Error ? err.message : 'Unknown error'}`, {
        id: loadingToast,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateStep = (): boolean => {
    switch (step) {
      case 1:
        return !!formData.first_name && !!formData.last_name && !!formData.date_of_birth;
      case 2:
        return (
          !!formData.address &&
          !!formData.contact_number &&
          !!formData.emergency_contact_name &&
          !!formData.emergency_contact_number
        );
      case 3:
        return !!formData.care_status;
      default:
        return false;
    }
  };

  const renderFormFields = () => {
    switch (step) {
      case 1:
        return (
          <>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              placeholder="First Name"
              required
            />
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              placeholder="Last Name"
              required
            />
            <DatePicker
              selected={formData.date_of_birth ? new Date(formData.date_of_birth) : null}
              onChange={(date: Date | null) =>
                setFormData(prev => ({
                  ...prev,
                  date_of_birth: date ? date.toISOString().split('T')[0] : '',
                }))
              }
              dateFormat="yyyy-MM-dd"
              placeholderText="Select Date of Birth"
            />
          </>
        );
      case 2:
        return (
          <>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Address"
              required
            />
            <input
              type="tel"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleInputChange}
              placeholder="Contact Number"
              required
            />
            <input
              type="text"
              name="emergency_contact_name"
              value={formData.emergency_contact_name}
              onChange={handleInputChange}
              placeholder="Emergency Contact Name"
              required
            />
            <input
              type="tel"
              name="emergency_contact_number"
              value={formData.emergency_contact_number}
              onChange={handleInputChange}
              placeholder="Emergency Contact Number"
              required
            />
          </>
        );
      case 3:
        return (
          <>
            <select
              name="care_status"
              value={formData.care_status}
              onChange={handleInputChange}
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <textarea
              name="care_notes"
              value={formData.care_notes}
              onChange={handleInputChange}
              placeholder="Care Notes (Optional)"
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
        {renderFormFields()}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={() => setStep(prev => Math.max(prev - 1, 1))}
            disabled={step === 1}
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          {step < 3 ? (
            <button
              type="button"
              onClick={() => validateStep() && setStep(prev => Math.min(prev + 1, 3))}
              className={`px-4 py-2 rounded-md ${validateStep() ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-500'}`}
              disabled={!validateStep()}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting || !validateStep()}
              className="px-4 py-2 bg-indigo-500 text-white rounded-md disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
