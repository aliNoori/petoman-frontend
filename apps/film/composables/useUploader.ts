import { ref } from 'vue'
import type { AxiosInstance, AxiosProgressEvent } from 'axios'
import {useNuxtApp} from "#app";

export function useUploader() {
    const { $axios } = useNuxtApp()
    const axios = $axios as AxiosInstance

    const uploading = ref(false)
    const progress = ref(0)

    // 📌 متد عمومی آپلود
    const upload = async (file: File, endpoint: string): Promise<string> => {
        try {
            uploading.value = true
            progress.value = 0

            const formData = new FormData()
            formData.append('file', file)

            const { data } = await axios.post(endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    if (progressEvent.total) {
                        progress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    }
                },
            })

            if (!data?.url) throw new Error('No URL returned from server')
            return data.url.toString()
        } finally {
            uploading.value = false
        }
    }

    // 📌 کمکی: اگر ورودی base64 بود تبدیل به File کن
    const base64ToFile = async (base64String: string, filename = 'upload.png'): Promise<File> => {
        const blob = await fetch(base64String).then(res => res.blob())
        return new File([blob], filename, { type: blob.type })
    }

    // 📌 آپلود تصویر
    const uploadImage = async (input: File | string): Promise<string> => {
        let file: File
        if (typeof input === 'string' && input.startsWith('data:image')) {
            file = await base64ToFile(input, 'image.png')
        } else if (input instanceof File) {
            file = input
        } else {
            throw new Error('Invalid input for uploadImage')
        }
        return upload(file, '/v1/uploads/image')
    }

    // 📌 آپلود ویدیو
   /* const uploadVideo = async (input: File | string): Promise<string> => {
        let file: File
        if (typeof input === 'string' && input.startsWith('data:video')) {
            file = await base64ToFile(input, 'video.mp4')
        } else if (input instanceof File) {
            file = input
        } else {
            throw new Error('Invalid input for uploadVideo')
        }
        return upload(file, '/v1/uploads/video')
    }*/
    const uploadChunkedVideo = async (
        file: File,
        onProgress?: (percent: number) => void,   // 🟩 اضافه شد
        chunkSize = 5 * 1024 * 1024
    ): Promise<string> => {
        uploading.value = true
        progress.value = 0

        const totalChunks = Math.ceil(file.size / chunkSize)
        let uploadedBytes = 0
        let videoId: string | null = null

        for (let i = 0; i < totalChunks; i++) {
            const start = i * chunkSize
            const end = Math.min(file.size, start + chunkSize)
            const chunk = file.slice(start, end)

            const formData = new FormData()
            formData.append('chunk', chunk)
            formData.append('index', i.toString())
            formData.append('total', totalChunks.toString())
            if (videoId) formData.append('videoId', videoId)

            const res = await axios.post('/v1/uploads/video-chunk', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (e) => {
                    uploadedBytes = start + e.loaded
                    const percent = Math.round((uploadedBytes / file.size) * 100)
                    progress.value = percent
                    onProgress?.(percent)   // 🟩 ارسال درصد به بیرون
                }
            })

            if (!videoId && res.data.videoId) {
                videoId = res.data.videoId
            }
        }

        // 📌 بعد از آپلود همه chunk ها، درخواست merge
        const finalizeRes = await axios.post('/v1/uploads/video-merge', { videoId })
        uploading.value = false
        return finalizeRes.data.url
    }


    // 📌 آپلود فایل عمومی
    const uploadFile = async (input: File | string): Promise<string> => {
        let file: File
        if (typeof input === 'string' && input.startsWith('data:')) {
            file = await base64ToFile(input, 'file.bin')
        } else if (input instanceof File) {
            file = input
        } else {
            throw new Error('Invalid input for uploadFile')
        }
        return upload(file, '/v1/uploads/file')
    }

    return {
        uploading,
        progress,
        uploadImage,
        //uploadVideo,
        uploadChunkedVideo,
        uploadFile,
        upload
    }
}