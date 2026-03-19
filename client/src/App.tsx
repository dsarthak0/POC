import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from "./pages/login/Login";
import { OtpPage } from './pages/login/otp'
import { ForgotUserId } from './pages/login/forgetuserid'
import { ForgotPassword } from './pages/login/forgetpassword'
import { Dashboard } from './pages/dashboard';
import { SetPassword } from './pages/login/setpassword';
import { UnblockUser } from './pages/login/unblockuser';
function App() {

  return (
    
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/verify-otp" element={<OtpPage />} />
        <Route path="/forgot-userid" element={<ForgotUserId />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/set-password" element={<SetPassword/>}/>
        <Route path="/unblock-user" element={<UnblockUser/>}/>

    </Routes>

    </BrowserRouter>

      
    
  )
}

export default App
