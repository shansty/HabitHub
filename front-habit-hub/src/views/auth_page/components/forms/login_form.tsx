import React, { useState } from 'react'
import InputField from '../../../../common_components/input_field'
import { Link, useNavigate } from 'react-router-dom'
import { User } from '../../../../types'
import { useLoginMutation } from '../../../../services/auth'
import { setToken } from '../../../../utils'
import ErrorHandling from '../../../../common_components/error_handling'

const LoginForm: React.FC = () => {
    const defaultUserDataValue: User = { username: '', password: '' }
    const [userData, setUserData] = useState<User>(defaultUserDataValue)
    const [loginUser, { isLoading }] = useLoginMutation()
    const [customError, setCustomError] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const { id, value } = e.target
        setUserData((prevUser) => ({
            ...prevUser,
            [id]: value,
        }))
        setCustomError(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await loginUser(userData).unwrap()
            const token = response.token
            setToken(token)
            navigate('/profile')
        } catch (err: any) {
            setCustomError(err?.data?.message)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-100">
            <div className="bg-white p-8 shadow-xl max-w-md w-full text-center">
                <h2 className="text-3xl font-bold mb-6 text-indigo-700">
                    Log In to HabitHub
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <InputField
                        value={userData.username}
                        handleOnChange={handleOnChange}
                        placeholder="Enter your username"
                        id="username"
                        type="text"
                    />

                    <InputField
                        value={userData.password}
                        handleOnChange={handleOnChange}
                        placeholder="Enter your password"
                        id="password"
                        type="password"
                    />
                    <button
                        type="submit"
                        className="w-full bg-indigo-700 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition"
                    >
                        Log In
                    </button>
                </form>
                <ErrorHandling customError={customError} />
                {isLoading && <p>Logging in...</p>}
                <p className="mt-4 text-sm text-gray-800">
                    Forgot the password?{' '}
                    <Link
                        to="/reset_password"
                        className="text-indigo-600 font-medium hover:underline"
                    >
                        Reset
                    </Link>
                </p>
                <p className="mt-4 text-sm text-gray-800">
                    Don't have an account?{' '}
                    <Link
                        to="/sign_up"
                        className="text-indigo-600 font-medium hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default LoginForm
