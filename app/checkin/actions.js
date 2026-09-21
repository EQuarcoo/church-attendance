'use server';

import { supabase } from '@/lib/supabase';

export async function recordCheckIn(memberCode) {
  const cleanCode = memberCode?.trim();

  if (!cleanCode) {
    return { success: false, error: 'No code detected.' };
  }

  const { data: member, error: lookupError } = await supabase
    .from('members')
    .select('member_code, full_name')
    .eq('member_code', cleanCode)
    .single();

  if (lookupError || !member) {
    return { success: false, error: `No member found with code "${cleanCode}".` };
  }

  const { error: insertError } = await supabase.from('attendance').insert({
    member_code: member.member_code,
    full_name: member.full_name,
    service: 'First Service',
  });

  if (insertError) {
    return { success: false, error: `Could not record attendance: ${insertError.message}` };
  }

  return { success: true, fullName: member.full_name };
}