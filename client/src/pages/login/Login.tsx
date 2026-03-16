import {useEffect} from 'react';

import {useForm} from 'react-hook-form'

import {zodResolver} from '@hookform/resolvers/zod';
import { useAuthStore } from '../../store/useAuthStore';
import { loginSchema, type LoginInputs } from '../../types/userAuthType'

export const LoginPage=()=>{
    const {step,login,verifyOtp,isLoading,error,performHandshake}=useAuthStore();

    //1.Trigger Handshake on mount
    useEffect(() => {
    performHandshake();
  }, []);

  // 2. Login Form Setup
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  });
  if (step === 'success') return <div>Welcome! Redirecting...</div>;
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {step === 'login' ? 'Login' : 'Enter OTP'}
        </h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        {step === 'login' ? (
          <form onSubmit={handleSubmit(login)} className="space-y-4">
            <input 
              {...register("username")} 
              placeholder="Username" 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.username && <span className="text-xs text-red-500">{errors.username.message}</span>}
            
            <input 
              {...register("password")} 
              type="password" 
              placeholder="Password" 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}

            <button 
              disabled={isLoading}
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {isLoading ? "Processing..." : "Continue"}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
             <input 
              type="text" 
              placeholder="4-digit code"
              maxLength={4}
              onChange={(e) => e.target.value.length === 6 && verifyOtp(e.target.value)}
              className="w-full p-4 text-center text-2xl tracking-widest border rounded-lg"
            />
            <p className="text-center text-gray-500 text-sm">We sent a code to your email</p>
          </div>
        )}
      </div>
    </div>
  );
}