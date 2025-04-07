import React, { useState } from 'react';
import InputField from '../utils_components/InputField';
import PasswordField from '../utils_components/PasswordField';
import { Link } from 'react-router-dom';
import { TypeUser } from '../../../types';
import { useRegisterUserMutation } from '../../../services/user';
import Dropzone from '../utils_components/Dropzone';
import Modal from '../utils_components/Modal';

const SignUpForm: React.FC = () => {

    const defaultUserDataValue: TypeUser = { username: "", password: "", email: "" }
    const [userData, setUserData] = useState<TypeUser>(defaultUserDataValue);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [registerUser, { error, isLoading }] = useRegisterUserMutation()


    const handlePhotoDrop = (file: File) => {
        setUserData((prev) => ({ ...prev, profile_picture: file }));
    };

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { id, value } = e.target;
        setUserData((prevUser) => ({
            ...prevUser,
            [id]: value,
        }));
    };

    const handleOnModalClose = () => {
        setIsModalOpen(false)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', userData.username);
        formData.append('email', userData.email as string);
        formData.append('password', userData.password as string);
        if (userData.profile_picture) {
            formData.append('profile_picture', userData.profile_picture);
        }
        const res = await registerUser(formData).unwrap();
        if (res.emailSent) {
            setIsModalOpen(true)
        };
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-100">
            <div className="bg-white p-8 shadow-xl max-w-md w-full text-center">
                <h2 className="text-3xl font-bold mb-6 text-indigo-700">Sign Up to HabitHub</h2>
                {isModalOpen &&
                    <Modal
                        isOpen={true}
                        message='Check your email to verify your account'
                        title='Registration almost done!'
                        onClose={handleOnModalClose}
                    />}
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <Dropzone
                        onFileAccepted={handlePhotoDrop}
                        previewUrl={userData.profile_picture ? URL.createObjectURL(userData.profile_picture as File) : undefined}
                    />
                    <InputField
                        value={userData.username}
                        handleOnChange={handleOnChange}
                        placeholder='Enter your username'
                        id='username'
                        type='text'
                    />

                    <InputField
                        value={userData.email}
                        handleOnChange={handleOnChange}
                        placeholder='Enter your email'
                        id='email'
                        type='email'
                    />

                    <PasswordField
                        value={userData.password as string}
                        onChange={handleOnChange}
                        id="password"
                        placeholder="Enter your password"
                        setIsPasswordValid={setIsPasswordValid}
                    />

                    <button
                        disabled={!isPasswordValid}
                        type="submit"
                        className="w-full bg-indigo-700 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition"
                    >
                        Sign Up
                    </button>
                </form>
                {isLoading && <p>Please wait...</p>}
                {error && 'data' in error && (
                    <p className="text-red-600 text-sm text-center mt-1">
                        {(error.data as any)?.message || 'Something went wrong. Please try again.'}
                    </p>
                )}
                <p className="mt-4 text-sm text-gray-800">
                    Already have an account?{' '}
                    <Link to='/login' className="text-indigo-600 font-medium hover:underline">Log In</Link>
                </p>
            </div>
        </div>
    );
};


export default SignUpForm;
