import { supabase } from '@/lib/supabase';

function getDateKey(dateInput) {
  return new Date(dateInput).toISOString().split('T')[0];
}

// Build an array of the last `count` Sundays, most recent first
function getRecentSundays(count) {
  const sundays = [];
  const today = new Date();
  const current = new Date(today);

  // Step back to the most recent Sunday (or today, if today is Sunday)
  current.setDate(current.getDate() - current.getDay());

  for (let i = 0; i < count; i++) {
    sundays.push(getDateKey(current));
    current.setDate(current.getDate() - 7);
  }

  return sundays;
}

export default async function FollowUpPage() {
  const { data: members } = await supabase.from('members').select('member_code, full_name, phone');
  const { data: attendance } = await supabase.from('attendance').select('member_code, checked_in_at');

  const recentSundays = getRecentSundays(8);

  // Build a lookup: for each member, which dates did they attend?
  const attendanceByMember = {};
  for (const record of attendance || []) {
    const key = record.member_code;
    const dateKey = getDateKey(record.checked_in_at);
    if (!attendanceByMember[key]) attendanceByMember[key] = new Set();
    attendanceByMember[key].add(dateKey);
  }

  // For each member, count consecutive missed Sundays, starting from the most recent
  const flaggedMembers = [];

  for (const member of members || []) {
    const attendedDates = attendanceByMember[member.member_code] || new Set();

    let consecutiveMisses = 0;
    for (const sunday of recentSundays) {
      if (attendedDates.has(sunday)) break; // they attended — streak broken, stop counting
      consecutiveMisses++;
    }

    if (consecutiveMisses >= 3) {
      flaggedMembers.push({ ...member, consecutiveMisses });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Follow-Up Recommended</h1>
        <p className="text-gray-600 mb-6">Members who have missed 3 or more consecutive Sundays.</p>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {flaggedMembers.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No members currently need follow-up. 🎉
            </p>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-gray-700 text-sm">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Missed</th>
                </tr>
              </thead>
              <tbody>
                {flaggedMembers.map((m) => (
                  <tr key={m.member_code} className="border-t border-gray-100">
                    <td className="px-4 py-3">{m.full_name}</td>
                    <td className="px-4 py-3">{m.phone}</td>
                    <td className="px-4 py-3">
                      <span className="bg-red-100 text-red-700 text-sm font-medium px-2 py-1 rounded">
                        {m.consecutiveMisses} Sundays
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}