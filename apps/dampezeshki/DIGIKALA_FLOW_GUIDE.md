# 🎯 سیستم 3 مرحله‌ای افزودن محصول (سبک دیجیکالا)

## 📋 مراحل فرآیند

### مرحله 1️⃣: انتخاب دسته‌بندی (Category Selection)
```
┌─────────────────────────────────────┐
│  Level 1: دسته اصلی                 │
│  - پت شاپ                           │
│  - داروخانه دامپزشکی                │
│  - لباس و تزئینات                   │
└─────────────────────────────────────┘
           ↓ کلیک روی دسته
┌─────────────────────────────────────┐
│  Level 2: زیردسته                   │
│  - غذای حیوانات                     │
│  - لوازم نگهداری                    │
│  - اسباب بازی                       │
└─────────────────────────────────────┘
           ↓ کلیک روی زیردسته
┌─────────────────────────────────────┐
│  Level 3: دسته نهایی                │
│  - غذای سگ                          │
│  - غذای گربه                        │
│  - غذای پرنده                       │
└─────────────────────────────────────┘
           ↓ کلیک روی دسته نهایی
      رفتن به مرحله 2
```

**ویژگی‌ها:**
- ✅ نمایش سلسله‌مراتبی (Hierarchical)
- ✅ Breadcrumb Navigation (بازگشت به سطوح قبل)
- ✅ آیکون برای هر دسته
- ✅ نمایش تعداد زیردسته‌ها
- ✅ Grid Cards با Hover Effect
- ✅ انتقال خودکار به مرحله بعد پس از انتخاب دسته نهایی

---

### مرحله 2️⃣: جستجوی محصول (Product Search)
```
┌─────────────────────────────────────┐
│  دسته‌بندی انتخاب شده:              │
│  پت شاپ > غذای حیوانات > غذای گربه  │
│                                     │
│  [🔍 جستجو: کنسرو گورمت]           │
│                                     │
│  ⚠️ جستجو الزامی است                │
│  بدون جستجو نمی‌توانید محصول        │
│  اضافه کنید                         │
└─────────────────────────────────────┘
           ↓ تایپ (حداقل 3 حرف)
    جستجو در این دسته‌بندی
           ↓
      رفتن به مرحله 3
```

**ویژگی‌ها:**
- ✅ جستجو **الزامی** (بدون جستجو نمی‌توان محصول اضافه کرد)
- ✅ جستجو فقط در دسته‌بندی انتخاب شده
- ✅ Debounce 400ms
- ✅ Loading State
- ✅ حداقل 3 حرف برای جستجو
- ✅ نمایش دسته‌بندی انتخاب شده
- ✅ دکمه تغییر دسته

---

### مرحله 3️⃣: انتخاب یا ایجاد (Attach or Create)

#### حالت A: محصول پیدا شد ✅
```
┌─────────────────────────────────────┐
│  ✅ 2 محصول مشابه یافت شد            │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 🖼️ کنسرو گورمت طعم گوشت گاو  │ │
│  │ کد: FC-C-GM-123456           │ │
│  │ 3 فروشنده | 850,000 تومان    │ │
│  │            [من هم دارم ✔️]    │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 🖼️ کنسرو گورمت طعم ماهی      │ │
│  │ کد: FC-C-GM-789012           │ │
│  │ 5 فروشنده | 45,000 تومان     │ │
│  │            [من هم دارم ✔️]    │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

**اکشن:** کلیک روی "من هم دارم" → Attach Mode

#### حالت B: محصول پیدا نشد ❌
```
┌─────────────────────────────────────┐
│  ❌ محصول مشابهی یافت نشد            │
│                                     │
│  "کنسرو گورمت طعم میگو"             │
│  در دسته‌بندی "غذای گربه > کنسرو"   │
│  وجود ندارد                         │
│                                     │
│  شما اولین فروشنده این محصول        │
│  خواهید بود                         │
│                                     │
│  [➕ ایجاد محصول جدید]              │
│  [↩️ جستجوی دوباره]                 │
└─────────────────────────────────────┘
```

**اکشن:** کلیک روی "ایجاد محصول جدید" → Create Mode

---

## 🎨 UI Components

### ProgressSteps (نوار پیشرفت)
```vue
<div class="flex items-center justify-between">
  <!-- Step 1: Active -->
  <div class="step active">
    <div class="badge">✓</div>
    <span>انتخاب دسته‌بندی</span>
  </div>
  
  <!-- Step 2: Current -->
  <div class="step current">
    <div class="badge">2</div>
    <span>جستجوی محصول</span>
  </div>
  
  <!-- Step 3: Inactive -->
  <div class="step">
    <div class="badge">3</div>
    <span>انتخاب یا ایجاد</span>
  </div>
