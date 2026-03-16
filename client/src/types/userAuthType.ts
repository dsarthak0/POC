import { z } from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" }) // Fixed
    .regex(passwordRegex, { 
      message: "Include uppercase, number, and special character" 
    }), 
})
.refine((data) => !data.password.toLowerCase().includes(data.username.toLowerCase()), {
  message: "Password cannot contain your Username",
  path: ["password"],
});

export const otpSchema = z.object({
  username: z.string().min(1,{ message: "Username is required" }), // Fixed
  otp: z.string().length(4, { message: "OTP must be 4 digits" }), // Fixed
});

export type LoginInputs = z.infer<typeof loginSchema>;
export type OtpInputs = z.infer<typeof otpSchema>;