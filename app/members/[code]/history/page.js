import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default async function MemberHistoryPage({ params }) {
  const { code } = await params;

  const { data: member } = await supabase
    .from('members')
    .select('*')
    .eq('member_code', code)
    .single();

  const { data: records, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('member_code', code)
    .order('checked_in_at', { ascending: false });

  if (!member) {
    return <div className="p-8 text-red-600">Member not found.</div>;
  }

  const totalAttended = records?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/members" className="text-blue-600 hover:underline text-sm mb-4 inline-block">
          ← Back to Members
        </Link>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{member.full_name}</h1>
          <p className="text-gray-500 font-mono text-sm mb-4">{member.member_code}</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-3xl font-bold text-green-600">{totalAttended}</p>
              <p className="text-sm text-gray-600">Total services attended</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <h2 className="px-4 py-3 bg-gray-100 font-semibold text-gray-700">Attendance History</h2>
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-xs">
              <tr>
                <th className="px-4 py-2">Service</th>
                <th className="px-4 py-2">Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {records?.map((record) => (
                <tr key={record.id} className="border-t border-gray-100">
                  <td className="px-4 py-2">{record.service}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {new Date(record.checked_in_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {(!records || records.length === 0) && (
            <p className="text-center text-gray-500 py-8">No attendance recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}