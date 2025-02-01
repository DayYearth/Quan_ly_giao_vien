import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { callFetchAccount } from '../../services/api';

export const fetchAccount = createAsyncThunk(
    'account/fetchAccount',
    async () => {
        const response = await callFetchAccount();
        return response.data;
    }
)

const initialState = {
    isAuthenticated: false,    
    user: {
        id: "",
        email: "",
        name: "",
        phone: "",
        avatar: "",
    },
    tempAvatar: ""
};


export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    doLoginAction: (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
    },
    doGetAccountAction: (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
    },
    doLogoutAction: (state) => {
        localStorage.removeItem("access_token");
        state.isAuthenticated = false;
        state.user = {
            id: "",
            name: "",
            email: "",
            avatar: "",
            phone: "",
        };
    },
    doUploadAvatarAction: (state, action) => {
        state.tempAvatar = action.payload.avatar
    },
    doUpdateUserInfoAction: (state, action) => {
        state.user.avatar = action.payload.avatar;
        state.user.phone = action.payload.phone;
        state.user.name = action.payload.name;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchAccount.pending, (state, action) => {
        if (action.payload) {
            state.isAuthenticated = true;
        }
    })

    builder.addCase(fetchAccount.fulfilled, (state, action) => {
        if (action.payload) {
            state.isAuthenticated = true;
            state.isLoading = false;
            state.user.id = action?.payload?.user?.id;
            state.user.email = action.payload.user?.email;
            state.user.name = action.payload.user?.name;
            state.user.avatar = action.payload.user?.avatar;
            state.user.phone = action.payload.user?.phone;
        }
    })

    builder.addCase(fetchAccount.rejected, (state, action) => {
        if (action.payload) {
            state.isAuthenticated = false;
        }
    })
},
})

export const { doLoginAction, doLogoutAction, doGetAccountAction, doUploadAvatarAction, doUpdateUserInfoAction} = accountSlice.actions;

export default accountSlice.reducer;