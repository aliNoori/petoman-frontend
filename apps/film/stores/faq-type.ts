// stores/tagTypeStore.ts
import { defineStore } from 'pinia'
import { ref, inject } from 'vue'
import type { AxiosInstance } from 'axios'
import {useNuxtApp} from "#app";

export interface FaqType {
    id: string
    name: string
    displayName?: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export const useFaqTypeStore = defineStore('faqTypeStore', () => {
    const faqTypes = ref<FaqType[]>([])
    const selectedType = ref<FaqType | null>(null)
    const fetched = ref(false)

    const { $axios } = useNuxtApp()
    const axios = $axios as AxiosInstance

    // fetch all types
    const fetchTypes = async () => {
        try {
            const { data } = await axios.get('/faq-types')
            faqTypes.value = data
            fetched.value = true
        } catch (error) {
            console.error('❌ خطا در دریافت نوع سوال ها:', error)
        }
    }

    // fetch single type
    const fetchType = async (name: string) => {
        try {
            const { data } = await axios.get(`/faq-types/${name}`)
            selectedType.value = data
        } catch (error) {
            console.error('❌ خطا در دریافت نوع سوال ها:', error)
        }
    }

    // add new type
    const addType = async (newType: Partial<FaqType>) => {
        try {
            const { data } = await axios.post('/faq-types', newType)
            faqTypes.value.unshift(data)
            console.log('✅ نوع سوال  ثبت شد')
            return data
        } catch (error) {
            console.error('❌ خطا در ثبت نوع سوال:', error)
        }
    }

    // edit type
    const editType = async (updatedType: Partial<FaqType> & { id: string }) => {
        try {
            const { id, ...body } = updatedType
            const { data } = await axios.patch(`/faq-types/${id}`, body)
            const index = faqTypes.value.findIndex(t => t.id === data.id)
            if (index !== -1) faqTypes.value[index] = data
            return data
        } catch (error) {
            console.error('❌ خطا در ویرایش نوع دسته‌بندی:', error)
        }
    }

    // toggle status
    const toggleStatus = async (id: string, isActive: boolean) => {
        try {
            const { data } = await axios.patch(`/category-types/${id}/status`, { isActive })
            const index = faqTypes.value.findIndex(t => t.id === id)
            if (index !== -1) faqTypes.value[index].isActive = data.isActive
            console.log(`✅ وضعیت نوع سوال ${id} تغییر کرد به ${data.isActive}`)
        } catch (error) {
            console.error('❌ خطا در تغییر وضعیت نوع سوال:', error)
        }
    }

    // delete type
    const removeType = async (id: string) => {
        try {
            await axios.delete(`/faq-types/${id}`)
            faqTypes.value = faqTypes.value.filter(t => t.id !== id)
            console.log('✅ نوع سوال حذف شد')
        } catch (error) {
            console.error('❌ خطا در حذف نوع سوال:', error)
        }
    }

    return {
        faqTypes,
        selectedType,
        fetched,
        fetchTypes,
        fetchType,
        addType,
        editType,
        removeType,
        toggleStatus,
    }
})