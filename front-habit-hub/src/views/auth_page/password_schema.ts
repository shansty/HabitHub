import * as yup from 'yup';

export const passwordSchema = yup.string()
    .required('Password is required')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Must contain at least one number')
    .matches(/[!@#$%^&*]/, 'Must contain at least one special character (!@#$%^&*)')
    .min(12, 'Password must be at least 12 characters');

export const lengthSchema = yup.string().min(12);
export const uppercaseSchema = yup.string().matches(/[A-Z]/);
export const numberSchema = yup.string().matches(/[0-9]/);
export const specialCharSchema = yup.string().matches(/[!@#$%^&*]/);