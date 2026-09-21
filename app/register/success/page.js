'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const memberCode = searchParams.get('code');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-2">Registration successful!</h1>

        {memberCode && (
          <>
            <p className="text-gray-600 mb-4">Member ID: <span className="font-mono font-semibold">{memberCode}</span></p>

            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <QRCodeSVG value={memberCode} size={200} />
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              This QR code is this member&apos;s permanent check-in card.
            </p>
          </>
        )}

        <a
          href="/register"
          className="inline-block bg-blue-600 text-white font-medium rounded-md px-4 py-2 hover:bg-blue-700 transition-colors"
        >
          Register another member
        </a>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center">Loading registration...</p>}>
      <SuccessContent />
    </Suspense>
  );
}