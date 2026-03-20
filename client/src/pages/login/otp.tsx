import { useAuthStore } from '../../store/useAuthStore';
import { AuthLayout } from '../../shared/components/authlayout';
import { useNavigate } from 'react-router-dom';

export const OtpPage = () => {
  const navigate = useNavigate();

  const { verifyOtp, error, purpose, authenticateOtp } = useAuthStore();

  const handleOtpChange = async (otpValue: string) => {
    if (otpValue.length !== 4) return;

    const numericOtp = parseInt(otpValue, 10);
    if (isNaN(numericOtp)) return;

    try {
      if (purpose === 'unblock') {
      
        await authenticateOtp(otpValue);


        useAuthStore.setState({
          isUserBlocked: false,
          loginAttempts: 0,
          purpose: null,
          username: '', 
          error: null,
        });

        navigate('/login');
      } else if (purpose === 'reset') {
        await authenticateOtp(otpValue);
        navigate('/login');
      } else {
        // Default: login OTP flow
        await verifyOtp(otpValue);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('OTP verification failed:', err);
    }
  };

  return (
    <AuthLayout subtitle="Confirm the 4-digit code sent to your device.">
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg text-center animate-pulse">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="flex flex-col items-center">
          <input
            type="text"
            placeholder="0000"
            maxLength={4}
            autoFocus
            onChange={(e) => handleOtpChange(e.target.value)}
            className="w-full p-4 text-center text-4xl font-black tracking-[1.5rem] border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-gray-50"
          />
        </div>

        <p className="text-center text-gray-500 text-sm">
          Didn't receive a code?{' '}
          <button className="text-blue-600 font-bold hover:underline">Resend</button>
        </p>

        <button
          type="button"
          onClick={() => navigate('/login')}
          className="w-full text-gray-500 font-semibold text-sm mt-4 hover:text-gray-700"
        >
          Back to Login
        </button>
      </div>
    </AuthLayout>
  );
};