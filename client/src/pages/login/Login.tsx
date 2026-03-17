import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../../store/useAuthStore';
import { loginSchema, type LoginInputs } from '../../types/userAuthType';
import background from '../../assets/background.svg';
import logo from '../../assets/logo.svg';

export const LoginPage = () => {
  const { step, login, verifyOtp, isLoading, error, performHandshake } = useAuthStore();

  useEffect(() => {
    performHandshake();
  }, [performHandshake]);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  });

  if (step === 'success') return (
    <div className="min-h-screen flex items-center justify-center font-bold text-xl bg-white">
      Welcome to Dashboard...
    </div>
  );

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white">
      
      {/* LEFT SIDE: Inset top/bottom/left, FLUSH on the right */}
      <div className="w-full h-[40vh] lg:h-screen lg:w-1/2 lg:py-6 lg:pl-6 bg-white"> 
        <div className="relative w-full h-full overflow-hidden lg:rounded-l-3xl shadow-sm">
          <img 
            src={background} 
            alt="Background" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-black/5 lg:bg-transparent" />
        </div>
      </div>

      {/* RIGHT SIDE: Content Area - Aligned vertically with the image */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-20 lg:py-6 bg-white">
        <div className="max-w-md w-full">
          
          {/* LOGO & HEADER SECTION */}
          <div className="flex flex-col items-center mb-10">
            <img 
              src={logo}
              alt="Logo" 
              className="h-12 w-auto mb-6" 
            />
            <p className="text-gray-600 font-semibold mt-2 text-center">
              {step === 'login' 
                ? 'Welcome to Nest App' 
                : 'Confirm the 4-digit code sent to your device.'}
            </p>
          </div>

          {/* GLOBAL ERROR MESSAGE */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg text-center animate-pulse">
              {error}
            </div>
          )}

          {/* CONDITIONAL FORM RENDERING */}
          {step === 'login' ? (
            <form onSubmit={handleSubmit(login)} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Username</label>
                <input 
                  {...register("username")} 
                  placeholder="Enter Your Username" 
                  className={`w-full p-3.5 border rounded-xl outline-none transition-all focus:ring-4 focus:ring-blue-500/10 ${errors.username ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
                />
                {errors.username && <span className="text-xs text-red-500">{errors.username.message}</span>}
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <input 
                  {...register("password")} 
                  type="password" 
                  placeholder="••••••••" 
                  className={`w-full p-3.5 border rounded-xl outline-none transition-all focus:ring-4 focus:ring-blue-500/10 ${errors.password ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
                />
                {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
              </div>

              <button 
                disabled={isLoading}
                className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-lg active:scale-[0.98]"
              >
                {isLoading ? "Verifying..." : "Login"}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <input 
                  type="text" 
                  placeholder="0000"
                  maxLength={4}
                  autoFocus
                  onChange={(e) => e.target.value.length === 4 && verifyOtp(e.target.value)}
                  className="w-full p-4 text-center text-4xl font-black tracking-[1.5rem] border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-gray-50"
                />
              </div>
              <p className="text-center text-gray-500 text-sm">
                Didn't receive a code? <button className="text-blue-600 font-bold hover:underline">Resend</button>
              </p>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}