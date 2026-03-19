import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { AuthLayout } from '../../shared/components/authlayout';

export const UnblockUser = () => {
  const navigate = useNavigate();
  const { unblockUser, isLoading, error } = useAuthStore();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      panNumber: formData.get('panNumber') as string,
      username: formData.get('username') as string,
    };

    try {
      await unblockUser(payload);
      navigate('/verify-otp'); // Go to OTP after unblock-user API success
    } catch (err:any) { if (err.response?.status === 409) {
      navigate('/verify-otp'); }
  };}

  return (
    <AuthLayout subtitle="Verify identity to unblock account">
      {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <input name="panNumber" placeholder="PAN Number" required className="w-full p-3 border rounded-xl" />
        <input name="username" placeholder="Username" required className="w-full p-3 border rounded-xl" />
        <button disabled={isLoading} className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold">
          {isLoading ? "Processing..." : "Submit"}
        </button>
      </form>
    </AuthLayout>
  );
};