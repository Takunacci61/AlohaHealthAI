import { Metadata } from 'next';
import { Toaster }from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'Remote Care',
  description: 'Your trusted healthcare companion',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Toaster />
        {children}
      </body>
    </html>
  );
}
