'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  const [step, setStep] = useState(1); // Track form steps
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
    assigned_caregiver: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const loadingToast = toast.loading(
      <div className="flex items-center space-x-2">
        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Creating new client record...</span>
      </div>
    );

    try {
      const response = await fetch('https://backend.doxcert.com/api/clients/careclients/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create client');
      }

      const newClient = await response.json();

      toast.success(
        <div className="flex flex-col">
          <span className="font-medium">Client Created Successfully!</span>
          <span className="text-sm">Redirecting to client details...</span>
        </div>,
        { 
          id: loadingToast,
          duration: 3000,
          icon: '✅',
        }
      );

      // Short delay for better UX
      setTimeout(() => {
        router.push(`/dashboard/client/${newClient.id}`);
      }, 1000);

    } catch (err) {
      toast.error(
        <div className="flex flex-col">
          <span className="font-medium">Failed to create client</span>
          <span className="text-sm">{err instanceof Error ? err.message : 'Please try again'}</span>
        </div>,
        { 
          id: loadingToast,
          duration: 4000,
          icon: '❌',
        }
      );
      console.error('Error creating client:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Progress indicator
  const steps = [
    { id: 1, name: 'Personal Details' },
    { id: 2, name: 'Contact Information' },
    { id: 3, name: 'Care Details' }
  ];

  const renderFormFields = () => {
    const renderInput = (label: string, props: any) => (
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            {...props}
            className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-gray-900 placeholder-gray-400 bg-white hover:border-gray-400"
          />
        </div>
      </div>
    );

    switch (step) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput("First Name", {
                  type: "text",
                  name: "first_name",
                  id: "first_name",
                  required: true,
                  value: formData.first_name,
                  onChange: handleInputChange,
                  placeholder: "Enter first name"
                })}

                {renderInput("Last Name", {
                  type: "text",
                  name: "last_name",
                  id: "last_name",
                  required: true,
                  value: formData.last_name,
                  onChange: handleInputChange,
                  placeholder: "Enter last name"
                })}

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    selected={formData.date_of_birth ? new Date(formData.date_of_birth) : null}
                    onChange={(date: Date) => 
                      handleInputChange({
                        target: {
                          name: 'date_of_birth',
                          value: date.toISOString().split('T')[0]
                        }
                      } as any)
                    }
                    dateFormat="yyyy-MM-dd"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    placeholderText="Select date of birth"
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    id="gender"
                    required
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h2>
              <div className="grid grid-cols-1 gap-6">
                {renderInput("Address", {
                  type: "text",
                  name: "address",
                  id: "address",
                  required: true,
                  value: formData.address,
                  onChange: handleInputChange,
                  placeholder: "Enter full address"
                })}

                {renderInput("Contact Number", {
                  type: "tel",
                  name: "contact_number",
                  id: "contact_number",
                  required: true,
                  value: formData.contact_number,
                  onChange: handleInputChange,
                  placeholder: "Enter contact number"
                })}

                {renderInput("Emergency Contact Name", {
                  type: "text",
                  name: "emergency_contact_name",
                  id: "emergency_contact_name",
                  required: true,
                  value: formData.emergency_contact_name,
                  onChange: handleInputChange,
                  placeholder: "Enter emergency contact name"
                })}

                {renderInput("Emergency Contact Number", {
                  type: "tel",
                  name: "emergency_contact_number",
                  id: "emergency_contact_number",
                  required: true,
                  value: formData.emergency_contact_number,
                  onChange: handleInputChange,
                  placeholder: "Enter emergency contact number"
                })}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Care Details</h2>
              <div className="grid grid-cols-1 gap-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Care Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="care_status"
                    id="care_status"
                    required
                    value={formData.care_status}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Care Notes
                  </label>
                  <textarea
                    name="care_notes"
                    id="care_notes"
                    rows={4}
                    value={formData.care_notes}
                    onChange={handleInputChange}
                    placeholder="Enter any additional care notes here..."
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <nav aria-label="Progress" className="mb-8">
          <ol className="flex items-center justify-center space-x-8 sm:space-x-16">
            {steps.map((stepItem, stepIdx) => (
              <li key={stepItem.name} className="relative">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => setStep(stepItem.id)}
                    className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                      step > stepItem.id
                        ? 'bg-indigo-600 border-indigo-600 hover:bg-indigo-700'
                        : step === stepItem.id
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-gray-300 text-gray-500'
                    }`}
                  >
                    {step > stepItem.id ? (
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className={`text-sm font-medium ${step === stepItem.id ? 'text-indigo-600' : ''}`}>
                        {stepItem.id}
                      </span>
                    )}
                  </button>
                  <span className="absolute -bottom-6 w-max text-sm font-medium text-gray-600">
                    {stepItem.name}
                  </span>
                </div>
                {stepIdx !== steps.length - 1 && (
                  <div 
                    className={`absolute top-5 left-full w-full h-[2px] transition-colors duration-200 ${
                      step > stepItem.id ? 'bg-indigo-600' : 'bg-gray-300'
                    }`} 
                    style={{ width: 'calc(100% + 2rem)' }}
                  />
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Add New Client</h1>
                <p className="mt-1 text-sm text-gray-500">Complete the form below to create a new client record</p>
              </div>
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-gray-200 text-sm font-medium rounded-lg text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                <svg className="mr-2 -ml-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </Link>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              {renderFormFields()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className="inline-flex items-center px-5 py-2.5 border border-gray-200 text-sm font-medium rounded-lg text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <svg className="mr-2 -ml-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <div className="flex space-x-3">
                {step < 3 && (
                  <button
                    type="button"
                    onClick={() => setStep(Math.min(3, step + 1))}
                    className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                  >
                    Next
                    <svg className="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
                {step === 3 && (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      <>
                        Create Client
                        <svg className="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 