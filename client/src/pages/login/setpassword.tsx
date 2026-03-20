import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import { useAuthStore } from '../../store/useAuthStore';
import { AuthLayout } from '../../shared/components/authlayout';
import { resetPasswordSchema, type ResetPasswordInputs } from '../../types/userAuthType';

export const SetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setPassword, isLoading, error } = useAuthStore();
  
  // Get username passed from the ForgotPassword or OTP initial screen
  const username = location.state?.username || "AMITH1"; 

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordInputs>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInputs) => {
    try {
      // 1. Call Set Password API
      // Payload: {"username":"AMITH1","password":"Abc@12345"}
      await setPassword({
        username: username,
        password: data.password
      });

      // 2. If successful, navigate to OTP page
      // We pass the username and password in state so the OTP page can use them
      navigate('/verify-otp', { 
        state: { 
          username: username,
          tempPassword: data.password // Useful if authenticate-otp needs context
        } 
      }); 

    } catch (err) {
      console.error("Failed to set password", err);
    }
  };

  return (
    <AuthLayout subtitle="Set Your new account password">
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1">
          <label className="text-sm font-semibold">New Password</label>
          <input 
            {...register("password")} 
            type="password" 
            placeholder="Min 10 chars, 1 digit, 1 special"
            className={`w-full p-3.5 border rounded-xl outline-none focus:border-blue-500 transition-all ${
              errors.password ? 'border-red-500' : 'border-gray-200'
            }`} 
          />
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold">Confirm Password</label>
          <input 
            {...register("confirmPassword")} 
            type="password" 
            placeholder="Re-enter password"
            className={`w-full p-3.5 border rounded-xl outline-none focus:border-blue-500 transition-all ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
            }`} 
          />
          {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <button 
          type="submit"
          disabled={isLoading} 
          className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-400 transition-all shadow-md active:scale-[0.98]"
        >
          {isLoading ? "Updating..." : "Reset Password"}
        </button>
      </form>
    </AuthLayout>
  );
};