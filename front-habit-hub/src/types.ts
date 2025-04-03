export type TypeUser = {
    username: string,
    password?: string,
    email?: string,
    profile_picture?: File | string
}

export type TypeResetPasswordCredentials = {
    email: string,
    new_password: string,
    confirm_password: string,
}

