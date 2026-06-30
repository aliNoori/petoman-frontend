import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import {useRouter} from 'vue-router'
import type {AxiosInstance} from 'axios'
import {toJalaliDate, toGregorianDate} from '../utils/date'
import {useNuxtApp} from "#app";

export interface Supporter {
    name: string
    firstName: string
    lastName: string
    fullName: string
    province: string
    city: string
    type: 'financial' | 'volunteer' | 'both'
    phone: string
    email?: string
    joinDate: string
    status: 'active' | 'inactive'
    initialAmount?: number
    address?: string
    notes?: string
    experience: string
    motivation: string
    agreement: boolean,
    showInList: boolean,
    socialLinks?: {
        instagram?: string
        telegram?: string
        linkedin?: string
        twitter?: string
    }
}

export interface SupporterCase {
    id: string
    name: string
    fullName: string
    firstName: string
    lastName: string
    avatar: string
    province: string
    city: string
    title: string
    bio: string
    animalsSaved: number
    initials: string
    type: 'financial' | 'volunteer' | 'both'
    typeLabel: string
    status: 'active' | 'inactive'
    totalDonations: number
    totalAmount: number
    totalAmountLabel: string
    projects: number
    phone: string
    email: string
    experience: string
    motivation: string
    totalDonation: string
    volunteerHours: number
    specialties?: string[]
    achievements?: Array<{
        title: string
        date: string
        icon: string
    }>
    socialLinks?: {
        instagram?: string
        telegram?: string
        linkedin?: string
        twitter?: string
    }

    _joinDateRaw: string,
    joinDate: string
}


