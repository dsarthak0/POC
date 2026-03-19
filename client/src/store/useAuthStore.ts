import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api/auth.api';
import type { LoginInputs, OtpInputs } from '../types/userAuthType';

interface AuthState {
  purpose: 'login' | 'reset' | 'unblock' | null;
  isLoading: boolean;
  error: string | null;
  username: string;
  isUserBlocked: boolean;
  loginAttempts:number;

  performHandshake: () => Promise<void>;
  login: (data: LoginInputs) => Promise<void>;
  verifyOtp: (otpCode: string) => Promise<void>;
  resetError: () => void;
  forgotUserId: (data: { panNumber: string; emailId: string }) => Promise<void>;
  forgotPassword: (data: { panNumber: string; username: string }) => Promise<void>;
  unblockUser: (data: { panNumber: string; username: string }) => Promise<void>;
  authenticateOtp: (otpCode: string) => Promise<void>;
  setPurpose: (purpose: 'login' | 'reset' | 'unblock') => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      purpose: null,
      username: '',
      isLoading: false,
      error: null,
      isUserBlocked: false,
      loginAttempts:0,

      setPurpose: (purpose) => set({ purpose, error: null }),
      resetError: () => set({ error: null }),

      performHandshake: async () => {
        try {
          await authApi.preAuthHandshake();
        } catch (err: any) {
          console.error("Handshake failed", err);
        }
      },

      login: async (data: LoginInputs) => {
        set({ isLoading: true, error: null}); 
        try {
           await authApi.login(data);
           console.log("Login Success")
          // Success: Reset blocked status and set purpose
          set({ loginAttempts:0, purpose: 'login', username: data.username, isUserBlocked: false, isLoading: false });
        } catch (err: any) {
          const currentAttempts = get().loginAttempts + 1;
          const status = err.response?.status;
          const msg = err.response?.data?.message || "Login failed";
          
          const isBlocked = 
  status === 423 ||                    // Server says it's locked (Official)
  currentAttempts >= 3 ||              // User failed 3 times (Local)
  msg.toLowerCase().includes("blocked");

          set({ 
            error: msg, 
            isUserBlocked: isBlocked, 
            username: data.username,
            loginAttempts:currentAttempts, // Vital for the unblock flow
            isLoading: false 
          });
        }
      },

      unblockUser: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          await authApi.unblockUser(payload);
          set({ 
            purpose: 'unblock', 
            username: payload.username, 
            isLoading: false 
          });
        } catch (err: any) {
          set({ error: err.response?.data?.message || "Unblock request failed", isLoading: false });
          throw err;
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
          set({ isLoading: false });
        } catch (err: any) {
          const status = err.response?.status;
          set({ 
            error: err.response?.data?.message || "Invalid OTP", 
            isUserBlocked: status === 423, // Set blocked if OTP response is 423
            isLoading: false 
          });
          throw err;
        }
      },

      authenticateOtp: async (otpCode: string) => {
        set({ isLoading: true, error: null });
        try {
          const payload = {
            otp: parseInt(otpCode, 10),
            username: get().username,
            isUserBlocked: false
          };
          await authApi.authenticateOtp(payload);
          // Success: fully unblocked
          set({ isUserBlocked: false, isLoading: false, purpose: null, error: null });
        } catch (err: any) {
          set({ error: "Invalid OTP", isLoading: false });
          throw err;
        }
      },

      forgotUserId: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          await authApi.forgotUserId(payload);
        } catch (err: any) {
          set({ error: err.response?.data?.message || "Failed to request User ID" });
        } finally {
          set({ isLoading: false });
        }
      },

      forgotPassword: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          await authApi.forgotPassword(payload);
          set({ purpose: 'reset', username: payload.username, isLoading: false });
        } catch (err: any) {
          set({ error: err.response?.data?.message || "Failed reset request", isLoading: false });
          throw err;
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);