'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Fix for motion types
const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionP = motion.p;

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                Remote Care
              </span>
              <div className="hidden md:flex space-x-6">
                <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
                <a href="#download" className="text-gray-600 hover:text-gray-900">Download</a>
                <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
              </div>
            </div>
            <Link
              href="/auth/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Sign In
              <svg className="ml-2 -mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <MotionH1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Transform Healthcare Management
              <span className="block text-indigo-600 mt-2">with Remote Care</span>
            </MotionH1>
            <MotionP 
              className="max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Streamline your healthcare operations with our comprehensive client management platform. 
              Built for modern healthcare providers.
            </MotionP>
            <MotionDiv 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link 
                href="/auth/login"
                className="inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 md:text-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Get Started
                <svg className="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <button className="inline-flex justify-center items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 md:text-lg transition-all duration-200">
                Learn More
              </button>
            </MotionDiv>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
            <p className="text-xl text-gray-600">Everything you need to manage your healthcare practice</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <MotionDiv
                key={feature.title}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${feature.iconBg} mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section id="download" className="py-20 bg-gradient-to-b from-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <MotionDiv
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Take Remote Care Everywhere
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Download our mobile app to manage your healthcare practice on the go. Available now on Android.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="https://play.google.com/store"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-black hover:bg-gray-900 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.9 5c-.1.1-.2.2-.2.4v13.2c0 .2.1.3.2.4l5.8-7z"/>
                      <path d="M3 20.5V3.5c0-.9.9-1.4 1.7-.9l13.7 8.5c.7.4.7 1.4 0 1.8L4.7 21.4c-.8.5-1.7 0-1.7-.9z"/>
                    </svg>
                    Get it on Google Play
                  </a>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className="text-yellow-400">
                        {'★'.repeat(5)}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">4.8/5 rating</span>
                    </div>
                    <span className="text-sm text-gray-600">10K+ downloads</span>
                  </div>
                </div>
              </MotionDiv>
            </div>
            <MotionDiv
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full max-w-sm mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl transform rotate-6 scale-105 opacity-20 blur-xl"></div>
                <Image
                  src="/app-mockup.png"
                  alt="Remote Care Mobile App"
                  width={300}
                  height={600}
                  className="relative rounded-3xl shadow-2xl mx-auto"
                />
              </div>
            </MotionDiv>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Need Help?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Our support team is here to assist you 24/7
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-gray-50 rounded-xl">
                <svg className="h-8 w-8 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-semibold mb-2">Email Support</h3>
                <p className="text-gray-600">support@remotecare.com</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl">
                <svg className="h-8 w-8 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <h3 className="text-lg font-semibold mb-2">Phone Support</h3>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl">
                <svg className="h-8 w-8 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
                <p className="text-gray-600">Available 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-600 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-8 py-16 sm:p-16 xl:p-20">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-white mb-6">
                  Ready to transform your healthcare practice?
                </h2>
                <p className="text-xl text-indigo-100 mb-8">
                  Join thousands of healthcare providers who trust Remote Care
                </p>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-indigo-600 bg-white hover:bg-indigo-50 transition-all duration-200"
                >
                  Get Started Now
                  <svg className="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-sm">© 2024 Remote Care. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-gray-500">Terms</a>
              <a href="#" className="text-gray-400 hover:text-gray-500">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: 'Client Management',
    description: 'Efficiently manage and track client information in one centralized location.',
    icon: (
      <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    iconBg: 'bg-indigo-50',
  },
  {
    title: 'Care Documentation',
    description: 'Document and track care services with our intuitive note-taking system.',
    icon: (
      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    iconBg: 'bg-blue-50',
  },
  {
    title: 'Real-time Updates',
    description: 'Stay informed with instant updates and notifications about client care.',
    icon: (
      <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    iconBg: 'bg-green-50',
  },
];
