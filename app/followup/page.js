import { supabase } from '@/lib/supabase';
import { Panel } from '@/components/FormControls';
export const dynamic = 'force-dynamic';

function getConsecutiveMisses(lastCheckInIso) {
  if (!lastCheckInIso) return 0;

  const lastCheckIn = new Date(lastCheckInIso);
  const now = new Date();
  const diffDays = Math.max(0, Math.floor((now.getTime() - lastCheckIn.getTime()) / 86400000));

  if (diffDays < 21) return 0;

  return Math.max(1, Math.floor(diffDays / 7));
}

export default async function FollowUpPage() {
  const { data: members, error: membersError } = await supabase
    .from('members')
    .select('member_code, full_name, phone');

  if (membersError) {
    return <p className="p-8 text-red-500 text-sm">Error loading follow-up list: {membersError.message}</p>;
  }

  const { data: attendance, error: attendanceError } = await supabase
    .from('attendance')
    .select('member_code, checked_in_at')
    .order('checked_in_at', { ascending: false });

  if (attendanceError) {
    return <p className="p-8 text-red-500 text-sm">Error loading attendance: {attendanceError.message}</p>;
  }

  const latestCheckInByMember = new Map();

  for (const record of attendance || []) {
    if (!record.member_code || latestCheckInByMember.has(record.member_code)) continue;
    latestCheckInByMember.set(record.member_code, record.checked_in_at);
  }

  const flaggedMembers = (members || [])
    .map((member) => {
      const consecutiveMisses = getConsecutiveMisses(latestCheckInByMember.get(member.member_code));
      return { ...member, consecutiveMisses };
    })
    .filter((member) => member.consecutiveMisses >= 3);

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-lg font-semibold text-black dark:text-white mb-1">Follow-up recommended</h1>
        <p className="text-sm text-black/40 dark:text-white/40 mb-6">
          Members who have missed 3 or more consecutive Sundays.
        </p>

        <Panel>
          {flaggedMembers.length === 0 ? (
            <p className="text-center text-black/40 dark:text-white/40 text-sm py-12">
              No members currently need follow-up.
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-black/10 dark:border-white/10">
                  <th className="px-4 py-3 text-[11px] uppercase tracking-wide text-black/40 dark:text-white/40 font-medium">Name</th>
                  <th className="px-4 py-3 text-[11px] uppercase tracking-wide text-black/40 dark:text-white/40 font-medium">Phone</th>
                  <th className="px-4 py-3 text-[11px] uppercase tracking-wide text-black/40 dark:text-white/40 font-medium">Missed</th>
                </tr>
              </thead>
              <tbody>
                {flaggedMembers.map((m) => (
                  <tr key={m.member_code} className="border-b border-black/5 dark:border-white/5 last:border-b-0">
                    <td className="px-4 py-3 text-black dark:text-white">{m.full_name}</td>
                    <td className="px-4 py-3 text-black/60 dark:text-white/60">{m.phone}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-red-500 border border-red-500/30 bg-red-500/5 px-2 py-1 rounded">
                        {m.consecutiveMisses} Sundays
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>
      </div>
    </main>
  );
}