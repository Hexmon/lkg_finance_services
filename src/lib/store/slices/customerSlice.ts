import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CustomerDetails {
  customerName: string;
  mobileNumber: string;
  email?: string;
  idNumber?: string;
}

interface CustomerState {
  details: CustomerDetails | null;
}

const initialState: CustomerState = { details: null };

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCustomerDetails: (state, action: PayloadAction<CustomerDetails>) => {
      state.details = action.payload;
    },
    clearCustomerDetails: (state) => {
      state.details = null;
    },
  },
});

export const { setCustomerDetails, clearCustomerDetails } = customerSlice.actions;
export default customerSlice.reducer;
