import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppSelector';
import { uploadMedicine } from '../redux/pharmacySlice';
import{ subscribeUser, isValidPushSubscription }from '../utils/subscribeUser';
import QRCode from 'qrcode';

export default function UploadForm() {
  const dispatch = useAppDispatch()
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
 const { loading, error, medicine } = useAppSelector((state) => state.medicine);
  // State to manage form data
  const [formData, setFormData] = useState({
    name: '',
    expiryDate: '',
    quantity: '',
    email: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmissionError(null);
  setQrCodeUrl(null); // clear previous QR

  try {
    const pushSubscription = await subscribeUser();

    if (!pushSubscription || !isValidPushSubscription(pushSubscription)) {
      setSubmissionError(
        '❌ Push notifications are required to upload. Please allow notifications in your browser.'
      );
      console.error('❌ Invalid or missing push subscription. Aborting upload.');
      return;
    }

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });

    if (file) {
      form.append('image', file);
    }

    form.append('pushSubscription', JSON.stringify(pushSubscription));

    console.log('📤 FormData Preview:');
    for (const [key, val] of form.entries()) {
      console.log(`${key} →`, val);
    }

    const result = await dispatch(uploadMedicine(form));

    if (uploadMedicine.fulfilled.match(result)) {
      const uploadedMedicine = result.payload;
      console.log('✅ Uploaded:', uploadedMedicine._id);

      const qr = await QRCode.toDataURL(uploadedMedicine._id);
      setQrCodeUrl(qr);

      setFormData({
        name: '',
        expiryDate: '',
        quantity: '',
        email: '',
      });
      setFile(null);
    } else {
      setSubmissionError('⚠️ Upload failed. Please try again.');
    }
  } catch (err) {
    console.error('❌ Failed to upload medicine:', err);
    setSubmissionError('Failed to upload medicine. Please try again.');
  }
};


  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <input
        name="name"
        placeholder="Medicine Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        name="expiryDate"
        type="date"
        placeholder="Expiry Date"
        value={formData.expiryDate}
        onChange={handleChange}
        className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        name="quantity"
        type="number"
        placeholder="Quantity"
        value={formData.quantity}
        onChange={handleChange}
        className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        name="image"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full border border-gray-300 px-3 py-2 rounded bg-white"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>
 
      {error && <p className="text-red-500 text-sm">❌ {error}</p>}
      {submissionError && <p className="text-red-500 text-sm">❌ {submissionError}</p>}
      {medicine && <p className="text-green-600 text-sm">✅ Uploaded: {medicine.name}</p>}
      {qrCodeUrl && (
      <div className="flex flex-col items-center gap-2 mt-4 border-t pt-4">
        <p className="text-sm font-semibold">📦 QR Code for this medicine</p>
        <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
        <p className="text-xs text-gray-500 break-all">{medicine?._id}</p>
        <button
          onClick={() => window.print()}
          className="text-blue-600 text-sm underline hover:text-blue-800"
        >
          Print Label
        </button>
      </div>
    )}

    </form>
  );
}
