import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { AuthLayout } from '../../shared/components/authlayout';

export const UnblockUser = () => {
  const navigate = useNavigate();
  const { unblockUser, isLoading, error } = useAuthStore();

  const handleFormSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const payload = {
      panNumber: formData.get('panNumber') as string,
      username: formData.get('username') as string,
    };

    try {
      // 1. Attempt the API call
      await unblockUser(payload);
      
      // 2. Explicitly set state for the OTP page to know we are in "unblock" mode
      useAuthStore.setState({
        purpose: 'unblock',
        username: payload.username,
        error: null,
      });

      navigate('/verify-otp'); 
    } catch (err: any) { 
      // 3. Handle 409: OTP already sent/session exists
      if (err.response?.status === 409) {
        useAuthStore.setState({
          purpose: 'unblock',
          username: payload.username,
          error: null,
        });
        navigate('/verify-otp'); 
      }
      // Other errors are handled by the store's catch block automatically
    }
  };

  return (
    <AuthLayout subtitle="Verify identity to unblock account">
      {/* Show API error if it exists */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-4">
        <input 
          name="panNumber" 
          placeholder="PAN Number" 
          required 
          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
        />
        <input 
          name="username" 
          placeholder="Username" 
          required 
          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
        />
        
        <button 
          type="submit" // Always be explicit with button types
          disabled={isLoading} 
          className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? "Processing..." : "Submit"}
        </button>

        <button 
          type="button" 
          onClick={() => navigate('/login')}
          className="w-full text-gray-500 text-sm font-medium hover:text-gray-700"
        >
          Cancel
        </button>
      </form>
    </AuthLayout>
  );
};