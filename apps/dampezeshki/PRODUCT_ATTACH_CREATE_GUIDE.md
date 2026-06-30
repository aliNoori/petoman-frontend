# سیستم Attach/Create محصولات

## 🎯 هدف
قبل از افزودن محصول توسط فروشنده، سیستم بررسی می‌کند که آیا محصول در دیتابیس وجود دارد یا خیر:
- **اگر وجود دارد** → فروشنده فقط به آن محصول متصل می‌شود (Attach)
- **اگر وجود ندارد** → محصول جدید ایجاد می‌شود (Create)

---

## 📋 جریان کار (Workflow)

### 1️⃣ صفحه افزودن محصول (`add-shop.vue`)
```
┌─────────────────────────────────────┐
│    مرحله 1: جستجوی محصول          │
│    - جستجو با حداقل 3 حرف          │
│    - نمایش محصولات مشابه            │
│    - انتخاب محصول موجود یا ایجاد   │
└─────────────────────────────────────┘
           ↓                ↓
    [محصول پیدا شد]    [محصول پیدا نشد]
           ↓                ↓
┌──────────────────┐  ┌──────────────────┐
│  مرحله 2A:      │  │  مرحله 2B:      │
│  حالت Attach     │  │  حالت Create     │
│                  │  │                  │
│  - نام/کد ثابت   │  │  - SEO Builder   │
│  - تعیین قیمت     │  │  - ساخت محصول   │
│  - موجودی         │  │  - تعیین قیمت    │
└──────────────────┘  └──────────────────┘
           ↓                ↓
    [ثبت نهایی]        [ثبت نهایی]
```

---

## 🔍 کامپوننت ProductSearchOrCreate

### ⚠️ قانون مهم: جستجو الزامی است
**فروشنده نمی‌تواند بدون جستجو محصول اضافه کند**
- هدف: جلوگیری از ایجاد محصولات تکراری
- جریان: جستجو → یافت شد (Attach) یا نیافت (Create)

### ویژگی‌ها
- **جستجوی Real-time**: با Debounce 400ms
- **جستجوی الزامی**: بدون جستجو امکان افزودن محصول نیست
- **نمایش نتایج**: اطلاعات کامل محصول + تعداد فروشنده
- **قیمت پیشنهادی**: میانگین قیمت بازار
- **انتخاب محصول**: دکمه "من هم دارم" برای Attach
- **ایجاد جدید**: فقط در صورت عدم یافتن محصول در جستجو

### Props & Emits
```vue
// Emits
emit('attach-existing', product) // محصول موجود انتخاب شد
emit('create-new')                // ایجاد محصول جدید
```

### نمونه کد
```vue
<ProductSearchOrCreate 
  @attach-existing="handleAttachExisting"
  @create-new="handleCreateNew"
/>
```

---

## 🎨 حالت‌های صفحه (Mode)

### Mode: `search` (پیش‌فرض)
```javascript
mode.value = 'search'
```
- نمایش کامپوننت جستجو
- فرم محصول مخفی است

### Mode: `attach`
```javascript
mode.value = 'attach'
attachedProduct.value = selectedProduct
```
- نمایش اطلاعات محصول موجود (read-only)
- SEO Builder مخفی است
- فقط قیمت، موجودی، توضیحات قابل ویرایش

### Mode: `create`
```javascript
mode.value = 'create'
```
- نمایش SEO Builder کامل
- فرم خالی برای محصول جدید
- تمام فیلدها قابل ویرایش

---

## 🔌 API Endpoints

### 1. جستجوی محصول
```typescript
GET /api/products/search?q={query}

// Response
[
  {
    id: 1,
    name: "کنسرو گورمت مدل گربه...",
    code: "FC-C-GM-123456",
    category: "پت شاپ > غذا > غذای گربه > کنسرو",
    mainImage: "...",
    sellerCount: 3,
    suggestedPrice: 850000,
    avgPrice: 820000
  }
]
```

### 2. اتصال به محصول موجود (Attach)
```typescript
POST /api/products/attach

// Body
{
  productId: 1,
  sellerId: 123,
  price: 850000,
  stock: 10,
  description: "...",
  isActive: true
}

// Response
{
  success: true,
  message: "Seller attached to product successfully",
  data: { ... }
}
```

