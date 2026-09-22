'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';

export default function Scanner({ onScan }) {
  const scannerRef = useRef(null);
  const hasScannedRef = useRef(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const scanner = new Html5Qrcode('qr-reader');
    scannerRef.current = scanner;
    hasScannedRef.current = false;

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          if (hasScannedRef.current) return;
          hasScannedRef.current = true;

          stopScannerSafely().finally(() => {
            onScan(decodedText);
          });
        },
        () => {}
      )
      .catch((err) => {
        console.error('Could not start camera:', err);
        setError(
          typeof err === 'string' ? err : err?.message || 'Could not access the camera.'
        );
      });

    function stopScannerSafely() {
      const scannerInstance = scannerRef.current;
      if (scannerInstance && scannerInstance.getState() === Html5QrcodeScannerState.SCANNING) {
        return scannerInstance.stop().catch(() => {});
      }
      return Promise.resolve();
    }

    return () => {
      stopScannerSafely();
    };
  }, [onScan]);

  return (
    <div>
      <div id="qr-reader" className="w-full rounded-lg overflow-hidden" />
      {error && (
        <div className="mt-3 text-xs text-red-500 border border-red-500/30 bg-red-500/5 rounded-md px-3 py-2">
          {error}
          {error.toLowerCase().includes('not supported') && (
            <p className="mt-1 text-black/40 dark:text-white/40">
              Camera access requires <code className="font-mono">localhost</code> or HTTPS — check your address bar.
            </p>
          )}
        </div>
      )}
    </div>
  );
}