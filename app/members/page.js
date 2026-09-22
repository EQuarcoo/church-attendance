import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Panel } from '@/components/FormControls';

export default async function MembersPage() {
  const { data: members, error } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <p className="p-8 text-red-500 text-sm">Error loading members: {error.message}</p>;
  }

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-lg font-semibold text-black dark:text-white">Members</h1>
            <p className="text-sm text-black/40 dark:text-white/40">{members.length} registered</p>
          </div>
          <Link
            href="/register"
            className="bg-green-500 text-black font-medium text-sm px-4 py-2 rounded-md hover:bg-green-400 transition-colors"
          >
            + Register
          </Link>
        </div>

        <Panel>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 dark:border-white/10">
                <th className="px-4 py-3 text-[11px] uppercase tracking-wide text-black/40 dark:text-white/40 font-medium">Code</th>
                <th className="px-4 py-3 text-[11px] uppercase tracking-wide text-black/40 dark:text-white/40 font-medium">Name</th>
                <th className="px-4 py-3 text-[11px] uppercase tracking-wide text-black/40 dark:text-white/40 font-medium">Phone</th>
                <th className="px-4 py-3 text-[11px] uppercase tracking-wide text-black/40 dark:text-white/40 font-medium">Department</th>
                <th className="px-4 py-3 text-[11px] uppercase tracking-wide text-black/40 dark:text-white/40 font-medium">Card</th>
                <th className="px-4 py-3 text-[11px] uppercase tracking-wide text-black/40 dark:text-white/40 font-medium">History</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-black/5 dark:border-white/5 last:border-b-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-mono text-xs text-black/60 dark:text-white/60">{member.member_code}</td>
                  <td className="px-4 py-3 text-black dark:text-white">{member.full_name}</td>
                  <td className="px-4 py-3 text-black/60 dark:text-white/60">{member.phone}</td>
                  <td className="px-4 py-3 text-black/60 dark:text-white/60">{member.department || '—'}</td>
                  <td className="px-4 py-3">
                    <Link href={`/members/${member.member_code}/card`} className="text-green-600 dark:text-green-400 hover:underline text-xs">
                      View
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/members/${member.member_code}/history`} className="text-green-600 dark:text-green-400 hover:underline text-xs">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {members.length === 0 && (
            <p className="text-center text-black/40 dark:text-white/40 text-sm py-12">No members registered yet.</p>
          )}
        </Panel>
      </div>
    </main>
  );
}