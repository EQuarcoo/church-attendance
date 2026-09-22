import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';

async function registerMember(formData) {
  'use server';

  const fullName = formData.get('full_name');
  const phone = formData.get('phone');
  const email = formData.get('email');
  const dateOfBirth = formData.get('date_of_birth');
  const gender = formData.get('gender');
  const residence = formData.get('residence');
  const immediateContactName = formData.get('immediate_contact_name');
  const immediateContactPhone = formData.get('immediate_contact_phone');
  const department = formData.get('department');
  const fellowship = formData.get('fellowship');
  const maritalStatus = formData.get('marital_status');
  const occupation = formData.get('occupation');
  const role = formData.get('role');

  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const memberCode = `SM-${randomNum}`;

  const { error } = await supabase.from('members').insert({
    member_code: memberCode,
    full_name: fullName,
    phone: phone,
    email: email || null,
    date_of_birth: dateOfBirth || null,
    gender: gender || null,
    residence: residence || null,
    immediate_contact_name: immediateContactName || null,
    immediate_contact_phone: immediateContactPhone || null,
    department: department || null,
    fellowship: fellowship || null,
    marital_status: maritalStatus || null,
    occupation: occupation || null,
    role: role || 'Member',
  });

  if (error) {
    console.error(error);
    throw new Error(`Could not register member: ${error.message}`);
  }

  redirect(`/register/success?code=${memberCode}`);
}

function Field({ label, name, type, required }) {
  return (
    <div>
      <label className="block text-sm text-[#64748B] mb-1.5">
        {label} {required ? <span className="text-[#B1543A]">*</span> : ''}
      </label>
      <input
        type={type || 'text'}
        name={name}
        required={required || false}
        className="w-full border-b border-[#1E2A45]/15 bg-transparent pb-2 focus:outline-none focus:border-[#B8863F] transition-colors"
      />
    </div>
  );
}

function Select({ label, name, options, defaultValue }) {
  return (
    <div>
      <label className="block text-sm text-[#64748B] mb-1.5">{label}</label>
      <select
        name={name}
        defaultValue={defaultValue || ''}
        className="w-full border-b border-[#1E2A45]/15 bg-transparent pb-2 focus:outline-none focus:border-[#B8863F] transition-colors"
      >
        <option value="">— select —</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <h2 className="font-display text-lg pt-4 pb-1 border-t border-[#1E2A45]/10 first:border-t-0 first:pt-0">
      {children}
    </h2>
  );
}

export default async function RegisterPage() {
  const { data: departments } = await supabase
    .from('departments')
    .select('name')
    .order('name', { ascending: true });

  const deptNames = departments?.map((d) => d.name) || [];

  return (
    <main className="max-w-xl mx-auto px-6 py-16">
      <p className="text-[#B8863F] text-sm font-medium mb-2">New Member</p>
      <h1 className="font-display text-3xl mb-10">Register a member</h1>

      <form action={registerMember} className="space-y-6">
        <SectionLabel>Basic details</SectionLabel>
        <Field label="Full name" name="full_name" required />
        <Field label="Phone" name="phone" required />
        <Field label="Email" name="email" type="email" />
        <Field label="Date of birth" name="date_of_birth" type="date" />
        <Select label="Gender" name="gender" options={['Male', 'Female']} />

        <SectionLabel>Contact & home</SectionLabel>
        <Field label="Residence" name="residence" />
        <Field label="Immediate contact name" name="immediate_contact_name" />
        <Field label="Immediate contact phone" name="immediate_contact_phone" />

        <SectionLabel>Church life</SectionLabel>
        <Select label="Department" name="department" options={deptNames} />
        <Field label="Fellowship" name="fellowship" />
        <Select
          label="Role"
          name="role"
          defaultValue="Member"
          options={['Member', 'Pastor', 'Resident Pastor', 'Head Pastor', 'Elder', 'Deacon', 'Head of Department']}
        />

        <SectionLabel>Other</SectionLabel>
        <Select label="Marital status" name="marital_status" options={['Single', 'Married', 'Divorced', 'Widowed']} />
        <Field label="Occupation" name="occupation" />

        <button
          type="submit"
          className="w-full bg-[#1E2A45] text-white py-3 rounded hover:bg-[#16203a] transition-colors mt-4"
        >
          Register member
        </button>
      </form>
    </main>
  );
}