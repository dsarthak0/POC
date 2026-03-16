import { create } from 'zustand';
import { authApi } from '../api/auth.api';
import type { LoginInputs, OtpInputs } from '../types/userAuthType'

interface AuthState {
  step: 'login' | 'otp' | 'success';
  isLoading: boolean;
  error: string | null;
  username:string; // Store email to pass from Login to OTP step
  
  // Actions
  performHandshake: () => Promise<void>;
  login: (data: LoginInputs) => Promise<void>;
  verifyOtp: (data: string) => Promise<void>;
  resetError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  step: 'login',
  username:'',
  isLoading: false,
  error: null,


  resetError: () => set({ error: null }),

  performHandshake: async () => {
    try {
      await authApi.preAuthHandshake();
    } catch (err: any) {
      console.error("Handshake failed", err);
    }
  },

  login: async (data: LoginInputs) => {
    set({ isLoading: true, error: null });
    try {
      await authApi.login(data);
      set({ step: 'otp', username:data.username, isLoading: false });
    } catch (err: any) {
      
      set({ error: err.response?.data?.message || "Login failed", isLoading: false });
      
    }
  },

  verifyOtp: async (otpCode: string) => {
    set({ isLoading: true, error: null });
    try {
      const username = get().username;
      const payload: OtpInputs = { username, otp: otpCode };
      await authApi.validateOtp(payload);
      set({ step: 'success', isLoading: false });
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || "Invalid OTP", 
        isLoading: false 
      });
    }
  },
}));