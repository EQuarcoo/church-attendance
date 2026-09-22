import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Panel } from '@/components/FormControls';

export default async function MemberHistoryPage({ params }) {
  const { code } = await params;

  const { data: member } = await supabase.from('members').select('*').eq('member_code', code).single();
  const { data: records } = await supabase
    .from('attendance')
    .select('*')
    .eq('member_code', code)
    .order('checked_in_at', { ascending: false });

  if (!member) {
    return <p className="p-8 text-red-500 text-sm">Member not found.</p>;
  }

  const totalAttended = records?.length || 0;

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        <Link href="/members" className="text-xs text-black/40 dark:text-white/40 hover:text-green-500 mb-4 inline-block">
          ← Back to members
        </Link>

        <Panel className="p-6 mb-6">
          <h1 className="text-lg font-semibold text-black dark:text-white">{member.full_name}</h1>
          <p className="font-mono text-xs text-black/40 dark:text-white/40 mb-4">{member.member_code}</p>
          <div>
            <p className="text-2xl font-semibold text-green-600 dark:text-green-400">{totalAttended}</p>
            <p className="text-xs uppercase tracking-wide text-black/40 dark:text-white/40">Services attended</p>
          </div>
        </Panel>

        <Panel>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 dark:border-white/10">
                <th className="px-4 py-3 text-[11px] uppercase tracking-wide text-black/40 dark:text-white/40 font-medium">Service</th>
                <th className="px-4 py-3 text-[11px] uppercase tracking-wide text-black/40 dark:text-white/40 font-medium">Date & time</th>
              </tr>
            </thead>
            <tbody>
              {records?.map((record) => (
                <tr key={record.id} className="border-b border-black/5 dark:border-white/5 last:border-b-0">
                  <td className="px-4 py-3 text-black dark:text-white">{record.service}</td>
                  <td className="px-4 py-3 text-black/40 dark:text-white/40 text-xs">
                    {new Date(record.checked_in_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {(!records || records.length === 0) && (
            <p className="text-center text-black/40 dark:text-white/40 text-sm py-12">No attendance recorded yet.</p>
          )}
        </Panel>
      </div>
    </main>
  );
}