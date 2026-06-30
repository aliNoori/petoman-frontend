import {defineStore} from 'pinia'
import {ref} from 'vue'
import type {AxiosInstance} from 'axios'
import {useNuxtApp} from "#app";


type MediaType = 'movies' | 'series'

interface BaseMedia {
    id: string
    type: MediaType
    title: string
    description: string
    poster?: string
    year: number
    category: {
        id: string
        title: string
        slug: string
    }
}

export interface Movie extends BaseMedia {
    titleEn: string
    director: string
    cast: string
    categoryType?: any
    country?:string
    language?:string
    duration: number
    featured: boolean
    imdbRating: number
    status: 'draft' | 'published'
    tags: string[]
    trailerUrl?: string
    videoFile: File
    videoLink?: string
    videoQuality?: string
    videoSourceType?: string
    isActive: boolean
    createdAt?: string | null
    updatedAt?: string | null
    comments?: number
    keywords?: string
    downloadUrl?: string
    ageRating?: string
    categoryId?: string
    views?: number
    likes?: number
    favorite?: boolean
    watchlist?: boolean
    favorites?: number
    watchlists?: number
    uploadProgress?: number
}

export const useMovieStore = defineStore('movieStore', () => {
    const movies = ref<Movie[]>([])
    const movie = ref<Movie | null>(null)
    const uploadProgress = ref<number>(0)
    const fetched = ref(false)

    const { $axios } = useNuxtApp()
    const axios = $axios as AxiosInstance

    // 📌 دریافت همه فیلم‌ها
    const fetchMovies = async () => {
        try {
            const {data} = await axios.get('/v1/movies')
            movies.value = data.map((item: any) => ({
                id: item.id,
                type: item.type,
                title: item.title,
                titleEn: item.titleEn,
                description: item.description,
                director: item.director,
                cast: item.cast,
                categoryType: item.category,
                category: item.category,
                duration: item.duration,
                country:item.country,
                language:item.language,
                ageRating:item.ageRating,
                featured: item.featured,
                imdbRating: item.imdbRating,
                poster: item.poster,
                status: item.status || 'draft',
                tags: item.tags || [],
                keywords:item.keywords,
                trailerUrl: item.trailerUrl,
                downloadUrl:item.downloadUrl,
                videoLink: item.videoLink,
                videoQuality: item.videoQuality,
                videoSourceType: item.videoSourceType,
                year: item.year,
                favorite:item.favorite,
                watchlist:item.watchlist,
                isActive: item.isActive ?? true,
                createdAt: item.createdAt || null,
                updatedAt: item.updatedAt || null,
            }))
            fetched.value = true
        } catch (error) {
            console.error('❌ خطا در دریافت فیلم‌ها:', error)
        }
    }

    // 📌 دریافت یک فیلم
    const fetchMovie = async (id: string) => {
        try {
            const {data} = await axios.get(`/v1/movies/${id}`)
            movie.value = data
        } catch (error) {
            console.error('❌ خطا در دریافت فیلم:', error)
        }
    }

    const findById = (id: string) => {

        return movies.value.find(m => m.id === id)

    }

    return {
        movies,
        movie,
        fetched,
        uploadProgress,
        fetchMovies,
        fetchMovie,
        findById,
    }
})
