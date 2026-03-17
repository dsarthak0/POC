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
  otp: z.number().int() // Ensures no decimals
  .min(1000, { message: "OTP must be at least 4 digits" })
  .max(9999, { message: "OTP cannot exceed 4 digits" }), 
});

export type LoginInputs = z.infer<typeof loginSchema>;
export type OtpInputs = z.infer<typeof otpSchema>;