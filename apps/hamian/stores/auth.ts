import { defineStore } from "pinia"
import { safeStorage } from "~/utils/safeStorage"
import {useNuxtApp} from "#app";
import type {AxiosInstance} from "axios";
import {useUploader} from "~/composables/useUploader";
import {ref, computed, readonly} from "vue";

export interface User {
  id: string
  firstName: string
  lastName: string
  phoneNumber:string
  email: string
  avatar?: string
  posts:number
  role: string
  createdAt: string
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === "admin")
  const isModerator = computed(() =>
      ["admin", "moderator"].includes(user.value?.role || "")
  )
  const { $axios } = useNuxtApp()
  const axios = $axios as AxiosInstance

  const setToken = (newToken: string) => {
    token.value = newToken
    safeStorage.setItem("auth_token", newToken)
  }

  const fetchUser = async () => {

    if (!token.value) return
    loading.value = true
    try {
      console.log("axios instance:", axios)

      const res = await axios.get("/v1/auth/me", {
        headers: { Authorization: `Bearer ${token.value}` },
      })
      user.value = res.data
      safeStorage.setItem("auth_user", JSON.stringify(res.data))
    } catch (err) {
      console.error("Failed to fetch user:", err)
      logout()
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (id: string, payload: User, avatarFile?: File) => {
    const uploader = useUploader()
    let avatarUrl: string | undefined

    // اگر فایل جدیدی انتخاب شده بود، آپلود کن
    if (avatarFile) {
      avatarUrl = await uploader.upload(avatarFile, '/v1/uploads/image')
    }

    // فقط فیلدهای قابل ویرایش
    const updatedPayload = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      avatar: avatarUrl || payload.avatar
    }

    const res = await axios.patch(`/users/${id}`, updatedPayload, {
      headers: { Authorization: `Bearer ${token.value}` }
    })

    user.value = res.data
    safeStorage.setItem("auth_user", JSON.stringify(res.data))
  }

  const logout = () => {
    user.value = null
    token.value = null
    safeStorage.removeItem("auth_token")
    safeStorage.removeItem("auth_user")
  }

  const hydrateToken = () => {
    const savedToken = safeStorage.getItem("auth_token")
    if (savedToken) {
      token.value = savedToken
      //fetchUser()
    }
  }

  return {
    user: readonly(user),
    token: readonly(token),
    loading: readonly(loading),
    isAuthenticated,
    isAdmin,
    isModerator,
    setToken,
    fetchUser,
    updateProfile,
    logout,
    hydrateToken,
  }
})