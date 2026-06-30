import {ref, computed, watch, onMounted} from 'vue'
import {useNuxtApp} from "nuxt/app";
import type {AxiosInstance} from "axios";


interface CartItem {
    id: string | number
    productId: string | number
    name: string
    price: number
    originalPrice?: number
    quantity: number
    image?: string
    category?: string
    shopId?: string | number
    shopName?: string
    variant?: string
    // فیلد اختیاری برای شناسه ورینت اگر در بک‌اند دارید
    variantId?: string
}

interface DiscountResult {
    discountId: string
    code: string
    discountAmount: number
    finalAmount: number
}

// Global cart state
const cartItems = ref<CartItem[]>([])
const isCartOpen = ref(false)

// وضعیت کد تخفیف اعمال شده
const appliedDiscount = ref<{
    discountId: string
    code: string
    amount: number
} | null>(null)

// Load from localStorage on init
if (typeof window !== 'undefined') {
    const savedCart = localStorage.getItem('pet-pharmacy-cart')
    if (savedCart) {
        try {
            cartItems.value = JSON.parse(savedCart)
        } catch (e) {
            cartItems.value = []
        }
    }

    // بارگذاری وضعیت تخفیف از لوکال استوریج (اختیاری: برای حفظ تخفیف بعد از رفرش)
    const savedDiscount = localStorage.getItem('pet-pharmacy-discount')
    if (savedDiscount) {
        try {
            appliedDiscount.value = JSON.parse(savedDiscount)
        } catch (e) {
            appliedDiscount.value = null
        }
    }
}

// Save to localStorage on change
watch(cartItems, (newVal) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('pet-pharmacy-cart', JSON.stringify(newVal))
    }
}, {deep: true})

// ذخیره وضعیت تخفیف در لوکال استوریج وقتی تغییر می‌کند
watch(appliedDiscount, (newVal) => {
    if (typeof window !== 'undefined') {
        if (newVal) {
            localStorage.setItem('pet-pharmacy-discount', JSON.stringify(newVal))
        } else {
            localStorage.removeItem('pet-pharmacy-discount')
        }
    }
})

