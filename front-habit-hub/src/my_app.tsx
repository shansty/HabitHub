import FriendProfilePage from './views/friend_profile_page/friend_profile_page'
import HomePage from './views/home_page/home_page'
import LoginForm from './views/auth_page/components/forms/login_form'
import SignUpForm from './views/auth_page/components/forms/sign_up_form'
import VerifyEmailPage from './views/auth_page/verify_email_page'
import ResetPasswordForm from './views/auth_page/components/forms/reset_password_form'
import ResetPasswordConfirmForm from './views/auth_page/components/forms/reset_password_confirm_form'
import UserProfilePage from './views/profile_page/profile_page'
import HabitPage from './views/habit_page/habit_page'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import FriendHabitPage from './views/friend_habit_page/friend_habit_page'

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
                <Route path="/friend/:friendId" element={<FriendProfilePage />} />
                <Route path="/friend/:friendId/habits/:habitId" element={<FriendHabitPage />} />
                <Route path="/habits/:id" element={<HabitPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
