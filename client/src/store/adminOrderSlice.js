// store/adminOrderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch all orders for admin
export const fetchAllAdminOrders = createAsyncThunk('adminOrders/fetchAll', async () => {
    const response = await axios.get('/api/admin/orders');
    return response.data;
});

const adminOrderSlice = createSlice({
    name: 'adminOrders',
    initialState: {
        orders: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllAdminOrders.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllAdminOrders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.orders = action.payload;
            })
            .addCase(fetchAllAdminOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export default adminOrderSlice.reducer;
