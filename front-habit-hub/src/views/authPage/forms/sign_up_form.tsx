import React, { useState } from 'react';
import InputField from '../../../utils_components/input_field';
import PasswordField from '../components/password_field';
import { Link } from 'react-router-dom';
import { User } from '../../../types';
import { useRegisterUserMutation } from '../../../services/user';
import Dropzone from '../../../utils_components/custom_dropzone';
import Modal from '../../../utils_components/modal_notification';
import ErrorHandling from '../../../utils_components/error_handling';

const SignUpForm: React.FC = () => {

    const defaultUserDataValue: User = { username: "", password: "", email: "" }
    const [userData, setUserData] = useState<User>(defaultUserDataValue);
    const [ , setIsPasswordValid] = useState(false);
    const [customError, setCustomError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [registerUser, { isLoading }] = useRegisterUserMutation()


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
        setCustomError(null);
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
        try {
            const res = await registerUser(formData).unwrap();
            if (res.emailSent) {
                setIsModalOpen(true)
            };
        } catch (err: any) {
            setCustomError(err?.data?.message);
        }
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
                        type="submit"
                        className="w-full bg-indigo-700 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition"
                    >
                        Sign Up
                    </button>
                </form>
                {isLoading && <p>Please wait...</p>}
                <ErrorHandling customError={customError} />
                <p className="mt-4 text-sm text-gray-800">
                    Already have an account?{' '}
                    <Link to='/login' className="text-indigo-600 font-medium hover:underline">Log In</Link>
                </p>
            </div>
        </div>
    );
};


export default SignUpForm;
