import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function TestPage() {
  const { data, error } = await supabase
    .from('members')
    .select('*');

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Something went wrong</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Members table connection test</h1>
      <p>Rows found: {data.length}</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}