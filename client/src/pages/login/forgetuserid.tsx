import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { AuthLayout } from '../../shared/components/authlayout';

export const ForgotUserId = () => {
  const navigate = useNavigate();
  const { forgotUserId, isLoading } = useAuthStore();

  const handleAction = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    await forgotUserId({ 
      panNumber: data.get('panNumber') as string, 
      emailId: data.get('emailId') as string 
    });
    navigate('/login');
  };

  return (
    <AuthLayout subtitle="Retrieve your User ID">
       <form onSubmit={handleAction} className="space-y-5">
         <input name="panNumber" required placeholder="PAN Number" className="w-full p-3.5 border rounded-xl" />
         <input name="emailId" type="email" required placeholder="Email ID" className="w-full p-3.5 border rounded-xl" />
         <button disabled={isLoading} className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold">Proceed</button>
         <button type="button" onClick={() => navigate('/login')} className="w-full text-gray-500">Back</button>
       </form>
    </AuthLayout>
  );
};