</div>
```

**States:**
- `active`: تکمیل شده (تیک سبز)
- `current`: در حال انجام (شماره با پس‌زمینه سبز)
- `inactive`: غیرفعال (شماره خاکستری)

---

## 🔌 API Integration

### 1. دریافت دسته‌بندی‌ها
```typescript
GET /api/categories

Response: Category[]

interface Category {
  id: number
  name: string
  icon?: string
  parentId?: number | null
  children?: Category[]
}
```

**مثال:**
```json
[
  {
    "id": 1,
    "name": "پت شاپ",
    "icon": "🐾",
    "parentId": null,
    "children": [
      {
        "id": 11,
        "name": "غذای حیوانات",
        "icon": "🍖",
        "parentId": 1,
        "children": [
          {
            "id": 111,
            "name": "غذای سگ",
            "parentId": 11,
            "children": [
              { "id": 1111, "name": "غذای خشک سگ", "parentId": 111 },
              { "id": 1112, "name": "کنسرو سگ", "parentId": 111 }
            ]
          }
        ]
      }
    ]
  }
]
```

### 2. جستجوی محصول
```typescript
GET /api/products/search?q={keyword}&categoryId={id}

Parameters:
- q: string (min 3 chars)
- categoryId: number (optional)

Response: Product[]

interface Product {
  id: number
  name: string
  code: string
  category: string
  categoryId: number
  mainImage?: string
  sellerCount: number
  suggestedPrice: number
  avgPrice?: number
}
```

**مثال:**
```bash
# جستجوی "کنسرو" در دسته 1122 (کنسرو گربه)
GET /api/products/search?q=کنسرو&categoryId=1122

# جستجوی عمومی
GET /api/products/search?q=کنسرو
```

---

## 📊 State Management

```typescript
// Current Step
const currentStep = ref(1) // 1 | 2 | 3

// Categories
const categories = ref<Category[]>([])
const selectedPath = ref<Category[]>([]) // Breadcrumb path
const currentCategories = ref<Category[]>([]) // Current level categories

// Search
const searchKeyword = ref('')
const searchResults = ref<Product[]>([])
const isSearching = ref(false)

// Computed
const selectedCategoryId = computed(() => 
  selectedPath.value[selectedPath.value.length - 1]?.id
)

const selectedCategoryName = computed(() => 
  selectedPath.value.map(c => c.name).join(' > ')
)
```

---

## 🎯 Events & Emits

### Component: `ProductSearchOrCreate.vue`

#### Emit 1: `attach-product`
زمانی که فروشنده روی "من هم دارم" کلیک می‌کند

```typescript
emit('attach-product', product: Product)
```

**در Parent Component:**
```typescript
const handleAttachExisting = (product: Product) => {
  mode.value = 'attach'
  formData.value.name = product.name
  formData.value.code = product.code
  formData.value.price = product.suggestedPrice
  // ... show form with read-only product info
}
```

#### Emit 2: `create-product`
زمانی که فروشنده روی "ایجاد محصول جدید" کلیک می‌کند

```typescript
emit('create-product', categoryId: number, keyword: string)
```

**در Parent Component:**
```typescript
const handleCreateNew = (categoryId: number, keyword: string) => {
  mode.value = 'create'
  formData.value.categoryId = categoryId
  formData.value.name = keyword // Pre-fill
  // ... show full form with SEO Builder
}
```

---

## 🔄 Flow Diagram

```
┌──────────────────┐
│  User Opens Page │
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│   Step 1 Start   │  ← Load categories from API
│  Show Categories │
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│ User Selects Cat │
│  Level 1 → 2 → 3 │  ← Breadcrumb updates
└────────┬─────────┘
         │
         ↓ (Leaf category selected)
┌──────────────────┐
│   Step 2 Start   │
│  Show Search Box │
└────────┬─────────┘
         │
         ↓ (Type keyword)
