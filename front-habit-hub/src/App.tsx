import HomePage from './views/homePage/home_page'
import LoginForm from './views/authPage/forms/login_form'
import SignUpForm from './views/authPage/forms/sign_up_form'
import VerifyEmailPage from './views/authPage/verify_email_page'
import ResetPasswordForm from './views/authPage/forms/reset_password_form'
import ResetPasswordConfirmForm from './views/authPage/forms/reset_password_confirm_form'
import UserProfilePage from './views/profilePage/profile_page'
import HabitPage from './views/habitPage/habit_page'
import { Route, BrowserRouter, Routes } from 'react-router-dom'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/sign_up" element={<SignUpForm />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/reset_password" element={<ResetPasswordForm />} />
                <Route
                    path="/confirm_reset_password"
                    element={<ResetPasswordConfirmForm />}
                />
                <Route path="/profile" element={<UserProfilePage />} />
                <Route path="/habits/:id" element={<HabitPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
