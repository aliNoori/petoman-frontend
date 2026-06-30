// stores/faqStore.ts
import { defineStore } from 'pinia'
import { ref, inject } from 'vue'
import type { AxiosInstance } from 'axios'
import {useNuxtApp} from "#app";


export interface Faq {
    id: string
    order: number
    question: string
    answer: string
    contentType:string
    contentTitle:string
    typeId:string
    color:string
    category: string
    isActive:boolean
    status: 'active' | 'inactive'
    createdAt:Date
}


export const useFaqStore = defineStore('faqStore', () => {
    const faqs = ref<Faq[]>([])
    const faq = ref<Faq | null>(null)
    const fetched = ref(false)

    const { $axios } = useNuxtApp()
    const axios = $axios as AxiosInstance


    // =====================================================================
    // 📌 دریافت همه سوال‌ها
    // =====================================================================
    const fetchFaqs = async (filters?: { typeId?: string; activeOnly?: boolean }) => {
        try {
            const { data } = await axios.get('/faqs', { params: filters })
            faqs.value = data
            fetched.value = true
        } catch (error) {
            console.error('❌ خطا در دریافت سوال ها:', error)
        }


    }

    // =====================================================================
    // 📌 دریافت یک سوال
    // =====================================================================
    const fetchFaq = async (id: number) => {
        try {
            const { data } = await axios.get(`/faqs/${id}`)
            faq.value = data
        } catch (error) {
            console.error('❌ خطا در دریافت سوال:', error)
        }
    }

    return {
        faqs,
        faq,
        fetched,
        fetchFaqs,
        fetchFaq,
    }
})