export function useCart() {

    const {$axios} = useNuxtApp()
    const axios = $axios as AxiosInstance

    // Computed
    const cartCount = computed(() => {
        return cartItems.value.reduce((total, item) => total + item.quantity, 0)
    })

    const cartTotal = computed(() => {
        return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
    })

    const cartTotalWithDiscount = computed(() => {
        // اینجا باید قیمت‌های اصلی (بدون تخفیف محصول) را جمع بزنیم
        return cartItems.value.reduce((total, item) => {
            const price = item.originalPrice || item.price
            return total + (price * item.quantity)
        }, 0)
    })

    const cartDiscount = computed(() => {
        // تخفیف حاصل از دو منبع:
        // 1. تخفیف‌های روی خود محصول (originalPrice vs price)
        // 2. کد تخفیف کاربر (appliedDiscount)
        const productDiscount = cartTotalWithDiscount.value - cartTotal.value
        const userDiscount = appliedDiscount.value ? appliedDiscount.value.amount : 0

        // کل تخفیف کاربر برابر است با: (تخفیف محصول + تخفیف کد) منهای (تخفیف کد روی کل مبلغ)
        // برای سادگی در این مثال، فرض می‌کنیم تخفیف کد کاربر روی "مبلغ نهایی سفارش" اعمال می‌شود
        // و تخفیف محصول روی "قیمت واحد" اعمال شده است.

        // فرمول دقیق بستگی به بیزنس لاجیک شما دارد. اینجا فرض می‌کنیم:
        // cartTotalWithDiscount: جمع قیمت اصلی تمام آیتم‌ها
        // cartTotal: جمع قیمت نهایی آیتم‌ها (پس از تخفیف محصول)
        // appliedDiscount.amount: مبلغ تخفیف کد کاربر

        return productDiscount + userDiscount
    })

    const finalCartTotal = computed(() => {
        // مبلغی که کاربر باید پرداخت کند
        // فرمول: (جمع قیمت اصلی) - (تخفیف محصول) - (تخفیف کد کاربر)
        return cartTotalWithDiscount.value - cartDiscount.value
    })

    // Methods
    const generateUniqueId = (productId: string | number, variantId?: string) => {
        return variantId ? String(variantId) : String(productId)
    }

    const addToCart = (product: Omit<CartItem, 'id'>) => {
        const uniqueId = generateUniqueId(product.productId, product.variantId)
        const existing = cartItems.value.find(item => item.id === uniqueId)

        // اگر محصولی اضافه شود، اگر کد تخفیف خاصی روی آن محصول نبوده و فقط کد کاربر است،
        // ممکن است نیاز باشد بررسی کنیم آیا کد کاربر هنوز معتبر است یا خیر (مثلاً اگر شرط حداقل خرید تغییر کرده باشد)
        // اما برای سادگی فعلاً اجازه می‌دهیم اضافه شود.

        if (existing) {
            existing.quantity += product.quantity
        } else {
            cartItems.value.push({
                ...product,
                id: uniqueId,
            })
        }
        return true
    }

    const removeFromCart = (uniqueId: string | number) => {
        cartItems.value = cartItems.value.filter(item => item.id !== uniqueId)
    }

    const increaseQuantity = (uniqueId: string | number) => {
        const item = cartItems.value.find(item => item.id === uniqueId)
        if (item) {
            item.quantity++
        }
    }

    const decreaseQuantity = (uniqueId: string | number) => {
        const item = cartItems.value.find(item => item.id === uniqueId)
        if (item) {
            if (item.quantity > 1) {
                item.quantity--
            } else {
                removeFromCart(uniqueId)
            }
        }
    }

    const clearCart = () => {
        cartItems.value = []
        appliedDiscount.value = null // با خالی شدن سبد، تخفیف هم پاک شود
    }

    const getItemQuantity = (productId: string | number, variant?: string) => {
        const uniqueId = generateUniqueId(productId, variant)
        const item = cartItems.value.find(item => item.id === uniqueId)
        return item?.quantity || 0
    }

    const isInCart = (productId: string | number, variant?: string) => {
        const uniqueId = generateUniqueId(productId, variant)
        return cartItems.value.some(item => item.id === uniqueId)
    }

    const openCart = () => {
        isCartOpen.value = true
    }

    const closeCart = () => {
        isCartOpen.value = false
    }

    const toggleCart = () => {
        isCartOpen.value = !isCartOpen.value
    }

    // تابع جدید برای اعمال کد تخفیف
    const applyDiscount = async (code: string): Promise<DiscountResult> => {
        if (!code.trim()) throw new Error('کد تخفیف نمی‌تواند خالی باشد')

        // محاسبه مبلغ کل سبد برای ارسال به سرور
        // نکته: سرور باید بداند "cartTotal" یعنی چه. معمولاً یعنی جمع قیمت نهایی آیتم‌ها (بدون تخفیف محصول)
        // یا جمع قیمت اصلی. با توجه به کد بک‌اند شما، بهتر است جمع قیمت اصلی (originalPrice) را بفرستید
        // مگر اینکه بک‌اند شما هوشمند باشد و خودش قیمت‌ها را چک کند.
        // در اینجا فرض می‌کنیم بک‌اند مقدار `cartTotal` ورودی را برای محاسبه درصد استفاده می‌کند.
        const canApply = false
        const currentCartTotal = cartTotal.value // یا cartTotalWithDiscount.value بسته به منطق بک‌اند

        try {

            const response = await axios.post<DiscountResult>('/discounts/apply', {
                canApply,
                code,
                cartTotal: currentCartTotal
            })

            // اگر درخواست موفق بود
            appliedDiscount.value = {
                discountId: response.data.discountId,
                code: response.data.code,
                amount: response.data.discountAmount
            }

            return response.data

        } catch (error: any) {
            // اگر خطایی رخ داد، تخفیف را ریست کن
            appliedDiscount.value = null
            throw error
        }
    }

    // متد حذف کد تخفیف (لغو از سمت سرور)
    const removeDiscount = async () => {
        if (!appliedDiscount.value?.discountId) {
            // اگر ID نداریم، فقط وضعیت محلی را پاک می‌کنیم
            appliedDiscount.value = null
            return
        }

        try {
            // فراخوانی API برای لغو کد تخفیف در دیتابیس
            //await axios.delete(`/discounts/revoke/${appliedDiscount.value.discountId}`)

            // پاکسازی وضعیت محلی پس از موفقیت
            appliedDiscount.value = null
        } catch (error) {
            console.error('Failed to remove discount:', error)
            // در صورت خطا می‌توان پیام خطا به کاربر نمایش داد
            throw error
        }
    }

    return {
        // State
        cartItems,
        isCartOpen,
        appliedDiscount,
        // Computed
        cartCount,
        cartTotal,
        cartTotalWithDiscount,
        cartDiscount,
        finalCartTotal, // مبلغ نهایی برای پرداخت
        // Methods
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        getItemQuantity,
        isInCart,
        openCart,
        closeCart,
        toggleCart,
        applyDiscount,
        removeDiscount
    }
}