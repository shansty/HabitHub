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

export type TypeHabit = {
    name: string;
    category: string;
}

export type TypeHabitWithProgress = {
    id: number,
    name: string;
    category: string;
    progress: number
}

export type TypeCategory = {
    name: string,
    icon: string
}
