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
}