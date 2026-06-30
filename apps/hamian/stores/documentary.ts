import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AxiosInstance } from 'axios'
import {useNuxtApp} from "#app";

// -------------------------
// 🎬 Documentary Entity
// -------------------------
export interface Documentary {
    id: string
    title: string
    description?: string
    category: string
    slug: string
    duration?: string
    publishDate?: string
    status: 'draft' | 'published'
    tags?: string[]
    seoTitle?: string
    seoDescription?: string
    seoKeywords?: string
    thumbnailUrl?: string
    videoUrl?: string
    createdAt: string
    updatedAt: string
}

// -------------------------
// ✏️ DTO Types
// -------------------------
export interface CreateDocumentaryDto {
    title: string
    description?: string
    category: string
    categoryId:string
    duration?: string
    publishDate?: string
    status?: 'draft' | 'published'
    tags?: string[]
    seoTitle?: string
    seoDescription?: string
    seoKeywords?: string
    slug?: string
    // media
    videoUploadMethod: 'url' | 'file'
    videoUrl?: string
    videoFile?: File | null
    thumbnailPreview?: string | null
}

// -------------------------
// 📦 Pinia Store
// -------------------------
export const useDocumentaryStore = defineStore('documentaryStore', () => {
    const documentaries = ref<Documentary[]>([])
    const documentary = ref<Documentary | null>(null)
    const loading = ref(false)

    const { $axios } = useNuxtApp()
    const axios = $axios as AxiosInstance

    // -------------------------
    // 📥 Fetch All
    // -------------------------
    const fetchDocumentaries = async () => {
        try {
            const { data } = await axios.get('/v1/documentaries')

            documentaries.value = data.map((doc: any) => ({
                ...doc,
                videoUrl: doc.videoUrl || '',
                videoFile: doc.videoFile||'',
                thumbnailUrl: doc.thumbnailPreview || '',
                tags: Array.isArray(doc.tags) ? doc.tags : JSON.parse(doc.tags || '[]')
            }))
        } catch (err) {
            console.error('❌ خطا در دریافت مستندها:', err)
        }
    }

    const selectDocumentary = (doc: Documentary) => {
        documentary.value = doc
    }

    return {
        documentaries,
        documentary,
        loading,
        fetchDocumentaries,
        selectDocumentary,
    }
})