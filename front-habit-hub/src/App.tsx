import HomePage from './views/homePage/HomePage'
import LoginForm from './views/authPage/forms/LoginForm';
import SignUpForm from './views/authPage/forms/SignUpForm';
import VerifyEmailPage from './views/authPage/VerifyEmailPage';
import ResetPasswordForm from './views/authPage/forms/ResetPasswordForm';
import ResetPasswordConfirmForm from './views/authPage/forms/ResetPasswordConfirmForm';
import { Route, BrowserRouter, Routes } from 'react-router-dom';


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginForm />} />
        <Route path='/sign_up' element={<SignUpForm />} />
        <Route path='/verify-email' element={<VerifyEmailPage />} />
        <Route path='/reset_password' element={<ResetPasswordForm />} />
        <Route path='/confirm_reset_password' element={<ResetPasswordConfirmForm />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
