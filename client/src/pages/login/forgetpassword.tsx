import { useAuthStore } from '../../store/useAuthStore';
import { AuthLayout } from '../../shared/components/authlayout';
import { useNavigate } from 'react-router-dom';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword, isLoading, error } = useAuthStore();

  const handleFormSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const payload = {
      panNumber: formData.get('panNumber') as string,
      username: formData.get('username') as string,
    };
    try {
      await forgotPassword(payload);

      navigate('/verify-otp'); 
    } catch (err) {
      
    }
  };

   

  return (
    <AuthLayout subtitle="Reset your account password">
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">PAN Number</label>
          <input 
            name="panNumber" 
            required 
            placeholder="Enter PAN Number" 
            className="w-full p-3.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all" 
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">Username</label>
          <input 
            name="username" 
            required 
            placeholder="Enter Username" 
            className="w-full p-3.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all" 
          />
        </div>

        <button 
          disabled={isLoading}
          className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-400 transition-all shadow-lg"
        >
          {isLoading ? "Requesting..." : "Proceed"}
        </button>

        <button 
          type="button" 
          onClick={() => navigate('/login')} 
          className="w-full text-gray-500 font-semibold text-sm hover:text-gray-700"
        >
          Back to Login
        </button>
      </form>
    </AuthLayout>
  );
};