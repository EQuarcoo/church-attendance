import { supabase } from '@/lib/supabase';
import { getStaffUser } from '@/lib/getStaffUser';

function getDateKey(isoString) {
  return new Date(isoString).toISOString().split('T')[0]; // e.g. "2026-09-21"
}

export default async function DashboardPage() {
  const staffUser = await getStaffUser();
  const { data: members } = await supabase.from('members').select('id');
  const { data: attendance } = await supabase
    .from('attendance')
    .select('*')
    .order('checked_in_at', { ascending: false });

  const totalMembers = members?.length || 0;
  const records = attendance || [];

  // Find the most recent date that has attendance
  const mostRecentDateKey = records.length > 0 ? getDateKey(records[0].checked_in_at) : null;

  const todaysRecords = records.filter(
    (r) => getDateKey(r.checked_in_at) === mostRecentDateKey
  );

  // Group today's records by service
  const byService = {};
  for (const record of todaysRecords) {
    byService[record.service] = (byService[record.service] || 0) + 1;
  }

  // Build a simple trend: count per date, for the last 5 distinct dates
  const dateCounts = {};
  for (const record of records) {
    const key = getDateKey(record.checked_in_at);
    dateCounts[key] = (dateCounts[key] || 0) + 1;
  }
  const trend = Object.entries(dateCounts)
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex justify-between items-center mb-6">
  <h1 className="text-2xl font-bold text-gray-900">Leadership Dashboard</h1>
  <div className="flex items-center gap-3">
    <span className="text-sm text-gray-600">{staffUser.full_name} ({staffUser.role})</span>
    <form action="/logout" method="POST">
      <button className="text-sm bg-gray-200 text-gray-700 rounded-md px-3 py-1.5 hover:bg-gray-300 transition-colors">
        Log Out
      </button>
    </form>
  </div>
</div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-5">
            <p className="text-3xl font-bold text-blue-600">{totalMembers}</p>
            <p className="text-sm text-gray-600">Total Members</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5">
            <p className="text-3xl font-bold text-green-600">{todaysRecords.length}</p>
            <p className="text-sm text-gray-600">
              {mostRecentDateKey ? `Attendance on ${mostRecentDateKey}` : 'No attendance yet'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {mostRecentDateKey ? `Breakdown by Service — ${mostRecentDateKey}` : 'No services recorded yet'}
          </h2>
          <div className="space-y-2">
            {Object.entries(byService).map(([service, count]) => (
              <div key={service} className="flex justify-between border-b border-gray-100 py-2">
                <span className="text-gray-700">{service}</span>
                <span className="font-semibold text-gray-900">{count}</span>
              </div>
            ))}
            {Object.keys(byService).length === 0 && (
              <p className="text-gray-500 text-sm">No data yet.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Attendance Trend</h2>
          <div className="space-y-2">
            {trend.map(([date, count]) => (
              <div key={date} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-28">{date}</span>
                <div className="flex-1 bg-gray-100 rounded h-4 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full"
                    style={{ width: `${Math.min(count * 10, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-900 w-8 text-right">{count}</span>
              </div>
            ))}
            {trend.length === 0 && <p className="text-gray-500 text-sm">No data yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}