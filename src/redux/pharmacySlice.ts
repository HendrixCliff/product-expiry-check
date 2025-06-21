import { createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import type { Medicine } from '../types/Medicine';

interface PaginatedMedicineResponse {
  total: number
  page: number
  totalPages: number
  results: Medicine[]
}

interface MedicineState {
  medicine: Medicine | null;
  medicines: Medicine[]
  total: number
  page: number
  totalPages: number
  loading: boolean
  error: string | null
}

const initialState: MedicineState = {
  medicine: null,
  medicines: [],
  total: 0,
  page: 1,
  totalPages: 0,
  loading: false,
  error: null,
}


export const uploadMedicine = createAsyncThunk<Medicine, FormData>(
  'medicine/upload',
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post<Medicine>(
        'http://localhost:5000/api/v1/medicine/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('❌ Axios error:', error);
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || 'Failed to upload'
      );
    }
  }
);
export const deleteMedicine = createAsyncThunk<
  string, // ✅ return type = deleted ID
  string, // ✅ arg = medicine ID
  { rejectValue: string }
>('medicine/delete', async (id, thunkAPI) => {
  try {
    await axios.delete(`http://localhost:5000/api/v1/medicine/${id}`);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message || 'Delete failed'
    );
  }
});
export const fetchAllMedicines = createAsyncThunk<
  PaginatedMedicineResponse, // returned data
  {
    expiryBefore?: string
    expiryAfter?: string
    page?: number
    limit?: number
  },
  { rejectValue: string }
>('medicine/fetchAll', async (params, thunkAPI) => {
  try {
    const query = new URLSearchParams()

    if (params.expiryBefore) query.append('expiryBefore', params.expiryBefore)
    if (params.expiryAfter) query.append('expiryAfter', params.expiryAfter)
    if (params.page) query.append('page', String(params.page))
    if (params.limit) query.append('limit', String(params.limit))

    const response = await axios.get(`http://localhost:5000/api/v1/medicine?${query.toString()}`)
    return response.data
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to fetch medicines')
  }
})


const medicineSlice = createSlice({
  name: 'medicine',
  initialState,
   reducers: {
    clearMedicineState: (state) => {
      state.medicine = null
      state.medicines = []
      state.total = 0
      state.page = 1
      state.totalPages = 0
      state.loading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadMedicine.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(uploadMedicine.fulfilled, (state, action: PayloadAction<Medicine>) => {
        state.loading = false
        state.medicine = action.payload
      })
      .addCase(uploadMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
       .addCase(fetchAllMedicines.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllMedicines.fulfilled, (state, action) => {
        state.loading = false
        state.medicines = action.payload.results
        state.total = action.payload.total
        state.page = action.payload.page
        state.totalPages = action.payload.totalPages
      })
      .addCase(fetchAllMedicines.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Error loading medicines'
      })
          .addCase(deleteMedicine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMedicine.fulfilled, (state, action) => {
        state.loading = false;
        // remove from list if you're tracking all medicines
        state.medicines = state.medicines.filter(
          (med) => med._id !== action.payload
        );
      })
      .addCase(deleteMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Delete failed';
      })
  },
})

export const { clearMedicineState } = medicineSlice.actions
export default medicineSlice.reducer
