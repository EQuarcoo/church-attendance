'use client';

import { useEffect, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';

export default function Scanner({ onScan }) {
  const scannerRef = useRef(null);
  const hasScannedRef = useRef(false);

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
        () => {
          // no QR found this frame — ignore
        }
      )
      .catch((err) => console.error('Could not start camera:', err));

    function stopScannerSafely() {
      const scannerInstance = scannerRef.current;
      if (
        scannerInstance &&
        scannerInstance.getState() === Html5QrcodeScannerState.SCANNING
      ) {
        return scannerInstance.stop().catch(() => {});
      }
      return Promise.resolve();
    }

    return () => {
      stopScannerSafely();
    };
  }, [onScan]);

  return <div id="qr-reader" className="w-full rounded-lg overflow-hidden" />;
}