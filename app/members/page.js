import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default async function MembersPage() {
  const { data: members, error } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-600">Error loading members: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Members</h1>
          <Link
            href="/register"
            className="bg-blue-600 text-white font-medium rounded-md px-4 py-2 hover:bg-blue-700 transition-colors"
          >
            + Register Member
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="px-4 py-3">Member Code</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">QR</th>
                <th className="px-4 py-3">History</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-mono text-sm">{member.member_code}</td>
                  <td className="px-4 py-3">{member.full_name}</td>
                  <td className="px-4 py-3">{member.phone}</td>
                  <td className="px-4 py-3">{member.department || '—'}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/members/${member.member_code}/card`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View QR
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/members/${member.member_code}/history`} className="text-blue-600 hover:underline text-sm">
                      View History
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {members.length === 0 && (
            <p className="text-center text-gray-500 py-8">No members registered yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}