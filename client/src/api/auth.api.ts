import api from './axios'
import type{ LoginInputs,OtpInputs } from '../types/userAuthType';

const devicepublickey=import.meta.env.VITE_DEVICE_PUBLIC_KEY;
export const authApi={
    //1 Handshake
    preAuthHandshake:async()=>{
        const response=await api.post('/v1/api/auth/pre-auth-handshake',{devicepublickey});
        return response.data;
    },

    //2 login
    login:async(data:LoginInputs)=>{
        const response=await api.post('/v1/api/auth/login',data);
        return response.data;
    },

    //3 otp
    validateOtp:async(data:OtpInputs)=>{
        const response=await api.post('/v2/api/auth/validate-otp',data);
        return response.data;
    },

    //4 forgotuserid
    forgotUserId: async (data:{ panNumber: string; emailId: string }) => {
    return api.post('/v1/api/auth/forgot-user-id',{
        ...data,
        timestamp: Date.now()

    }
     
    );
  },
  //5 forgot password

  forgotPassword: async (data: { panNumber: string; username: string }) => {
    return api.post('/v1/api/auth/forgot-password', {
        ...data ,
      timestamp: Date.now()
    });

   
},
 //6 Unblock User
    unblockUser: async (data: { panNumber: string; username: string }) => {
    return await api.post('/v1/api/auth/unblock-user', data);
  },
  //7 Authenticate otp
authenticateOtp: async (data: { otp: number; username: string; isUserBlocked: boolean }) => {
    return await api.post('/v1/api/auth/authenticate-otp', data);
  },}