### 3. ایجاد محصول جدید (Create)
```typescript
POST /api/products/create

// Body
{
  name: "کنسرو گورمت...",
  code: "FC-C-GM-123456",
  category: "...",
  price: 850000,
  stock: 10,
  description: "...",
  mainImage: File,
  gallery: [File, File, ...],
  isActive: true,
  type: "shop"
}

// Response
{
  success: true,
  message: "Product created successfully",
  data: {
    product: { ... },
    sellerProduct: { ... }
  }
}
```

---

## 💾 ساختار دیتابیس پیشنهادی

### جدول Products (محصولات اصلی)
```prisma
model Product {
  id                Int      @id @default(autoincrement())
  name              String   // نام محصول
  code              String   @unique // کد محصول
  category          String?  // دسته‌بندی
  categoryBreadcrumb String? // مسیر دسته‌بندی
  description       String?  // توضیحات عمومی
  mainImage         String?  // تصویر اصلی
  gallery           Json?    // گالری تصاویر
  type              String   // shop | medicine
  
  sellers           SellerProduct[] // فروشنده‌های این محصول
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

### جدول SellerProducts (محصولات هر فروشنده)
```prisma
model SellerProduct {
  id          Int      @id @default(autoincrement())
  productId   Int      // ارجاع به محصول اصلی
  sellerId    Int      // ارجاع به فروشنده
  
  price       Int      // قیمت فروشنده
  stock       Int      // موجودی فروشنده
  description String?  // توضیحات اختصاصی فروشنده
  isActive    Boolean  @default(true)
  
  product     Product  @relation(fields: [productId], references: [id])
  seller      User     @relation(fields: [sellerId], references: [id])
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@unique([productId, sellerId]) // یک فروشنده فقط یک بار محصول اضافه کند
}
```

---

## 🎯 مزایای این سیستم

### ✅ برای خریداران
- **تنوع قیمت**: چندین فروشنده برای یک محصول
- **مقایسه آسان**: قیمت‌ها در یک صفحه
- **اطلاعات یکسان**: نام و مشخصات استاندارد

### ✅ برای فروشندگان
- **سرعت بالا**: عدم نیاز به تکمیل فرم کامل برای محصولات موجود
- **دقت بیشتر**: کاهش خطا در نام‌گذاری
- **قیمت پیشنهادی**: مشاهده میانگین بازار

### ✅ برای سیستم
- **کاهش تکرار**: یک محصول = یک رکورد اصلی
- **مدیریت آسان**: ویرایش مرکزی اطلاعات محصول
- **آمار دقیق**: تعداد فروشندگان هر محصول

---

## 🚀 نحوه استفاده

### 1. برای فروشنده
```
1. وارد صفحه "افزودن محصول" شوید
2. دسته‌بندی محصول را انتخاب کنید (3 سطح)
3. نام محصول را جستجو کنید (الزامی - حداقل 3 حرف)
4. منتظر نتایج بمانید:
   
   حالت A - محصول پیدا شد:
   - روی دکمه "من هم دارم" کلیک کنید
   - قیمت و موجودی خود را تعیین کنید
   - ذخیره کنید
   
   حالت B - محصول پیدا نشد:
   - دکمه "ایجاد محصول جدید" نمایش داده می‌شود
   - روی آن کلیک کنید
   - فرم کامل را پر کنید (با SEO Builder)
   - ذخیره کنید

⚠️ نکته: بدون جستجو امکان افزودن محصول وجود ندارد
```

### 2. برای توسعه‌دهنده Backend
```typescript
// در API Attach
async function attachSeller(productId, sellerId, data) {
  // 1. بررسی وجود محصول
  const product = await db.product.findUnique({
    where: { id: productId }
  })
  
  if (!product) {
    throw new Error('Product not found')
  }
  
  // 2. بررسی تکراری نبودن
  const existing = await db.sellerProduct.findUnique({
    where: {
      productId_sellerId: {
        productId,
        sellerId
      }
    }
  })
  
  if (existing) {
    throw new Error('Seller already attached to this product')
  }
  
  // 3. ایجاد رابطه
  return await db.sellerProduct.create({
    data: {
      productId,
      sellerId,
      price: data.price,
      stock: data.stock,
      description: data.description,
      isActive: data.isActive
    }
  })
}
```

---

## 📊 مثال کاربردی

### سناریو: فروشگاه A می‌خواهد کنسرو گورمت اضافه کند

#### حالت 1: محصول موجود است
```
1. انتخاب دسته: پت شاپ > غذای حیوانات > غذای گربه > کنسرو گربه
2. جستجو: "کنسرو گورمت" (الزامی - حداقل 3 حرف)
3. نتیجه: 
   - کنسرو گورمت مدل گربه طعم گوشت گاو
   - 3 فروشنده فعلی
   - قیمت پیشنهادی: 850,000 تومان
