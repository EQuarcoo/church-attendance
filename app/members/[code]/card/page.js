import { supabase } from '@/lib/supabase';
import CardDisplay from './CardDisplay';

export default async function MemberCardPage({ params }) {
  const { code } = await params;

  const { data: member, error } = await supabase
    .from('members')
    .select('*')
    .eq('member_code', code)
    .single();

  if (error || !member) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Member not found.</p>
      </div>
    );
  }

  return <CardDisplay member={member} />;
}