import { supabase } from '@/lib/supabase';
import { getStaffUser } from '@/lib/getStaffUser';
import { Panel } from '@/components/FormControls';
export const dynamic = 'force-dynamic';

function getDateKey(isoString) {
  return new Date(isoString).toISOString().split('T')[0];
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
  const mostRecentDateKey = records.length > 0 ? getDateKey(records[0].checked_in_at) : null;
  const todaysRecords = records.filter((r) => getDateKey(r.checked_in_at) === mostRecentDateKey);

  const byService = {};
  for (const record of todaysRecords) {
    byService[record.service] = (byService[record.service] || 0) + 1;
  }

  const dateCounts = {};
  for (const record of records) {
    const key = getDateKey(record.checked_in_at);
    dateCounts[key] = (dateCounts[key] || 0) + 1;
  }
  const trend = Object.entries(dateCounts).sort((a, b) => (a[0] < b[0] ? 1 : -1)).slice(0, 5);

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold text-black dark:text-white">Dashboard</h1>
          <div className="flex items-center gap-3">
            <span className="text-xs text-black/40 dark:text-white/40">{staffUser.full_name} · {staffUser.role}</span>
            <form action="/logout" method="POST">
              <button className="text-xs border border-black/15 dark:border-white/15 rounded-md px-3 py-1.5 hover:border-green-500 transition-colors">
                Log out
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Panel className="p-5">
            <p className="text-2xl font-semibold text-black dark:text-white">{totalMembers}</p>
            <p className="text-xs uppercase tracking-wide text-black/40 dark:text-white/40 mt-1">Total members</p>
          </Panel>
          <Panel className="p-5">
            <p className="text-2xl font-semibold text-green-600 dark:text-green-400">{todaysRecords.length}</p>
            <p className="text-xs uppercase tracking-wide text-black/40 dark:text-white/40 mt-1">
              {mostRecentDateKey ? `Attendance · ${mostRecentDateKey}` : 'No attendance yet'}
            </p>
          </Panel>
        </div>

        <Panel className="p-6 mb-6">
          <h2 className="text-sm font-semibold text-black dark:text-white mb-4">
            {mostRecentDateKey ? `Breakdown by service — ${mostRecentDateKey}` : 'No services recorded yet'}
          </h2>
          <div className="space-y-2">
            {Object.entries(byService).map(([service, count]) => (
              <div key={service} className="flex justify-between border-b border-black/5 dark:border-white/5 py-2 text-sm last:border-b-0">
                <span className="text-black/70 dark:text-white/70">{service}</span>
                <span className="font-semibold text-black dark:text-white">{count}</span>
              </div>
            ))}
            {Object.keys(byService).length === 0 && (
              <p className="text-black/40 dark:text-white/40 text-sm">No data yet.</p>
            )}
          </div>
        </Panel>

        <Panel className="p-6">
          <h2 className="text-sm font-semibold text-black dark:text-white mb-4">Recent attendance trend</h2>
          <div className="space-y-2">
            {trend.map(([date, count]) => (
              <div key={date} className="flex items-center gap-3">
                <span className="text-xs text-black/40 dark:text-white/40 w-24 font-mono">{date}</span>
                <div className="flex-1 bg-black/5 dark:bg-white/5 rounded h-3 overflow-hidden">
                  <div className="bg-green-500 h-full" style={{ width: `${Math.min(count * 10, 100)}%` }} />
                </div>
                <span className="text-xs font-semibold text-black dark:text-white w-6 text-right">{count}</span>
              </div>
            ))}
            {trend.length === 0 && <p className="text-black/40 dark:text-white/40 text-sm">No data yet.</p>}
          </div>
        </Panel>
      </div>
    </main>
  );
}