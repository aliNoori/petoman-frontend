import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AxiosInstance } from 'axios'
import {useNuxtApp} from "#app";
// =====================
// Type Definitions
// =====================

type MediaType = 'movies' | 'series'

interface BaseMedia {
    id: string
    type: MediaType
    title: string
    description: string
    poster?: string
    year: number
    favorite?: boolean
    watchlist?: boolean
    favorites?: number
    watchlists?: number
    category: {
        id: string
        title: string
        slug: string
    }
}

export interface Episode {
    title: string
    duration: number
    sourceType: 'upload' | 'url'
    quality: string
    videoLink:string
    videoUrl: string
    videoFile?: File
    uploadProgress?: number
    favorite?: boolean
    watchlist?: boolean
    favorites?: number
    watchlists?: number
}

export interface Season {
    number: number
    title: string
    description?: string
    episodes: Episode[]
}

export interface Series extends BaseMedia{
    titleEn: string
    videoLink:string
    director: string
    actors: string
    country: string
    language: string
    categoryType?: any
    status: 'draft' | 'published' | 'upcoming'
    rating: number
    tags: string[]
    featured: boolean

    keywords?: string
    ageRating?: string

    seasons: Season[]

    createdAt?: string | null
    updatedAt?: string | null
}


// =====================
// Store
// =====================

export const useSeriesStore = defineStore('seriesStore', () => {

    const seriesList = ref<Series[]>([])
    const series = ref<Series | null>(null)
    const fetched = ref(false)

    const { $axios } = useNuxtApp()
    const axios = $axios as AxiosInstance

    // =====================
    // Fetch All Series
    // =====================
    const fetchSeries = async () => {
        try {
            const { data } = await axios.get('/v1/series')

            seriesList.value = data.map((item: any) => {
                const seasonsList = item.seasons?.map((s: any) => ({
                    id:s.id,
                    number: s.number,
                    title: s.title,
                    description: s.description,
                    episodes: s.episodes?.map((e: any, index: number) => ({
                        id:e.id,
                        number: index + 1, // چون API شماره ندارد
                        title: e.title,
                        favorite:item.favorite,
                        watchlist:item.watchlist,
                        duration: e.duration,
                        videoUrl:e.videoUrl
                    })) || []
                })) || []

                const totalSeasons = item.seasons?.length || 0
                const totalEpisodes = item.seasons?.reduce(
                    (sum: number, s: any) => sum + (s.episodes?.length || 0),
                    0
                ) || 0

                return {
                    id: item.id,
                    type:item.type,
                    title: item.title,
                    titleEn: item.titleEn,
                    description: item.description,
                    poster: item.poster,
                    category: item.category?? '',
                    status: item.status,
                    rating: item.rating,
                    year: item.year,
                    favorite:item.favorite,
                    watchlist:item.watchlist,
                    tags: item.tags || [],
                    featured: item.featured ?? false,
                    keywords: item.keywords,
                    ageRating: item.ageRating,
                    country:item.country,
                    language:item.language,
                    director:item.director,
                    actors:item.actors,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,

                    // 🟩 نتیجه محاسبه شده
                    seasons: totalSeasons,
                    episodes: totalEpisodes,
                    seasonsList,
                }
            })

            fetched.value = true
        } catch (error) {
            console.error('❌ خطا در دریافت سریال‌ها:', error)
        }
    }
    const findEpisodeById = (episodeId: string) => {
        for (const series of seriesList.value) {
            if (!series.seasonsList) continue
            for (let seasonIndex = 0; seasonIndex < series.seasonsList.length; seasonIndex++) {
                const season = series.seasonsList[seasonIndex]
                const episodeIndex = season.episodes.findIndex(ep => ep.id === episodeId)
                if (episodeIndex !== -1) {
                    return {
                        series,
                        season,
                        seasonIndex,
                        episode: season.episodes[episodeIndex],
                        episodeIndex
                    }
                }
            }
        }
        return null
    }


    // =====================
    // Fetch Single Series
    // =====================
    const fetchOne = async (id: string) => {
        try {
            const { data } = await axios.get(`/v1/series/${id}`)
            series.value = data
        } catch (error) {
            console.error('❌ خطا در دریافت سریال:', error)
        }
    }

    const findById = (id: string) => {
        return seriesList.value.find(s => s.id === id)
    }

    return {
        seriesList,
        series,
        fetched,
        findEpisodeById,
        fetchSeries,
        fetchOne,
        findById,
    }
})