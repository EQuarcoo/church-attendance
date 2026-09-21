'use client';

import { useState } from 'react';
import Scanner from './Scanner';
import { recordCheckIn } from './actions';

export default function CheckInPage() {
  const [status, setStatus] = useState('idle'); // idle | success | error
  const [message, setMessage] = useState('');
  const [scanKey, setScanKey] = useState(0); // forces scanner to remount

  async function handleScan(memberCode) {
    setStatus('loading');
    const result = await recordCheckIn(memberCode);

    if (result.success) {
      setStatus('success');
      setMessage(`Welcome, ${result.fullName}!`);
    } else {
      setStatus('error');
      setMessage(result.error);
    }
  }

  function scanNext() {
    setStatus('idle');
    setMessage('');
    setScanKey((prev) => prev + 1); // changing this remounts <Scanner>, restarting the camera
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-6 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Sunday Check-In</h1>

        {status === 'idle' && <Scanner key={scanKey} onScan={handleScan} />}

        {status === 'loading' && <p className="text-gray-600 py-8">Checking in...</p>}

        {status === 'success' && (
          <div className="py-6">
            <p className="text-green-600 font-semibold text-lg mb-4">{message}</p>
            <button
              onClick={scanNext}
              className="bg-green-600 text-white font-medium rounded-md px-4 py-2 hover:bg-green-700 transition-colors"
            >
              Scan Next Person
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="py-6">
            <p className="text-red-600 font-semibold mb-4">{message}</p>
            <button
              onClick={scanNext}
              className="bg-gray-600 text-white font-medium rounded-md px-4 py-2 hover:bg-gray-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}