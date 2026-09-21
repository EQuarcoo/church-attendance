import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Church Attendance System</h1>
        <div className="flex gap-4 justify-center">
          <Link href="/register" className="bg-blue-600 text-white font-medium rounded-md px-4 py-2 hover:bg-blue-700 transition-colors">
            Register Member
          </Link>
          <Link href="/members" className="bg-gray-200 text-gray-800 font-medium rounded-md px-4 py-2 hover:bg-gray-300 transition-colors">
            View Members
          </Link>
        </div>
      </div>
    </div>
  );
}