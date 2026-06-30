import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import type {MarketSettingsApiResponse, ShippingConfig, Shop, ShopInfo} from '../types/shop'
import {ShopService} from "../services/shop.service"
import {ShopRequest} from "../types/request";

export const useShopStore = defineStore('shopStore', () => {
    // ────────────── State ──────────────
    const shops = ref<Shop[]>([])
    const requests = ref<ShopRequest[]>([])
    const shop = ref<Shop | null>(null)
    const loading = ref(false)
    const fetched = ref(false)
    const { resolveUrl } = useUrlHelper();
    const rawSettings = ref<MarketSettingsApiResponse | null>(null);
    // ────────────── Computed ──────────────
    const shipping = computed<ShippingConfig>(() => {
        const defaults: ShippingConfig = {
            inPerson: false, inPersonDeliveryTime: '',
            petomanCourier: false, petomanCourierDeliveryTime: '',petomanCourierPrice: '',
            shopCourier: false, shopCourierDeliveryTime: '', shopCourierPrice: '',
            tipax: false, tipaxDeliveryTime: '',tipaxPrice: '',
            alopeyk: false, alopeykDeliveryTime: '',alopeykPrice: '',
            post: false, postDeliveryTime: '',postPrice: '',
        };

        // اصلاحیه: بررسی وجود shipping_methods و سپس methods
        if (!rawSettings.value?.shipping_methods?.methods) return defaults;

        const mapped: Partial<ShippingConfig> = {};

        // اصلاحیه: استفاده از shipping_methods به جای shipping
        rawSettings.value.shipping_methods.methods.forEach((method:any) => {
            if (method.type === 'inPerson') {
                mapped.inPerson = method.isActive;
                mapped.inPersonDeliveryTime = method.deliveryTime || '';
                mapped.inPersonPrice=0
            } else if (method.type === 'petomanCourier') {
                mapped.petomanCourier = method.isActive;
                mapped.petomanCourierDeliveryTime = method.deliveryTime || '';
                mapped.petomanCourierPrice = method.price ? String(method.price) : '';
            } else if (method.type === 'shopCourier') {
                mapped.shopCourier = method.isActive;
                mapped.shopCourierDeliveryTime = method.deliveryTime || '';
                mapped.shopCourierPrice = method.price ? String(method.price) : '';
            } else if (method.type === 'tipax') {
                mapped.tipax = method.isActive;
                mapped.tipaxDeliveryTime = method.deliveryTime || '';
                mapped.tipaxPrice = method.price ? String(method.price) : '';
            } else if (method.type === 'post') {
                mapped.post = method.isActive;
                mapped.postDeliveryTime = method.deliveryTime || '';
                mapped.postPrice = method.price ? String(method.price) : '';
            }else if (method.type === 'alopeyk') {
                mapped.alopeyk = method.isActive;
                mapped.alopeykDeliveryTime = method.deliveryTime || '';
                mapped.alopeykPrice = method.price ? String(method.price) : '';
            }
        });

        return { ...defaults, ...mapped };
    });

    const shopInfo = computed<ShopInfo>(() => {
        const defaults: ShopInfo = {
            logo: '', name: '', description: '',
            licenseNumber: '', medicalSystemCode: '', ownerNationalId: '', ownerName: '',
            phone: '', mobile: '', email: '', website: '',
            province: '', city: '', postalCode: '', address: '',
            is24Hours: false, openTime: '', closeTime: '', closedDays: [],
            isApproved: true, pendingChanges: false
        };

        if (!rawSettings.value?.shopInfo) return defaults;

        return { ...defaults, ...rawSettings.value.shopInfo };
    });

    const timeSlots = computed<TimeSlot[]>(() => {
        const defaults: TimeSlot = [
            {id: 1, time: 'ساعت ۹ تا ۱۲', price: 0, available: false},
            {id: 2, time: 'ساعت ۱۲ تا ۱۵', price: 0, available: false},
            {id: 3, time: 'ساعت ۱۵ تا ۱۸', price: 0, available: false},
            {id: 4, time: 'ساعت ۱۸ تا ۲۱', price: 0, available: false},
            {id: 5, time: 'ساعت ۲۱ تا ۲۴', price: 0, available: false},
        ];

        if (!rawSettings.value?.timeSlots) return defaults;

        return {...defaults, ...rawSettings.value.timeSlots.slots};
    });


    // ────────────── Actions ──────────────
    const fetchShops = async () => {

        try {

            const rawData = await ShopService.fetchShops()

            shops.value = rawData.map((tenant: any) => {

                const finalUrl = resolveUrl(tenant?.documents?.logo?.thumbnail);

                // 2. پیدا کردن آبجکت shopInfo
                // فرض بر این است که shopInfo یک آبجکت با ساختار خاص است که در value آن فیلدها قرار دارند
                const shopInfoSettings = tenant.settings?.find((item: any) => item.key === 'shopInfo');

                // ایجاد یک کپی از آبجکت shopInfo برای جلوگیری از تغییر مستقیم در داده‌های اصلی (اگر نیاز به Immutable بودن دارید)
                // اگر می‌خواهید مستقیم روی آبجکت اصلی تغییر ایجاد کنید، نیازی به کپی نیست.
                let shopInfoObj = shopInfoSettings?.value ? { ...shopInfoSettings.value } : {};

                // 3. اضافه کردن finalUrl به داخل آبجکت shopInfo
                // نکته: اگر در UI انتظار دارید لوگو در سطح shopInfo باشد، این کار درست است.
                shopInfoObj.logo = finalUrl;

                return {
                    id: tenant.id,
                    name: tenant.name,
                    //slug
                    description: tenant.description||`فروشگاه ${tenant.name} - ارائه دهنده محصولات باکیفیت`,//TODO:add description to tenant
                    //address: tenant.address || 'شیروان-کمربندی قدیم',
                    address:tenant.tenantAddress,
                    cityName: tenant.city || 'شیروان',
                    province:tenant.province||'خراسان شمالی',
                    location:tenant.location||{ lat: 37.9394, lng: 57.9326  },
                    rating:tenant.rating|| 4.8,
                    reviewsCount:tenant.reviewsCount,
                    isOpen:tenant.isOpen|| false,
                    verified: tenant.status === 'active',
                    freeDelivery:tenant.freeDelivery|| false,
                    fastDelivery:tenant.fastDelivery|| false,
                    //avatarBg:tenant?.documents?.logo?.thumbnail,
                    avatarBg:finalUrl,


                    // --- Mapping Products ---
                    products: (tenant.marketProducts || []).map((mp: any) => {
                        return {
                            id: mp.id,
                            shopId:tenant.id,
                            shopName:tenant.name,
                            name: mp.product.name,
                            brand:mp.product.brand?.name||'بدون برند',
                            //image:mp.product.image,
                            image:resolveUrl(mp.product.image),
                            category:mp.product.categoryBreadcrumb,
                            categoryId: mp.product.categoryId,
                            price: mp.hasDiscount ? mp.discountedPrice : mp.price,
                            isActive:mp.isActive,
                            stock:mp.stock,
                            available:mp.stock > 0 && mp.isActive,
                            originalPrice: mp.price,
                            discount: mp.hasDiscount ? mp.discountValue : 'بدون تخفیف',
                            rating: parseFloat(mp.reviews.rating || 0),
                            reviews: mp.reviewsCount || 0,
                            isFavorite: false//TODO:add isFavorite to product
                        };
                    }),

                    // --- Mapping Reviews ---
                    reviews: (tenant.reviews || []).map((mr: any) => {
                        return {
                            id: mr.id,
                            userName: mr.userName,
                            rating:mr.rating,
                            date:mr.date,
                            comment:mr.comment,
                            reply:mr.reply
                        };
                    }),
                    //shopInfo:tenant.settings?.find((item: any) => item.key === 'shopInfo'),
                    shopInfo:shopInfoObj,
                    shipping_method:tenant.settings?.find(item => item.key === 'shipping_method')
                };
            })

        } catch (err) {

        }
    }

    const fetchShopSettings = async (shopId:string) => {

            rawSettings.value = await ShopService.fetchShopSettings(shopId);

    }


    const fetchRequests=async()=>{

        if (fetched.value) return
        loading.value = true
        try {
            requests.value = await ShopService.fetchRequests()
            fetched.value = true
        } finally {
            loading.value = false
        }

    }

    const fetchRatingAndReviews=async (shopId:string)=>{

        /*if (fetched.value) return*/
        loading.value = true
        try {
            shop.value = await ShopService.fetchRatingAndReviews(shopId)
            updateShopRating(String(shop.value.id),shop.value.rating,shop.value.reviewsCount)
            fetched.value = true
        } finally {
            loading.value = false
        }

    }
    // ────────────── Action جدید برای آپدیت امتیاز ──────────────
    const updateShopRating = (shopId: string, newRating: number, newReviewsCount: number) => {
        const shopIndex = shops.value.findIndex(s => String(s.id) === String(shopId))

        if (shopIndex !== -1) {
            // آپدیت کردن مقادیر در آرایه واکنشی (Reactive)
            shops.value[shopIndex].rating = newRating
            shops.value[shopIndex].reviewsCount = newReviewsCount
        } else {
            console.warn(`Shop with ID ${shopId} not found in store.`)
        }
    }

    // ────────────── Getters ──────────────
    const getShopById = (id: string): Shop | undefined => {
        return shops.value.find(p => String(p.id) === String(id))
    }

    /**
     * Prepare the shop creation request (Uploads images, builds payload)
     * Does NOT send to server yet.
     */
    const createShopRequest = async (shopData: Partial<Shop>,documents: any): Promise<Partial<Shop>> => {
        loading.value = true
        try {
            // Upload images and prepare payload
            return await ShopService.prepareShopRequest(shopData,documents)
        } catch (error) {
            console.error('Failed to prepare shop request:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    /**
     * Submit the final payload to the server
     */
    const submitShop = async (payload: Partial<Shop>) => {
        loading.value = true
        try {
            const result = await ShopService.submitShopRequest(payload)



            requests.value.push(result.data)

            return result
        } catch (error) {
            //console.error('Failed to submit shop:', error)
            // --- استخراج URLها از payload ---
            let uploadedUrls;
            if (payload.documents && typeof payload.documents === 'object') {
                // تبدیل مقادیر آبجکت documents به آرایه
                const docsArray = Object.values(payload.documents);

                // فیلتر کردن و استخراج thumbnail
                uploadedUrls = docsArray
                    .map((doc: any) => doc?.thumbnail) // گرفتن لینک از هر مدرک
                    .filter(url => url && typeof url === 'string'); // حذف مقادیر خالی یا نامعتبر
            }

            // --- پاکسازی فایل‌ها ---
            if (uploadedUrls.length > 0) {
                console.log('Cleaning up files:', uploadedUrls);
                await ShopService.cleanupFiles(uploadedUrls);
            }
            throw error
        } finally {
            loading.value = false
        }
    }

    // --- متد جدید برای ویرایش ---
    const updateRequest = async (id: string, formData: any) => {
        loading.value = true
        try {
            // جدا کردن داده‌های فرم و مدارک
            const { documents, ...data } = formData

            // فراخوانی سرویس برای آپلود و ارسال
            const updatedRequest = await ShopService.updateShopRequest(id, data, documents)

            // آپدیت کردن لیست لوکال (اختیاری - برای UI سریعتر)
            const index = requests.value.findIndex(r => r.id === id)
            if (index !== -1) {
                requests.value[index] = updatedRequest.data
            }

            return updatedRequest
        } catch (error) {
            console.error('Failed to update request:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    return {
        shops,
        rawSettings,
        shipping,
        shopInfo,
        timeSlots,
        requests,
        shop,
        loading,
        fetched,

        fetchShops,
        fetchRatingAndReviews,
        createShopRequest,
        submitShop,
        updateRequest,
        getShopById,
        fetchRequests,
        fetchShopSettings
    }
})