┌──────────────────┐
│  Debounce 400ms  │
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│ API Call Search  │  ← /api/products/search?q=...&categoryId=...
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│   Step 3 Start   │
│  Show Results    │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
    ↓         ↓
[Found]   [Not Found]
    │         │
    ↓         ↓
[من هم دارم] [ایجاد جدید]
    │         │
    ↓         ↓
 Attach     Create
  Mode       Mode
```

---

## 🎨 Tailwind Classes خاص

### Progress Bar
```html
<div class="h-0.5 bg-gray-200">
  <div class="h-full bg-teal-500 transition-all duration-500"
       :style="{ width: `${progress}%` }">
  </div>
</div>
```

### Step Badge
```html
<!-- Active (Completed) -->
<div class="w-10 h-10 bg-teal-500 text-white rounded-full">
  <i class="ti ti-check"></i>
</div>

<!-- Current -->
<div class="w-10 h-10 bg-teal-500 text-white rounded-full">
  <span>2</span>
</div>

<!-- Inactive -->
<div class="w-10 h-10 bg-gray-200 text-gray-500 rounded-full">
  <span>3</span>
</div>
```

### Category Card
```html
<button class="group p-4 bg-gray-50 hover:bg-teal-50 
               border-2 border-gray-200 hover:border-teal-500 
               rounded-xl transition-all">
  <div class="flex items-center justify-between">
    <span class="text-2xl">🐱</span>
    <i class="ti ti-chevron-left text-gray-400 
             group-hover:text-teal-500"></i>
  </div>
  <h4 class="font-bold text-gray-900 group-hover:text-teal-600">
    غذای گربه
  </h4>
</button>
```

### Product Result Card
```html
<div class="p-4 bg-gray-50 hover:bg-teal-50 
            border-2 border-gray-200 hover:border-teal-500 
            rounded-xl">
  <div class="flex items-start gap-4">
    <img class="w-16 h-16 rounded-lg" />
    <div class="flex-1">
      <h4 class="font-bold">نام محصول</h4>
      <p class="text-sm text-gray-600">کد، تعداد فروشنده</p>
    </div>
    <button class="px-4 py-2 bg-teal-600 text-white rounded-lg">
      من هم دارم
    </button>
  </div>
</div>
```

---

## 🔧 کد کامل استفاده

### در `add-shop.vue`
```vue
<template>
  <div>
    <!-- Step 1, 2, 3: Search & Select -->
    <ProductSearchOrCreate 
      v-if="mode === 'search'"
      @attach-product="handleAttachExisting"
      @create-product="handleCreateNew"
    />

    <!-- Form (Attach or Create) -->
    <div v-else>
      <ProductForm :mode="mode" :formData="formData" />
    </div>
  </div>
</template>

<script setup lang="ts">
const mode = ref<'search' | 'attach' | 'create'>('search')

const handleAttachExisting = (product: Product) => {
  mode.value = 'attach'
  // Pre-fill form with existing product data
}

