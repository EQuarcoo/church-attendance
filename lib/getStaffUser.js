import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

export async function getStaffUser() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: staffRecord } = await supabase
    .from('staff')
    .select('full_name, role')
    .eq('user_id', user.id)
    .single();

  if (!staffRecord) {
    redirect('/login?error=Not authorized as staff');
  }

  return staffRecord;
}