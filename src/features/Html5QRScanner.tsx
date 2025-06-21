import { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface Props {
  onScan: (id: string) => void;
}

export default function Html5QRScanner({ onScan }: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const hasStartedRef = useRef(false);
  const isScanningRef = useRef(false);
  const [scanning, setScanning] = useState(true);
  const [scanResult, setScanResult] = useState<string | null>(null);

  // 👇 Simple mobile detection
  const isMobile = /iPhone|Android|Mobile|iPad/i.test(navigator.userAgent);

  useEffect(() => {
    const scanner = new Html5Qrcode('qr-reader');
    scannerRef.current = scanner;

    const startScanner = async () => {
      try {
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: 250 },
          async (decodedText) => {
            if (isScanningRef.current || !hasStartedRef.current) return;

            isScanningRef.current = true;
            setScanResult(decodedText);
            setScanning(false);
            await onScan(decodedText);

            try {
              if (hasStartedRef.current) {
                await scanner.stop();
                await scanner.clear();
                hasStartedRef.current = false;
              }
            } catch (stopErr) {
              console.warn('⚠️ Stop error:', stopErr);
            }
          },
          (error) => {
            // Frame not found, keep scanning
            console.warn('⚠️ QR code not found:', error);
          }
        );

        hasStartedRef.current = true;
        console.log('✅ Scanner started');
      } catch (err) {
        console.error('❌ Scanner failed:', err);
      }
    };

    startScanner();

    return () => {
      const stop = async () => {
        if (scannerRef.current && hasStartedRef.current) {
          await scannerRef.current.stop();
          await scannerRef.current.clear();
        }
      };
      stop();
    };
  }, [onScan]);

  // ✅ Here’s where you include the tip
  return (
    <div className="flex flex-col items-center">
      <div
        id="qr-reader"
        className="w-full max-w-[400px] aspect-square mx-auto border-2 border-dashed border-blue-500 rounded-lg"
      />
      {scanning && (
        <p className="text-sm text-gray-500 mt-2">📷 Searching for QR code...</p>
      )}
      {scanResult && (
        <p className="text-sm text-green-600 mt-2 break-all">✅ Scanned: {scanResult}</p>
      )}

      {/* 📱 Optional mobile hint */}
      {isMobile && (
        <p className="text-xs text-gray-400 mt-1 text-center">
          📱 Tip: Hold your phone steady and align the QR code inside the box.
        </p>
      )}
    </div>
  );
}
