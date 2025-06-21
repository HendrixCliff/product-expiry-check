import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppSelector';
import {
  fetchAllMedicines,
  deleteMedicine,
} from './../redux/pharmacySlice';

export default function MedicineList() {
  const dispatch = useAppDispatch();
  const { medicines, loading, error, page, totalPages } = useAppSelector(
    (state) => state.medicine
  );

  const [filters, setFilters] = useState({
    expiryBefore: '',
    expiryAfter: '',
    page: 1,
    limit: 10,
  });

  const handleDelete = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete this medicine?');
    if (!confirm) return;

    const result = await dispatch(deleteMedicine(id));

    if (deleteMedicine.fulfilled.match(result)) {
      alert('✅ Deleted successfully');
    } else {
      alert('❌ Delete failed: ' + result.payload);
    }
  };

  useEffect(() => {
    dispatch(fetchAllMedicines(filters));
  }, [filters, dispatch]);

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {Array.isArray(medicines) && medicines.length > 0 ? (
        <ul className="space-y-4">
          {medicines.map((med) => (
            <li
              key={med._id}
              className="border rounded p-4 shadow-sm flex flex-col items-center"
            >
              <div className="text-center">
                <strong className="text-lg">{med.name}</strong>
                <p>Expires: {new Date(med.expiryDate).toLocaleDateString()}</p>
                <p>Qty: {med.quantity}</p>
              </div>

              {med.imagePath && (
                <img
                  src={med.imagePath}
                  alt={med.name}
                  className="w-32 h-48 object-cover rounded mt-2"
                />
              )}

              <button
                onClick={() => handleDelete(med._id)}
                className="mt-3 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No medicines found.</p>
      )}

      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={page <= 1}
          onClick={() => handlePageChange(page - 1)}
          className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm">
          Page {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => handlePageChange(page + 1)}
          className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
