import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { AxiosInstance } from 'axios'
import { useNuxtApp } from "#app"
import { useMovieStore } from "~/stores/movie"
import { useSeriesStore } from "~/stores/series"

type MediaType = 'movie' | 'series' | 'episode'

export interface  MediaItem {
    id: string
    type: MediaType
    title: string
    description: string
    poster: string
    category: string
    slug: string
    duration: number
    ageRating: number
    rating:number
    year: number
    isNew:boolean
    quality:string
    badge:string
    qualityClass:string
    views: number
    status: string
    favorite?: boolean
    watchlist?: boolean
    favorites?: number
    watchlists?: number
    createdAt?:string
}
interface WatchedItem {
    mediaId: string
    mediaType: MediaType
    currentTime: number
    duration: number
    progress: number
    watchedAt: string
}



export const useMediaStore = defineStore('mediaStore', () => {
    const { $axios } = useNuxtApp()
    const axios = $axios as AxiosInstance

    const movieStore = useMovieStore()
    const seriesStore = useSeriesStore()
    const watched = ref<WatchedItem[]>([])

    const getWatched = (mediaId: string, mediaType: MediaType) => {
        return watched.value.find(
            w => w.mediaId === mediaId && w.mediaType === mediaType
        )
    }


    const fetchWatched = async () => {
        try {
            const { data } = await axios.get('/v1/media/watched')

            watched.value = data.map((w: any) => ({
                mediaId: w.mediaId,
                mediaType: w.mediaType,
                currentTime: w.currentTime ?? 0,
                duration: w.duration ?? 0,
                progress: w.progress ?? 0,
                watchedAt: w.watchedAt
            }))
        } catch (e) {
            console.error('❌ fetchWatched failed', e)
        }
    }


    const watchedList = computed(() =>
        watched.value
            .map(w => {
                const media = allContents.value.find(
                    m => m.id === w.mediaId && m.type === w.mediaType
                )
                return media ? { ...media, ...w } : null
            })
            .filter(Boolean) as any[]
    )

    const updateWatched = async (
        mediaId: string,
        mediaType: MediaType,
        currentTime: number,
        duration: number
    ) => {
        const progress = duration
            ? Math.min(100, Math.floor((currentTime / duration) * 100))
            : 0

        try {
            await axios.patch('/v1/media/watched', {
                mediaId,
                mediaType,
                currentTime,
                duration,
                progress
            })

            const item = watched.value.find(
                w => w.mediaId === mediaId && w.mediaType === mediaType
            )

            if (item) {
                item.currentTime = currentTime
                item.duration = duration
                item.progress = progress
                item.watchedAt = new Date().toISOString()
            } else {
                watched.value.push({
                    mediaId,
                    mediaType,
                    currentTime,
                    duration,
                    progress,
                    watchedAt: new Date().toISOString()
                })
            }
        } catch (e) {
            console.error('❌ updateWatched failed', e)
        }
    }



    const films = computed<MediaItem[]>(() =>
        movieStore.movies.map((film: any) => ({
            id: film.id,
            type: 'movie',
            title: film.title,
            description: film.description,
            poster: film.poster,
            category: film.category.title,
            slug: film.category.slug,
            duration: film.duration,
            ageRating: film.ageRating,
            rating:film.rating,
            year: film.year,
            isNew:film.isNew??false,
            quality:film.videoQuality??'',
            badge:film.badge,
            qualityClass:film.qualityClass??'',
            views: film.views ?? 0,
            status: film.views > 15000 ? 'پر بازدید' : 'کم بازدید',
            favorite: film.favorite ?? false,
            watchlist: film.watchlist ?? false,
            favorites: film.favorites ?? 0,
            watchlists: film.watchlists ?? 0,
            createdAt:film.createdAt
        }))
    )

    const series = computed<MediaItem[]>(() =>
        seriesStore.seriesList.map((s: any) => ({
            id: s.id,
            type: 'series',
            title: s.title,
            description: s.description,
            poster: s.poster,
            category: s.category.title,
            slug: s.category.slug,
            duration: s.duration ?? 0,
            ageRating: s.ageRating,
            rating:s.rating,
            year: s.year,
            isNew:s.isNew??false,
            quality:s.videoQuality??'',
            badge:s.badge,
            qualityClass:s.qualityClass??'',
            views: s.views ?? 0,
            status: s.views > 15000 ? 'پر بازدید' : 'کم بازدید',
            favorite: s.favorite ?? false,
            watchlist: s.watchlist ?? false,
            favorites: s.favorites ?? 0,
            watchlists: s.watchlists ?? 0,
            createdAt:s.createdAt
        }))
    )

    const episodes = computed<MediaItem[]>(() =>
        seriesStore.seriesList.flatMap((s: any) =>
            (s.seasonsList ?? []).flatMap((season: any) =>
                (season.episodes ?? []).map((ep: any) => ({
                    id: ep.id,
                    type: 'episode',
                    title: ep.title,
                    description: ep.description,
                    poster: s.poster,
                    category: s.category.title,
                    slug: s.category.slug,
                    duration: ep.duration ?? 0,
                    ageRating: s.ageRating,
                    rating:s.rating,
                    year: s.year,
                    isNew:s.isNew??true,
                    quality:s.videoQuality??'',
                    badge:s.badge,
                    qualityClass:s.qualityClass??'',
                    views: ep.views ?? 0,
                    status: ep.views > 15000 ? 'پر بازدید' : 'کم بازدید',
                    favorite: ep.favorite ?? false,
                    watchlist: ep.watchlist ?? false,
                    favorites: ep.favorites ?? 0,
                    watchlists: ep.watchlists ?? 0,
                    createdAt:ep.createdAt
                }))
            )
        )
    )
    const animations = computed<MediaItem[]>(()=>[])
    const documentaries = computed<MediaItem[]>(()=>[])

    const allContents = computed<MediaItem[]>(() => [
        ...films.value,
        ...series.value,
        ...episodes.value
    ])

    const getAllMovieAndSeries = computed<MediaItem[]>(() => [
        ...films.value,
        ...series.value,
    ])

    // Toggle Watchlist
    const toggleWatchlist = async (id: string, type: MediaType) => {
        try {
            const { data } = await axios.patch(`/v1/media/${id}/watch-list`, {
                mediaId: id,
                mediaType: type
            })

            if (type === 'movie') {
                const movie = movieStore.movies.find(m => m.id === id)
                if (movie) {
                    movie.watchlist = !movie.watchlist
                    movie.watchlists = data.watchlists
                }
            }

            if (type === 'series') {
                const series = seriesStore.seriesList.find(s => s.id === id)
                if (series) {
                    series.watchlist = !series.watchlist
                    series.watchlists = data.watchlists
                }
            }

            if (type === 'episode') {
                for (const s of seriesStore.seriesList) {
                    for (const season of s.seasonsList ?? []) {
                        const ep = season.episodes.find(e => e.id === id)
                        if (ep) {
                            ep.watchlist = !ep.watchlist
                            ep.watchlists = data.watchlists
                            return
                        }
                    }
                }
            }

        } catch (err) {
            console.error('❌ toggleWatchlist failed', err)
        }
    }


    // Toggle Favorite
    const toggleFavorite = async (id: string, type: MediaType) => {
        try {
            const { data } = await axios.patch(`/v1/media/${id}/favorite`, {
                mediaId: id,
                mediaType: type
            })

            if (type === 'movie') {
                const movie = movieStore.movies.find(m => m.id === id)
                if (movie) {
                    movie.favorite = !movie.favorite
                    movie.favorites = data.favorites
                }
            }

            if (type === 'series') {
                const series = seriesStore.seriesList.find(s => s.id === id)
                if (series) {
                    series.favorite = !series.favorite
                    series.favorites = data.favorites
                }
            }

            if (type === 'episode') {
                for (const s of seriesStore.seriesList) {
                    for (const season of s.seasonsList ?? []) {
                        const ep = season.episodes.find(e => e.id === id)
                        if (ep) {
                            ep.favorite = !ep.favorite
                            ep.favorites = data.favorites
                            return
                        }
                    }
                }
            }

        } catch (err) {
            console.error('❌ toggleFavorite failed', err)
        }
    }


    const favoriteMediaIds = computed<string[]>(() =>
        allContents.value.filter(m => m.favorite).map(m => `${m.type}:${m.id}`)
    )

    const watchListMediaIds = computed<string[]>(() =>
        allContents.value.filter(m => m.watchlist).map(m => `${m.type}:${m.id}`)
    )

    const isFavorite = (id: string, type: MediaType) => {

        return favoriteMediaIds.value.includes(`${type}:${id}`)
    }

    const isWatchlist = (id: string, type: MediaType) => {

        return watchListMediaIds.value.includes(`${type}:${id}`)
    }


    return {
        allContents,
        films,
        series,
        episodes,
        animations,
        documentaries,
        favoriteMediaIds,
        watchListMediaIds,
        getAllMovieAndSeries,
        toggleFavorite,
        toggleWatchlist,
        isFavorite,
        isWatchlist,
        updateWatched,
        fetchWatched,
        watchedList,
        getWatched

    }
})