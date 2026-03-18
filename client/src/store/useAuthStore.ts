import { create } from 'zustand';
import { authApi } from '../api/auth.api';
import type { LoginInputs, OtpInputs } from '../types/userAuthType'

interface AuthState {
  step: 'login' | 'otp' | 'success'| 'forgot-userid' | 'forgot-password';
  isLoading: boolean;
  error: string | null;
  username: string; 
  
  
  // Actions
  performHandshake: () => Promise<void>;
  login: (data: LoginInputs) => Promise<void>;
  verifyOtp: (otpCode: string) => Promise<void>;
  resetError: () => void;

  setStep: (step: AuthState['step']) => void;
  forgotUserId: (data: { panNumber: string; emailId: string }) => Promise<void>;
  forgotPassword: (data: { panNumber: string; username: string }) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  step: 'login',
  username: '',
  isLoading: false,
  error: null,
  setStep:(step)=>set({step,error:null}),


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
      set({ step: 'otp', username: data.username, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Login failed", isLoading: false });
    }
  },

  verifyOtp: async (otpCode: string) => {
    set({ isLoading: true, error: null });
    try {
      const username = get().username;
      const payload: OtpInputs = { 
        username, 
        otp: parseInt(otpCode, 10) 
      };

      await authApi.validateOtp(payload);
      set({ step: 'success', isLoading: false });
    } catch (err: any) {
      set({ 
        error: err.response?.data?.errors?.[0]?.errorMessage || 
               err.response?.data?.message || 
               "Invalid OTP", 
        isLoading: false 
      });
    }
  },

  // NEW: Forgot User ID Implementation
  forgotUserId: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await authApi.forgotUserId(payload); // Ensure this exists in your authApi
      alert("User ID request sent successfully!");
      set({step:'login'});
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || "Failed to request User ID", 
        isLoading: false 
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // NEW: Forgot Password Implementation
  forgotPassword: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await authApi.forgotPassword(payload); // Ensure this exists in your authApi
      alert("Password reset request sent successfully!");
      set({step:'login'});
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || "Failed to request password reset", 
        isLoading: false 
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));