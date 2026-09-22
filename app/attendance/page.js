import { supabase } from '@/lib/supabase';

export default async function AttendancePage() {
  const { data: records, error } = await supabase
    .from('attendance')
    .select('*')
    .order('checked_in_at', { ascending: false });

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-600">Error loading attendance: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Attendance Log</h1>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Member Code</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Checked In</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">{record.full_name}</td>
                  <td className="px-4 py-3 font-mono text-sm">{record.member_code}</td>
                  <td className="px-4 py-3">{record.service}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(record.checked_in_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {records.length === 0 && (
            <p className="text-center text-gray-500 py-8">No attendance recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}