const handleCreateNew = (categoryId: number, keyword: string) => {
  mode.value = 'create'
  // Show full form with SEO Builder
}
</script>
```

---

## ⚠️ قوانین مهم

### 🔍 جستجو الزامی است
- **هیچ فروشنده‌ای نمی‌تواند بدون جستجو محصول اضافه کند**
- فروشنده باید ابتدا جستجو کند تا مشخص شود محصول از قبل وجود دارد یا خیر
- اگر محصول یافت شد → باید به آن Attach شود
- اگر محصول یافت نشد → می‌تواند محصول جدید ایجاد کند
- این قانون از تکرار محصولات جلوگیری می‌کند

### 🎯 چرا جستجو الزامی است؟
1. **جلوگیری از تکرار**: محصولات تکراری در سیستم ایجاد نمی‌شود
2. **یکپارچگی داده**: همه فروشندگان به یک محصول متصل می‌شوند
3. **تجربه خریدار بهتر**: خریدار همه فروشندگان یک محصول را در یک صفحه می‌بیند
4. **مدیریت آسان‌تر**: اطلاعات محصول یکپارچه و قابل مدیریت است

---

## 📝 نکات مهم

### 1. Breadcrumb Navigation
```typescript
const goToLevel = (index: number) => {
  // Trim path to selected level
  selectedPath.value = selectedPath.value.slice(0, index + 1)
  
  // Show children of selected category
  const parent = selectedPath.value[index]
  currentCategories.value = parent.children || []
}
```

### 2. Category Selection Logic
```typescript
const selectCategory = (category: Category) => {
  selectedPath.value.push(category)
  
  if (category.children && category.children.length > 0) {
    // Has children → show next level
    currentCategories.value = category.children
  } else {
    // Leaf category → go to search
    currentStep.value = 2
  }
}
```

### 3. Search with Category Filter
```typescript
const searchProducts = async () => {
  const params = new URLSearchParams({
    q: searchKeyword.value,
    categoryId: selectedCategoryId.value?.toString() || ''
  })
  
  const response = await $fetch(`/api/products/search?${params}`)
  searchResults.value = response
  currentStep.value = 3 // Go to results
}
```

### 4. Pre-fill Product Name
```typescript
// When creating new product, pre-fill name with search keyword
const handleCreateNew = (categoryId: number, keyword: string) => {
  formData.value.name = keyword
  formData.value.categoryId = categoryId
  // This helps seller start with their search term
}
```

---

## 🚀 مزایای این رویکرد

### ✅ برای فروشنده
- **سرعت بالا**: نیازی به جستجوی دستی در همه دسته‌ها نیست
- **دقت بیشتر**: فقط محصولات مرتبط با دسته انتخابی نمایش داده می‌شود
- **UX بهتر**: جریان واضح و گام‌به‌گام مثل دیجیکالا

### ✅ برای سیستم
- **کاهش نتایج نامرتبط**: جستجو محدود به دسته‌بندی
- **بهبود Performance**: کوئری‌های دیتابیس سریع‌تر (با فیلتر categoryId)
- **داده‌های بهتر**: دسته‌بندی صحیح از همان ابتدا

### ✅ برای خریدار
- **دسته‌بندی دقیق**: محصولات در جای درست قرار دارند
- **مقایسه آسان**: محصولات هم‌دسته را راحت مقایسه می‌کند

---

## 📦 فایل‌های مرتبط

```
apps/dampezeshki/
├── components/
│   └── ProductSearchOrCreate.vue       ← کامپوننت اصلی 3 مرحله‌ای
├── pages/
│   └── panel/pharmacies/products/
│       └── add-shop.vue                ← صفحه افزودن محصول
├── server/
│   └── api/
│       ├── categories.get.ts           ← API دسته‌بندی‌ها
│       └── products/
│           └── search.get.ts           ← API جستجوی محصول (با categoryId)
└── DIGIKALA_FLOW_GUIDE.md              ← این مستند
```

---

## 🎓 مثال واقعی

### Scenario: فروشنده می‌خواهد کنسرو گربه اضافه کند

```
1️⃣ Step 1: انتخاب دسته‌بندی
   ✓ کلیک روی "پت شاپ"
   ✓ کلیک روی "غذای حیوانات"
   ✓ کلیک روی "غذای گربه"
   ✓ کلیک روی "کنسرو گربه"
   → انتقال خودکار به Step 2

2️⃣ Step 2: جستجوی محصول (الزامی)
   ✓ پیام: "جستجوی محصول الزامی است"
   ✓ تایپ: "گورمت"
   ✓ انتظار 400ms (Debounce)
   ✓ ارسال: GET /api/products/search?q=گورمت&categoryId=1122
   → انتقال خودکار به Step 3

3️⃣ Step 3: نتایج
   
   حالت A: 2 نتیجه پیدا شد
   ┌─────────────────────────────────┐
   │ کنسرو گورمت طعم گوشت گاو        │
   │ [من هم دارم] ← کلیک             │
   └─────────────────────────────────┘
   → Attach Mode: فقط قیمت و موجودی

   حالت B: نتیجه‌ای پیدا نشد
   ┌─────────────────────────────────┐
   │ محصول مشابهی یافت نشد            │
   │ [ایجاد محصول جدید] ← کلیک       │
   └─────────────────────────────────┘
   → Create Mode: فرم کامل با SEO Builder
```

---

**نسخه**: 2.0.0  
**تاریخ**: 2025-01-21  
**وضعیت**: ✅ کامل و آماده استفاده
