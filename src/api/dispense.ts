// src/api/dispense.ts

export async function dispenseMedicine(id: string) {
  const response = await fetch(`https://product-expiry-checker-backend.onrender.com/api/v1/medicine/medicines/${id}/decrement`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Unknown error');
  }

  return data;
}
