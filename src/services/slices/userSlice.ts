import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

type UserState = {
  user: TUser | null;
  isAuth: boolean;
  isUserLoading: boolean;
  errorUser: string | null;
  isAuthChecked: boolean;
};

const initialState: UserState = {
  user: null,
  isAuth: false,
  isUserLoading: false,
  errorUser: null,
  isAuthChecked: false
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});

export const getUser = createAsyncThunk('user/getUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isUserLoading = true;
        state.errorUser = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isUserLoading = false;
        state.errorUser = action.error.message || 'Ошибка регистрации';
      })

      .addCase(loginUser.pending, (state) => {
        state.isUserLoading = true;
        state.errorUser = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isUserLoading = false;
        state.errorUser = action.error.message || 'Ошибка авторизации';
      })

      .addCase(logoutUser.pending, (state) => {
        state.isUserLoading = true;
        state.errorUser = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isUserLoading = false;
        state.user = null;
        state.isAuth = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isUserLoading = false;
        state.errorUser = action.error.message || 'Ошибка выхода';
      })

      .addCase(getUser.pending, (state) => {
        state.isUserLoading = true;
        state.isAuthChecked = false;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.user = action.payload;
        state.isAuth = true;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.isUserLoading = false;
        state.isAuth = false;
        state.isAuthChecked = true;
      })

      .addCase(updateUser.pending, (state) => {
        state.isUserLoading = true;
        state.errorUser = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isUserLoading = false;
        state.errorUser = action.error.message || 'Ошибка изменения данных';
      });
  }
});

export default userSlice;
