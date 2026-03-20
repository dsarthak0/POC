import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../../store/useAuthStore';
import { loginSchema, type LoginInputs } from '../../types/userAuthType';
import { AuthLayout } from '../../shared/components/authlayout';
import { useEffect } from 'react';

export const LoginPage = () => {
  const navigate = useNavigate();

  const { login, isLoading, error, loginAttempts, isUserBlocked } = useAuthStore();
  console.log("loginAttempts:", loginAttempts);
  console.log("isUserBlocked:", isUserBlocked);

  useEffect(()=>{
    const init=async()=>{
      await useAuthStore.getState().performHandshake();
    };init();
  },[])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInputs) => {
    await login(data);

    const state = useAuthStore.getState();

    if (!state.error && !state.isUserBlocked) {
      navigate('/verify-otp');
    }
  };

  return (
    <AuthLayout subtitle="Welcome to Nest App">
      
      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center border border-red-100">
          {error}
        </div>
      )}

      
      {error === "USER_LOCKED" && (
  <button
    type="button"
    onClick={() => navigate('/unblock-user')}
    className="w-full mb-4 p-3 bg-red-100 text-red-700 font-bold rounded-xl"
  >
    Unblock Account
  </button>
)}

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        <div className="space-y-1">
          <input
            {...register('username')}
            placeholder="Username"
            className={`w-full p-3.5 border rounded-xl ${
              errors.username ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {errors.username && (
            <p className="text-xs text-red-500">{errors.username.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <input
            {...register('password')}
            type="password"
            placeholder="Password"
            className={`w-full p-3.5 border rounded-xl ${
              errors.password ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <button
          disabled={isLoading || isUserBlocked}
          className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Verifying...' : 'Login'}
        </button>

        <div className="flex justify-between text-sm pt-2">
          <button
            type="button"
            onClick={() => navigate('/forgot-userid')}
            className="text-blue-600 hover:underline"
          >
            Forgot ID?
          </button>

          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-blue-600 hover:underline"
          >
            Forgot Password?
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};