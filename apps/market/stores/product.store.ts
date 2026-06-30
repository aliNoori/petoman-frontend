import {defineStore} from 'pinia';
import {ref} from 'vue';
import {ProductService} from "../services/product.service";
import {
    Product,
    ProductBrand, ProductFeature,
    ProductImage,
    ProductRelation, ProductReview,
    ProductSeller,
    ProductSpecification,
    ProductVariant
} from "../types/product";

export const useProductStore = defineStore('productStore', () => {
    const products = ref<any[]>([]);
    const product = ref<any | null>(null);
    const bestSellingProducts = ref<any[]>([]);
    const loading = ref(false);
    const fetched = ref(false);
    const { resolveUrl } = useUrlHelper();

    // تابع کمکی برای مپ کردن داده‌های API به اینترفیس Product
    const mapApiToProduct = (apiData: any): Product => {
        // مقادیر پیش‌فرض برای جلوگیری از خطا
        const safeApiData = apiData || {};
        const relatedProducts: ProductRelation[] = [];

        // تبدیل galleryImages
        const galleryImages: ProductImage[] = [];
        if (Array.isArray(safeApiData.galleryImages)) {
            safeApiData.galleryImages.forEach((url: string, index: number) => {
                if (url && typeof url === 'string') {
                    galleryImages.push({
                        id: index + 1,
                        //url: url,
                        url: resolveUrl(url),
                        alt: safeApiData.name || 'محصول'
                    });
                }
            });
        }

        // اضافه کردن تصویر اصلی
        if (safeApiData.image && typeof safeApiData.image === 'string') {
            galleryImages.unshift({
                id: 0,
                //url: safeApiData.image,
                url: resolveUrl(safeApiData.image),
                alt: safeApiData.name || 'محصول'
            });
        }

        // تبدیل features با handle کردن انواع مختلف ساختار
        const features: ProductFeature[] = [];
        if (Array.isArray(safeApiData.features)) {
            safeApiData.features.forEach((feature: any, index: number) => {
                if (feature) {
                    const text = feature.text || feature.name || feature.title || '';
                    if (text) {
                        features.push({
                            id: feature.id || index + 1,
                            text: text
                        });
                    }
                }
            });
        }

        // Convert reviews based on ProductReview interface
        const reviews: ProductReview[] = [];
        if (Array.isArray(safeApiData.reviews)) {
            safeApiData.reviews.forEach((review: any) => {
                if (review) {
                    reviews.push({
                        id: review.id, // id must be number
                        user: String(review.user.fullName || (review.user.firstName + ' ' + review.user.lastName) || ''), // Assuming userId is the user identifier
                        rating: String(review.rating || ''), // rating must be string
                        comment: String(review.comment || ''),
                        likesCount:Number(review.likesCount),
                        dislikesCount:Number(review.dislikesCount),
                        likesByUsers: review.likesByUsers || [], // مقداردهی پیش‌فرض
                        dislikesByUsers: review.dislikesByUsers || [], // مقداردهی پیش‌فرض
                        date: review.createdAt || new Date().toISOString(),
                    });
                }
            });
        }

        // تبدیل specifications
        const specifications: ProductSpecification[] = [];
        if (Array.isArray(safeApiData.specifications)) {
            safeApiData.specifications.forEach((spec: any) => {
                if (spec) {
                    const label = spec.label || spec.key || spec.name || '';
                    const value = spec.value || spec.text || '';
                    if (label && value) {
                        specifications.push({label, value});
                    }
                }
            });
        }

        // تبدیل variants
        const variants: ProductVariant[] = [];
        if (Array.isArray(safeApiData.variants)) {
            safeApiData.variants.forEach((variant: any, index: number) => {
                if (variant) {
                    variants.push({
                        id: variant.id || index + 1,
                        productId: variant?.marketProductId,
                        name: variant.name || `واریانت ${index + 1}`,
                        price: Number(variant.price) || 0,
                        originalPrice: Number(variant.originalPrice) || Number(variant.price) || 0,
                        stock: Number(variant.stock) || 0,
                        attributes: variant.attributes,
                        isActive: variant.isActive,
                        //image: variant.image
                        image: resolveUrl(variant.image)
                    });
                }
            });
        }

        // تبدیل brand
        const brand: ProductBrand = {
            id: safeApiData.brand?.id || 0,
            name: safeApiData.brand?.name || '',
            slug: safeApiData.brand?.slug || ''
        };

        // تبدیل category
        const category = {
            id: safeApiData.category?.id || safeApiData.categoryId || 0,
            name: safeApiData.category?.title || safeApiData.category?.name || '',
            slug: safeApiData.category?.slug || ''
        };

        // تبدیل seller
        const seller: ProductSeller = {
            id: safeApiData.seller?.id || safeApiData.tenantId || 0,
            name: safeApiData.seller?.name || safeApiData.shopName || '',
            rating: parseFloat(safeApiData.seller?.rating || safeApiData.averageRating) || 0,
            productCount: safeApiData.seller?.productCount || 0
        };

        // محاسبه مقادیر عددی
        const price = Number(safeApiData.price) || 0;
        const discountedPrice = Number(safeApiData.discountedPrice) || price;
        const discountValue = Number(safeApiData.discountValue) || 0;
        const hasDiscount = Boolean(safeApiData.hasDiscount);
        const discount = hasDiscount ? discountValue : 0;
        const finalPrice = hasDiscount ? discountedPrice : price;

        // وضعیت موجودی
        const stock = Number(safeApiData.stock) || 0;
        const isActive = Boolean(safeApiData.isActive);
        const available = stock > 0 && isActive;

        if (safeApiData.category?.products && Array.isArray(safeApiData.category.products)) {
            // فیلتر کردن خود محصول و محدود کردن به ۴ محصول
            const filteredProducts = safeApiData.category.products
                .filter((p: any) => p.id !== safeApiData.id)
                .slice(0, 4);

            filteredProducts.forEach((product: any) => {
                // استخراج اطلاعات از ساختار جدید:
                // نام و تصویر از لایه product (خود object)
                const name = product.name || 'محصول مرتبط';
                const image = product.image || (product.galleryImages && product.galleryImages[0]) || '';

                // قیمت و تخفیف از اولین آیتم در آرایه marketProducts
                const marketData = product.marketProducts && product.marketProducts.length > 0
                    ? product.marketProducts[0]
                    : {};

                const price = Number(marketData.price) || 0;
                const discountedPrice = Number(marketData.discountedPrice) || price;
                const hasDiscount = Boolean(marketData.hasDiscount);
                const finalPrice = hasDiscount ? discountedPrice : price;
                const discountValue = Number(marketData.discountValue || 0) || 0;

                relatedProducts.push({
                    id: marketData.id || '',
                    name: name,
                    price: finalPrice,
                    discount: hasDiscount ? discountValue : 0,
                    //image: resolveUrl(image)
                    image: resolveUrl(image)
                });
            });
        }

        return {
            id: String(safeApiData.id || ''),
            name: String(safeApiData.name || ''),
            shopId: Number(safeApiData.shopId || safeApiData.tenantId || 0),
            shop: String(safeApiData.shopName || ''),

            categoryId: Number(safeApiData.categoryId || 0),
            price: finalPrice,
            originalPrice: price,
            discount: discount,
            discountType: safeApiData.discountType,
            available: available,

            rating: parseFloat(safeApiData.averageRating) || 0,

            isFavorite: safeApiData.isFavorite,

            brand: brand,
            category: category,

            reviewCount: Number(safeApiData.reviewsCount) || 0,
            reviews: reviews,
            soldCount: 0,

            description: String(safeApiData.description || ''),

            features: features,
            specifications: specifications,
            //image: safeApiData.image,
            image: resolveUrl(safeApiData.image),
            images: galleryImages,

            variantLabel: variants.length > 0 ? 'انتخاب واریانت' : undefined,
            variants: variants.length > 0 ? variants : undefined,

            seller: seller,

            relatedProducts: relatedProducts
        };
    };

    // Fetch all products
    const fetchProducts = async () => {

        try {
            const rawData = await ProductService.fetchProducts();
            // مپ کردن لیست محصولات
            products.value = rawData.map((item: any) => mapApiToProduct(item));
            fetched.value = true;
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const submitProductReview = async (productId: string, payload: any) => {

        try {
            return await ProductService.submitProductReview(productId, payload)
        } catch (error) {
            console.error('Error fetching products:', error);
        }

    }

    // Get single product by id using computed from products
    const getProductById = (id: string): any | undefined => {
        return products.value.find(p => String(p.id) === String(id));
    };

    // اضافه شده: دریافت پرفروش‌ترین محصولات
    const fetchBestSellingProducts = async () => {
        loading.value = true;
        try {
            const rawData = await ProductService.fetchBestSellingProducts();
            bestSellingProducts.value = rawData.map((item: any) => mapApiToProduct(item));
        } catch (error) {
            console.error('Error fetching best selling products:', error);
        } finally {
            loading.value = false;
        }
    };

    // اضافه شده: لایک یا دیس‌لایک محصول
    const toggleLike = async (productId: string, isLike: boolean) => {
        try {
            const response = await ProductService.toggleLike(productId, isLike);

            // آپدیت کردن لوکال استیت (اختیاری - برای واکنش‌گرایی سریع‌تر)
            const targetProduct = products.value.find(p => p.id === productId);
            if (targetProduct) {
                if (response.action === 'removed') {
                    targetProduct.isFavorite = false;
                    //targetProduct.disliked = false;
                } else if (response.action === 'created' || response.action === 'updated') {
                    targetProduct.isFavorite = isLike;
                    //targetProduct.disliked = !isLike;
                }
            }

            return response;
        } catch (error) {
            console.error('Error toggling like:', error);
            throw error;
        }
    };

    // اضافه شده: دریافت وضعیت لایک یک محصول
    const getLikeStatus = async (productId: string) => {
        try {
            const status = await ProductService.getLikeStatus(productId);

            // آپدیت کردن لوکال استیت
            const targetProduct = products.value.find(p => p.id === productId);
            if (targetProduct) {
                targetProduct.liked = status.liked;
                targetProduct.disliked = status.disliked;
            }

            return status;
        } catch (error) {
            console.error('Error fetching like status:', error);
            throw error;
        }
    };

    const toggleReviewReaction=async ({ product,reviewId, type })=> {

        try {
            const response = await ProductService.toggleReviewReaction({reviewId,type})

            const updatedReview = response.review; // فرض بر این است که سرور کل نظر آپدیت شده را برمی‌گرداند

            // پیدا کردن نظر در لیست محلی و جایگزینی آن با نظر آپدیت شده
            const index = product.reviews.findIndex(r => r.id === reviewId);

            if (index !== -1) {
                // آپدیت دقیق آبجکت نظر با دیتای جدید از سرور
                product.reviews[index] = {
                    ...product.reviews[index],
                    ...updatedReview,
                    // اطمینان از آپدیت فیلدهای آرایه‌ای
                    likesByUsers: updatedReview.likesByUsers || [],
                    dislikesByUsers: updatedReview.dislikesByUsers || []
                };
            }

            return true;
        } catch (error) {
            console.error('Error toggling reaction:', error);
            throw error;
        }
    }

    return {
        products,
        product,
        bestSellingProducts,
        loading,
        fetched,
        toggleLike,
        getLikeStatus,
        fetchProducts,
        getProductById,
        submitProductReview,
        fetchBestSellingProducts,
        toggleReviewReaction
    };
});