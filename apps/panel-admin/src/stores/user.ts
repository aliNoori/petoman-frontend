import {defineStore} from 'pinia'
import {axiosKey} from "../plugins/axiosPlugins";
import {inject, ref} from "vue";
import type {AxiosInstance} from "axios";
import {toJalaliDate} from "../utils/date";
import {PostForm} from "./post";

export interface User {
    id: number
    name: string
    fullName: string
    username: string
    password:string
    isActive: boolean
    email: string
    phoneNumber: string
    roles:[]
    role: string
    location: string
    avatar?: string | File | null
    createdAt: string
    lastLogin:string
    updatedAt: string
}
export interface UserForm {
    name: string
    username: string
    isActive: boolean
    email: string
    phone: string
    roles:[]
    avatar?: string | File | null
}

export const useUserStore = defineStore('userStore', () => {
    const user = ref<User>({} as User)
    const users = ref<User[]>([])
    const supporters = ref<SupporterWithDonations[]>([])
    const donations = ref<Donation[]>([])
    const fetched = ref(false)

    const axios = inject<AxiosInstance>(axiosKey)
    if (!axios) throw new Error('Axios instance not injected')

    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/users/me')

            user.value = data

            fetched.value = true
        } catch (error) {
            fetched.value = true
            console.error('❌ خطا در دریافت کاربر:', error)
        }
    }
    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData()
        formData.append('file', file)

        const { data } = await axios.post('/v1/uploads/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })

        return data.url
    }
    async function resolveAvatar(avatar?: string | File | null): Promise<string | null> {
        if (!avatar) return null

        if (typeof avatar === 'string' && avatar.startsWith('data:image')) {
            const blob = await fetch(avatar).then(r => r.blob())
            const file = new File([blob], 'post-image.png', { type: blob.type })
            return await uploadImage(file)
        }

        if (avatar instanceof File) {
            return await uploadImage(avatar)
        }

        return avatar as string
    }

    const addUser = async (newUser: Partial<User>) => {

        try {

            const avatarUrl = await resolveAvatar(newUser.avatar ?? null)

            const payload={
                fullName: newUser.fullName,
                username: newUser.username,
                isActive: newUser.isActive,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
                roles:newUser.roles,
                avatar: avatarUrl,
                password:newUser.password
            }


            const { data } = await axios.post('/users', payload)

            return data
        } catch (error) {
            console.error('❌ خطا در اضافه کردن کاربر:', error)
        }
    }

    const updateUser = async (id: string | number, updatedData: Partial<User>) => {
        try {
            const avatarUrl = await resolveAvatar(updatedData.avatar ?? null)
            const payload={
                fullName: updatedData.fullName,
                username: updatedData.username,
                isActive: updatedData.isActive,
                email: updatedData.email,
                phoneNumber: updatedData.phoneNumber,
                roles:updatedData.roles,
                avatar: avatarUrl,
            }
            const { data } = await axios.patch(`/users/${id}`, payload)
            const index = users.value.findIndex(u => u.id === id)
            if (index !== -1) {
                const rolesArray = Array.isArray(data.roles) ? data.roles : []
                let role = 'user'
                if (rolesArray.includes('admin')) role = 'admin'
                else if (rolesArray.includes('user')) role = 'user'

                users.value[index] = {
                    ...data,
                    role,
                    lastLogin: data.lastSeen || new Date().toISOString()
                }
            }
            return data
        } catch (error) {
            console.error('❌ خطا در ویرایش کاربر:', error)
        }
    }
    const toggleUserStatus = async (user: User) => {
        try {
            const newStatus = !user.isActive
            const { data } = await axios.patch(`/users/${user.id}/status`, { isActive: newStatus })
            const index = users.value.findIndex(u => u.id === user.id)
            if (index !== -1) {
                users.value[index].isActive = data.isActive
            }
            return data.isActive
        } catch (error) {
            console.error('❌ خطا در تغییر وضعیت کاربر:', error)
        }
    }
    // ✅ فعال کردن دسته‌ای از کاربران
    const bulkActivate = async (userIds: string[]) => {

        for (const id of userIds) {
            const user=users.value.find((u:User)=>String(u.id)===id) as User
            await toggleUserStatus(user);
            user.isActive = true;
        }
    };

    // ✅ غیرفعال کردن دسته‌ای از کاربران
    const bulkDeactivate = async (userIds: string[]) => {
        for (const id of userIds) {
            const user=users.value.find((u:User)=>String(u.id)===id) as User
            await toggleUserStatus(user);
            user.isActive = false;
        }
    };

    const deleteUser = async (id: string | number) => {
        try {
            await axios.delete(`/users/${id}`)
            users.value = users.value.filter(u => u.id !== id)
        } catch (error) {
            console.error('❌ خطا در حذف کاربر:', error)
        }
    }

    const fetchAllUsers = async () => {
        try {
            const { data } = await axios.get('/users')
            users.value = data
        } catch (error) {
            console.error('❌ خطا در دریافت لیست کاربران:', error)
        }
    }

    return {
        user,
        users,
        supporters,
        donations,
        fetched,
        fetchUser,
        fetchAllUsers,
        addUser,
        updateUser,
        toggleUserStatus,
        bulkActivate,
        bulkDeactivate,
        deleteUser,
        fetchSupportersWithDonations,
        removeDonation
    }
})
