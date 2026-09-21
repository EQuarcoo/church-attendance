'use client';

import { QRCodeSVG } from 'qrcode.react';

export default function CardDisplay({ member }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 print:bg-white print:p-0">
      <button
        onClick={() => window.print()}
        className="mb-6 bg-blue-600 text-white font-medium rounded-md px-4 py-2 hover:bg-blue-700 transition-colors print:hidden"
      >
        Print Card
      </button>

      <div className="card w-[340px] h-[210px] bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col justify-between p-5 print:shadow-none print:border-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Church Member</p>
          <h1 className="text-lg font-bold text-gray-900 leading-tight">{member.full_name}</h1>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-500">Member ID</p>
            <p className="font-mono font-semibold text-sm">{member.member_code}</p>
            {member.department && (
              <p className="text-xs text-gray-500 mt-1">{member.department}</p>
            )}
          </div>
          <QRCodeSVG value={member.member_code} size={70} />
        </div>
      </div>
    </div>
  );
}