export const useSupporterStore = defineStore('supporterStore', () => {
    const supporter = ref<Supporter>({} as Supporter)
    const supporterCases = ref<SupporterCase[]>([])
    const fetched = ref(false)
    const router = useRouter()

    const uploader = useUploader()

    const {$axios} = useNuxtApp()
    const axios = $axios as AxiosInstance

    const typeMap = {
        financial: 'حامی مالی',
        volunteer: 'داوطلب',
        both: 'حامی مالی و داوطلب'
    }
    const latestSupporters = computed(() => {
        return [...supporterCases.value]
            .map(s => ({
                id: s.id,
                name: s.name || 'ناشناس',
                avatar: s.avatar,
                initials: s.initials,
                date: s.createdAt,
                type: typeMap[s.type],
                status: s.status
            }))
            // ❗ جدیدترین اول
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
    })


    const fetchSupporter = async () => {
        try {
            const {data} = await axios.get('/v1/supporters')
            supporter.value = data.data
            fetched.value = true
        } catch (error) {
            fetched.value = true
            console.error('❌ خطا در دریافت حامی:', error)
        }
    }
    const fetchSupporters = async () => {
        try {
            const {data} = await axios.get('/v1/supporters')

            supporterCases.value = data.map((item: any): SupporterCase => {
                const name = item.user?.fullName || '---'
                const fullName = item.user?.fullName || '---'
                const firstName = item.user?.firstName || '---'
                const lastName = item.user?.lastName || '---'
                const initialAmount = Number(item.initialAmount ?? 0)
                const avatar = item.user?.avatar || ''
                const animalsSaved = item.user?.animalsSaved || 0
                const title = item.user?.title || ''
                const bio = item.user?.bio || ''
                const socialLinks = item.socialLinks || {}

                // ✅ مجموع کمک‌ها از donations
                const donationSum = Array.isArray(item.donations)
                    ? item.donations.reduce(
                        (sum: number, d: any) => sum + Number(d.amount || 0),
                        0
                    )
                    : 0

                // ✅ مجموع کل
                const totalAmount = initialAmount + donationSum

                const formattedAmount =
                    totalAmount >= 1_000_000
                        ? `${(totalAmount / 1_000_000).toFixed(1)} میلیون`
                        : totalAmount >= 1_000
                            ? `${(totalAmount / 1_000).toFixed(1)} هزار`
                            : `${totalAmount}`

                const initials = lastName
                    .split(' ')
                    .map((part: string) => part[0])
                    .join(' ')

                const typeLabel =
                    item.type === 'financial'
                        ? 'حامی مالی'
                        : item.type === 'volunteer'
                            ? 'داوطلب'
                            : 'مالی و داوطلب'

                return {
                    id: item.id,
                    name: fullName,
                    fullName: fullName,
                    firstName: firstName,
                    lastName: lastName,
                    title: title,
                    bio: bio,
                    animalsSaved: animalsSaved,
                    avatar: avatar,
                    initials,
                    type: item.type,
                    typeLabel,
                    status: item.status,
                    totalDonations: Array.isArray(item.donations)
                        ? item.donations.length + 1
                        : 0,
                    totalAmount,
                    socialLinks,
                    totalAmountLabel: formattedAmount,
                    projects: item.projects?.length ?? 0,
                    phone: item.user?.phoneNumber || '',
                    email: item.user?.email || '',
                    _joinDateRaw: item.joinDate,
                    joinDate: item.joinDate
                }
            })

            fetched.value = true
        } catch (error) {
            fetched.value = true
            console.error('❌ خطا در دریافت حامیان:', error)
        }
    }

    const addSupporter = async (newSupporter: Supporter, avatar?: File,) => {
        let avatarUrl = newSupporter.avatar ?? ''
        if (avatar) {
            avatarUrl = await uploader.uploadImage(avatar)
        }

        const payload = {
            ...newSupporter,
            avatar: avatarUrl
        }

        try {
            const {data} = await axios.post('/v1/request-supporters', payload)
            supporter.value = data.data
            fetched.value = true
        } catch (error) {
            fetched.value = true
            console.error('❌ خطا در ثبت حامی:', error)
        }
    }

    const newSupporters = computed(() => {
        const now = new Date()

        return supporterCases.value.filter(s => {
            const joinDate = new Date(toGregorianDate(s.joinDate)) // چون joinDate شمسیه
            return (
                joinDate.getFullYear() === now.getFullYear() &&
                joinDate.getMonth() === now.getMonth()
            )
        }).length
    })

    const newSupportersToday = computed(() => {
        const now = new Date()

        return supporterCases.value.filter(s => {
            const joinDate = new Date(toGregorianDate(s.joinDate))
            return (
                joinDate.getFullYear() === now.getFullYear() &&
                joinDate.getMonth() === now.getMonth() &&
                joinDate.getDate() === now.getDate()
            )
        }).length
    })

    // تبدیل joinDate به شیء تاریخ استاندارد
    function parseJoinDate(supporter: SupporterCase): Date {
        // joinDate اصلی باید میلادی باشد
        return new Date(supporter._joinDateRaw)
    }

// 🔥 حامیان جدید ماه جاری
    const newSupportersThisMonth = computed(() => {
        const now = new Date()
        return supporterCases.value.filter(s => {
            const d = parseJoinDate(s)
            return (
                d.getFullYear() === now.getFullYear() &&
                d.getMonth() === now.getMonth()
            )
        }).length
    })

// 🔥 حامیان جدید هفته جاری
    const newSupportersThisWeek = computed(() => {
        const now = new Date()
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay()) // شنبه تا جمعه — نیاز داری اصلاح کنم؟ (ایرانی/میلادی؟)

        return supporterCases.value.filter(s => {
            const d = parseJoinDate(s)
            return d >= startOfWeek && d <= now
        }).length
    })

// 🔥 حامیان جدید سه ماه اخیر
    const newSupportersLastThreeMonths = computed(() => {
        const now = new Date()
        const threeMonthsAgo = new Date(now)
        threeMonthsAgo.setMonth(now.getMonth() - 2)

        return supporterCases.value.filter(s => {
            const d = parseJoinDate(s)
            return d >= threeMonthsAgo
        }).length
    })

// 🔥 حامیان جدید سال جاری
    const newSupportersThisYear = computed(() => {
        const now = new Date()
        return supporterCases.value.filter(s => {
            const d = parseJoinDate(s)
            return d.getFullYear() === now.getFullYear()
        }).length
    })


    return {
        supporter,
        supporterCases,
        fetched,
        newSupporters,
        newSupportersToday,
        newSupportersThisWeek,
        newSupportersThisMonth,
        newSupportersThisYear,
        newSupportersLastThreeMonths,
        latestSupporters,
        fetchSupporter,
        fetchSupporters,
        addSupporter,
    }
})