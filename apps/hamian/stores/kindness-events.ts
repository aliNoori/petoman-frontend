// src/stores/kindnessMeetingStore.ts
import { defineStore } from 'pinia'
import {computed, ref} from 'vue'
import { useRouter } from 'vue-router'
import type { AxiosInstance } from 'axios'
import {useNuxtApp} from "#app";
import {toJalaliDate } from '../utils/date'


export type HelpType = 'financial' | 'volunteer'

export interface KindnessEvent {
    id?: string
    type: 'financial' | 'volunteer'
    title: string
    description: string
    goal?: number
    current?: number
    location?: string
    eventDate?: string
    eventTime?: string
    manager: string
    startDate: string
    startTime: string
    endDate: string
    endTime: string
    duration?: string
    status: 'active' | 'inactive'
    category?: string
    image?: File | null
    showTimer: boolean
    timerType: 'countdown' | 'fixed'
    timerAlert: boolean
    alertDays?: string
    showOnHomepage: boolean
}

export interface KindnessMeetingRegistration {
    id: string
    fullName: string
    mobile: string
    helpType: HelpType
    amount?: number
    message?: string

    kindnessMeetingId: string
    meetingTitle?: string

    createdAt: Date
}

export const useKindnessEventsStore = defineStore('kindnessEventsStore', () => {
    const kindnessEvents = ref<KindnessEvent[]>([])
    const kindnessEvent = ref<KindnessEvent | null>(null)
    const registrations = ref<KindnessMeetingRegistration[]>([])
    const selectedMeeting = ref<KindnessEvent | null>(null)
    const fetched = ref(false)
    const loading = ref(false)

    const router = useRouter()
    const { $axios } = useNuxtApp()
    const axios = $axios as AxiosInstance

    const fetchKindnessEvents = async () => {
        loading.value = true
        try {
            const { data } = await axios.get('/v1/kindness-meetings')
            kindnessEvents.value = data.map((item:any) => {

                // مجموع مبلغ کمک‌ها
                const totalAmount = Array.isArray(item.donations)
                    ? item.donations.reduce((sum: number, d: { amount: any }) => sum + Number(d.amount || 0), 0)
                    : 0

                // محاسبه درصد پیشرفت
                const progress = item.goal
                    ? Math.min(Math.round((totalAmount / Number(item.goal)) * 100), 100)
                    : 0

                return {
                    ...item,
                    category:item.category?.title??'',
                    donations: item.donations,
                    supporters: item.donations.length,
                    progress,            // ← اینجا اضافه شد
                    current:totalAmount,         // ← اگر خواستی بعداً هم استفاده کنی
                    startDate: item.startDate ? item.startDate : null,
                    endDate: item.endDate ? item.endDate : null,
                    eventDate: item.eventDate ? item.eventDate : null,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt
                }
            })
            fetched.value = true
        } catch (error) {
            console.error('❌ خطا در دریافت لیست قرارهای مهربانی:', error)
        } finally {
            loading.value = false
        }
    }

    const fetchKindnessEvent = async (id: string) => {
        loading.value = true
        try {
            const { data } = await axios.get(`/v1/kindness-meetings/${id}`)
            kindnessEvent.value = data.map((item:any) => ({
                ...item,
                _createdAtRaw: item.createdAt,
                startDate: item.startDate ? toJalaliDate(item.startDate): null,
                endDate: item.endDate ? toJalaliDate(item.endDate): null,
                eventDate: item.eventDate ? toJalaliDate(item.eventDate): null,
                createdAt: toJalaliDate(item.createdAt),
                updatedAt: toJalaliDate(item.updatedAt)
            }))
        } catch (error) {
            console.error('❌ خطا در دریافت قرار مهربانی:', error)
        } finally {
            loading.value = false
        }
    }

    // =====================================================================
    // ➕ ثبت‌نام جدید (کاربر)
    // POST /v1/kindness-meetings/:id/registrations
    // =====================================================================
    const createKindnessMeetingRegistration = async (
        meetingId: string,
        payload: {
            fullName: string
            phone: string
            helpType: HelpType
            amount?: number
            message?: string
        }
    ) => {
        try {
            const { data } = await axios.post(
                `kindness-meetings-registrations/${meetingId}/registrations`,
                payload
            )

            console.log('✅ ثبت‌نام با موفقیت انجام شد')
            return data
        } catch (error) {
            console.error('❌ خطا در ثبت‌نام:', error)
            throw error
        }
    }

    const fetchKindnessRegistrations = async (
        meetingId: string,
        filters?: { helpType?: HelpType }
    ) => {
        try {
            const { data } = await axios.get(
                `v1/kindness-meetings/${meetingId}/registrations`,
                { params: filters }
            )

            registrations.value = data
            fetched.value = true
        } catch (error) {
            console.error('❌ خطا در دریافت ثبت‌نام‌ها:', error)
        }
    }


    return {
        kindnessEvents,
        kindnessEvent,
        selectedMeeting,
        registrations,
        fetched,
        loading,

        fetchKindnessEvents,
        fetchKindnessEvent,
        createKindnessMeetingRegistration,
        fetchKindnessRegistrations
    }
})