// Example: /src/pages/DispenseMedicine.tsx

import React from 'react';
import Html5QRScanner from '../features/Html5QRScanner';
import { dispenseMedicine } from '../api/dispense';

export default function DispenseMedicinePage() {
  const handleScan = async (scannedId: string) => {
    try {
      const result = await dispenseMedicine(scannedId);
      alert(`✅ Dispensed ${result.name}. Remaining stock: ${result.quantity}`);
    } catch (err) {
      console.error('❌ Dispense failed:', err);
      alert('Failed to dispense. Please try again.');
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">📦 Scan & Dispense Medicine</h1>
      <Html5QRScanner onScan={handleScan} />
    </div>
  );
}
