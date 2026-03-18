import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../../store/useAuthStore';
import { loginSchema, type LoginInputs } from '../../types/userAuthType';
import { AuthLayout } from '../../shared/components/authlayout';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInputs) => {
    await login(data);
   
    navigate('/verify-otp');
  };

  return (
    <AuthLayout subtitle="Welcome to Nest App">
      {error && <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <input {...register("username")} placeholder="Username" className="w-full p-3.5 border rounded-xl" />
        <input {...register("password")} type="password" placeholder="Password" className="w-full p-3.5 border rounded-xl" />
        <button disabled={isLoading} className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold">
          {isLoading ? "Verifying..." : "Login"}
        </button>
        <div className="flex justify-between text-sm">
          <button type="button" onClick={() => navigate('/forgot-userid')} className="text-blue-600">Forgot ID?</button>
          <button type="button" onClick={() => navigate('/forgot-password')} className="text-blue-600">Forgot Password?</button>
        </div>
      </form>
    </AuthLayout>
  );
};