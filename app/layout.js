import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'Church Attendance',
  description: 'Member and attendance management',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="bg-white dark:bg-[#0B0E14] text-black dark:text-white antialiased relative min-h-screen overflow-x-hidden transition-colors">
        <div className="pointer-events-none fixed inset-0 -z-10 hidden dark:block">
          <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-green-600/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="flex flex-col md:flex-row min-h-screen">
          <Sidebar />
          <div className="flex-1 md:ml-64">{children}</div>
        </div>
      </body>
    </html>
  );
}