4. اقدام: کلیک روی "من هم دارم"
5. فرم Attach:
   - نام و کد: ثابت (غیرقابل تغییر)
   - قیمت: 850,000 تومان
   - موجودی: 15 عدد
6. ثبت → فروشنده A به عنوان فروشنده چهارم اضافه شد ✅
```

#### حالت 2: محصول جدید است
```
1. انتخاب دسته: پت شاپ > غذای حیوانات > غذای گربه > کنسرو گربه
2. جستجو: "کنسرو گورمت طعم میگو" (الزامی)
3. نتیجه: محصول مشابهی یافت نشد
4. اقدام: کلیک روی "ایجاد محصول جدید"
5. فرم Create:
   - نام: "کنسرو گورمت طعم میگو" (پیش‌پر شده از جستجو)
   - کد: تولید خودکار با SEO Builder
   - دسته: کنسرو گربه (از انتخاب قبلی)
   - تصاویر: آپلود گالری
   - قیمت: 95,000 تومان
   - موجودی: 20 عدد
6. ثبت → محصول جدید ایجاد شد + فروشنده A اولین فروشنده آن است ✅

⚠️ توجه: در هر دو حالت، جستجو الزامی بود
```

---

## 🔧 تنظیمات و سفارشی‌سازی

### تغییر حداقل طول جستجو
```javascript
// در ProductSearchOrCreate.vue
const handleSearch = () => {
  if (searchQuery.value.length < 5) { // تغییر از 3 به 5
    foundProducts.value = []
    return
  }
  // ...
}
```

### تغییر Debounce Time
```javascript
searchTimeout = setTimeout(() => {
  searchProducts()
}, 600) // تغییر از 400 به 600ms
```

### غیرفعال کردن قیمت پیشنهادی
```vue
<!-- حذف این بخش از template -->
<span v-if="product.avgPrice" class="text-xs text-gray-500">
  میانگین بازار: {{ formatPrice(product.avgPrice) }} تومان
</span>
```

---

## 📝 TODO List

### Frontend
- [ ] اتصال به API واقعی (فعلاً Mock است)
- [ ] مدیریت آپلود تصاویر در حالت Attach
- [ ] نمایش پیام موفقیت با Toast
- [ ] مدیریت خطاها با UI بهتر

### Backend
- [ ] پیاده‌سازی Prisma Models
- [ ] ساخت API Endpoints واقعی
- [ ] اضافه کردن Authentication
- [ ] محاسبه قیمت میانگین بازار
- [ ] مدیریت آپلود تصاویر

### Database
- [ ] ایجاد جداول Products و SellerProducts
- [ ] ایجاد Indexes برای سرعت جستجو
- [ ] ایجاد Migration Files
- [ ] تنظیم Relations

---

## 🎓 نکات مهم

### 1. یکتایی کد محصول
کد محصول باید Unique باشد. در حالت Create بررسی شود که قبلاً وجود نداشته باشد.

### 2. جلوگیری از Attach تکراری
هر فروشنده فقط یک بار می‌تواند به یک محصول متصل شود.

### 3. قیمت پیشنهادی
قیمت پیشنهادی برای کمک به فروشنده است و الزامی نیست.

### 4. مدیریت تصاویر
در حالت Attach، تصاویر محصول اصلی استفاده می‌شود. فروشنده نمی‌تواند تصویر اختصاصی داشته باشد.

### 5. توضیحات فروشنده
هر فروشنده می‌تواند توضیحات اختصاصی خود را برای محصول اضافه کند.

---

## 📞 پشتیبانی

اگر سوالی دارید:
- کد کامل در: `apps/dampezeshki/pages/panel/pharmacies/products/add-shop.vue`
- کامپوننت جستجو: `apps/dampezeshki/components/ProductSearchOrCreate.vue`
- API ها: `apps/dampezeshki/server/api/products/`

---

**نسخه**: 1.0.0  
**تاریخ**: 2025-01-21  
**وضعیت**: ✅ آماده برای توسعه Backend
