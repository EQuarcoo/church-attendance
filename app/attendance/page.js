import { supabase } from '@/lib/supabase';
import { Panel } from '@/components/FormControls';

export default async function AttendancePage() {
  const { data: records, error } = await supabase
    .from('attendance')
    .select('*')
    .order('checked_in_at', { ascending: false });

  if (error) {
    return <p className="p-8 text-red-500 text-sm">Error loading attendance: {error.message}</p>;
  }

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-lg font-semibold text-black dark:text-white mb-6">Attendance log</h1>

        <Panel>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 dark:border-white/10">
                <th className="px-4 py-3 text-[11px] uppercase tracking-wide text-black/40 dark:text-white/40 font-medium">Name</th>
                <th className="px-4 py-3 text-[11px] uppercase tracking-wide text-black/40 dark:text-white/40 font-medium">Code</th>
                <th className="px-4 py-3 text-[11px] uppercase tracking-wide text-black/40 dark:text-white/40 font-medium">Service</th>
                <th className="px-4 py-3 text-[11px] uppercase tracking-wide text-black/40 dark:text-white/40 font-medium">Checked in</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-b border-black/5 dark:border-white/5 last:border-b-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-black dark:text-white">{record.full_name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-black/60 dark:text-white/60">{record.member_code}</td>
                  <td className="px-4 py-3 text-black/60 dark:text-white/60">{record.service}</td>
                  <td className="px-4 py-3 text-black/40 dark:text-white/40 text-xs">
                    {new Date(record.checked_in_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {records.length === 0 && (
            <p className="text-center text-black/40 dark:text-white/40 text-sm py-12">No attendance recorded yet.</p>
          )}
        </Panel>
      </div>
    </main>
  );
}