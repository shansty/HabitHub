export type TypeUser = {
    username: string,
    password?: string,
    email?: string,
    profile_picture?: File | string | undefined
}

export type TypeUserProfile = {
    username?: string,
    profile_picture?: File | string | undefined
}

export type TypeResetPasswordCredentials = {
    email: string,
    new_password: string,
    confirm_password: string,
}

