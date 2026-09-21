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
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required ? '*' : ''}
      </label>
      <input
        type={type || 'text'}
        name={name}
        required={required || false}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Member Registration</h1>

        <form action={registerMember} className="space-y-4">
          <Field label="Full Name" name="full_name" required={true} />
          <Field label="Phone" name="phone" required={true} />
          <Field label="Email" name="email" type="email" />
          <Field label="Date of Birth" name="date_of_birth" type="date" />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select name="gender" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">-- select --</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <Field label="Residence" name="residence" />
          <Field label="Immediate Contact Name" name="immediate_contact_name" />
          <Field label="Immediate Contact Phone" name="immediate_contact_phone" />
          <Field label="Department" name="department" />
          <Field label="Fellowship" name="fellowship" />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
            <select name="marital_status" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">-- select --</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>

          <Field label="Occupation" name="occupation" />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium rounded-md px-4 py-2 hover:bg-blue-700 transition-colors"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}