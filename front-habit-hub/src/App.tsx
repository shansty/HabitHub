import HomePage from './views/homePage/HomePage'
import LoginForm from './views/authPage/LoginForm';
import SignUpForm from './views/authPage/SignUpForm';
import VerifyEmailPage from './views/authPage/VerifyEmailPage';
import { Route, BrowserRouter, Routes } from 'react-router-dom';


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginForm />} />
        <Route path='/sign_up' element={<SignUpForm />} />
        <Route path='/verify-email' element={<VerifyEmailPage />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
