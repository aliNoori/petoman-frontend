// stores/postStore.ts
import {defineStore} from 'pinia'
import {ref, computed} from 'vue'
import type {AxiosInstance} from "axios";
import {useNuxtApp} from "nuxt/app";
import {useSettingStore} from "~/stores/setting";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import moment from 'moment-jalaali'

export interface PostForm {
    id?: number | string
    title: string
    slug: string
    content: string
    excerpt?: string
    image?: string | File | null

    // SEO
    metaTitle?: string
    metaDescription?: string
    keywords?: string | string[]

    // OG
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
    ogType?: string
    ogUrl?: string

    // Other
    views?: number
    likes?: number
    liked: boolean
    bookmarked: boolean
    featured?: boolean
    status: 'draft' | 'published'
    publishDate?: string | null

    categories?: string[]
    tags?: string[]
    schemaType: string
}

export interface Post extends PostForm {
    createdAt: string
    updatedAt: string
}

export const usePostStore = defineStore('postStore', () => {
    const posts = ref<Post[]>([])
    const post = ref<Post>()
    const fetched = ref(false)
    const liked = ref(false)

    const settingStore = useSettingStore()
    const tz = settingStore.generalSetting?.timezone || 'Asia/Tehran'
    dayjs.extend(utc)
    dayjs.extend(timezone)
    dayjs.locale('fa')
    moment.loadPersian({usePersianDigits: true})
    const {$axios} = useNuxtApp()
    const axios = $axios as AxiosInstance

    // -------------------------------------------
    // GET ALL POSTS
    // -------------------------------------------
    const fetchPosts = async () => {

        // const perPage = Number(settingStore.generalSetting?.postsPerPage || 12)
        // const offset = (page - 1) * perPage///posts?limit=${perPage}&offset=${offset}`

        try {
            const {data} = await axios.get('/v1/posts')

            posts.value = data
                .map((p: any) => ({
                    id: p.id,
                    title: p.title,

                    excerpt:
                        p.excerpt ||
                        p.content?.replace(/<[^>]*>?/gm, '').slice(0, 120) + '...',

                    author: p.author?.fullName || 'بدون نویسنده',

                    date:moment(p.publishDate || p.createdAt)
                        .format('jYYYY/jMM/jDD HH:mm'),
                    readTime: Math.ceil(p.content?.split(' ').length / 150) || 1,

                    views: p.views ?? 0,

                    image: p.image || 'https://via.placeholder.com/600x400',

                    categories: p.categories || [],
                    //category:p.category[0]?.slug||'',

                    tags: p.tags || [],
                    status: p.status,
                    likes: p.likes,
                    liked: p.liked,
                    bookmarked: p.bookmarked,
                    content: p.content,
                    description: p.description,
                    publishDate: p.publishDate,
                    metaTitle: p.metaTitle,
                    metaDescription: p.metaDescription,
                }))

                .sort((a: any, b: any) => {
                    const dateA = new Date(a.publishDate || a.createdAt).getTime()
                    const dateB = new Date(b.publishDate || b.createdAt).getTime()
                    return dateB - dateA
                })

            fetched.value = true
        } catch (err) {
            console.error('❌ fetchPosts failed', err)
        }
    }

    // -------------------------------------------
    // GET SINGLE POST
    // -------------------------------------------
    const fetchPost = async (id: string | number) => {
        try {
            const {data} = await axios.get(`/v1/posts/${id}`)
            post.value = data
        } catch (err) {
            console.error('❌ fetchPost failed', err)
        }
    }

    // -------------------------------------------
    // COMPUTEDS
    // -------------------------------------------

    const latestPosts = computed(() => posts.value.slice(0, 4))


    // Toggle Like
    const toggleLike = async (id: string | number) => {
        try {
            const target = posts.value.find(p => p.id === id) || post.value
            if (!target) return

            if (target.liked) {
                // کاربر قبلاً لایک کرده → آنلایک
                const {data} = await axios.patch(`/v1/posts/${id}/like`)
                target.liked = false
                target.likes = data.likes
            } else {
                // کاربر لایک نکرده → لایک
                const {data} = await axios.patch(`/v1/posts/${id}/like`)
                target.liked = true
                target.likes = data.likes
            }
        } catch (err) {
            console.error('❌ toggleLike failed', err)
        }
    }

// Toggle Bookmark
    const toggleBookmark = async (id: string | number) => {
        try {
            const target = posts.value.find(p => p.id === id) || post.value
            if (!target) return

            if (target.bookmarked) {
                const {data} = await axios.patch(`/v1/posts/${id}/bookmark`)
                target.bookmarked = false
            } else {
                const {data} = await axios.patch(`/v1/posts/${id}/bookmark`)
                target.bookmarked = true
            }
        } catch (err) {
            console.error('❌ toggleBookmark failed', err)
        }
    }
    const likedPostIds = computed<string[]>(() =>
        posts.value
            .filter(p => p.liked && p.id != null)
            .map(p => String(p.id))
    )

    const bookmarkedPostIds = computed<string[]>(() =>
        posts.value
            .filter(p => p.bookmarked && p.id != null)
            .map(p => String(p.id))
    )


    return {
        posts,
        post,
        fetched,
        liked,

        fetchPosts,
        fetchPost,

        // computed ها
        latestPosts,
        likedPostIds,
        bookmarkedPostIds,
        toggleLike,
        toggleBookmark
    }
})
