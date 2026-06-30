# 🔧 رفع مشکل نمایش قیمت نهایی

## مشکل
قیمت نهایی فقط زمانی نمایش داده می‌شد که **تخفیف فعال** بود. اگر تخفیف غیرفعال می‌شد، باکس قیمت نهایی کاملاً ناپدید می‌شد.

## علت
باکس نمایش قیمت نهایی داخل شرط `v-if="formData.hasDiscount"` قرار داشت:

```vue
<!-- ❌ کد قبلی -->
<div v-if="formData.hasDiscount" class="animate-fadeIn space-y-4">
  <!-- فیلدهای تخفیف -->
  ...
  
  <!-- باکس قیمت نهایی -->
  <div class="p-4 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-xl">
    <div class="space-y-2">
      <div>قیمت اصلی: ...</div>
      <div>میزان تخفیف: ...</div>
      <div>قیمت نهایی: ...</div>
    </div>
  </div>
</div>
```

## راه‌حل
باکس قیمت نهایی را **خارج** از شرط `v-if` منتقل کردیم تا همیشه نمایش داده شود:

```vue
<!-- ✅ کد جدید -->
<div v-if="formData.hasDiscount" class="animate-fadeIn space-y-4">
  <!-- فیلدهای تخفیف -->
  ...
</div>

<!-- باکس قیمت نهایی (همیشه نمایش داده می‌شود) -->
<div class="p-4 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-xl">
  <div class="space-y-2">
    <div>قیمت اصلی: ...</div>
    <div v-if="formData.hasDiscount">میزان تخفیف: ...</div>
    <div v-if="formData.hasDiscount" class="h-px bg-green-300 my-2"></div>
    <div>قیمت نهایی: ...</div>
  </div>
</div>
```

## تغییرات دقیق

### 1. جدا کردن فیلدهای تخفیف از باکس قیمت
- فیلدهای تخفیف (نوع تخفیف + مقدار) → داخل `v-if="formData.hasDiscount"`
- باکس قیمت نهایی → خارج از شرط (همیشه نمایش)

### 2. شرطی کردن اطلاعات تخفیف در باکس قیمت
```vue
<!-- فقط اگر تخفیف فعال است، میزان تخفیف نمایش داده شود -->
<div v-if="formData.hasDiscount" class="flex items-center justify-between text-sm">
  <span class="text-gray-600">میزان تخفیف:</span>
  <span class="font-bold text-red-600">
    {{ formData.discountType === 'percent' 
      ? `${formData.discountValue || 0}%` 
      : `${new Intl.NumberFormat('fa-IR').format(formData.discountValue || 0)} تومان` 
    }}
  </span>
</div>

<!-- خط جدا کننده فقط با تخفیف -->
<div v-if="formData.hasDiscount" class="h-px bg-green-300 my-2"></div>
```

### 3. قیمت نهایی همیشه نمایش داده می‌شود
```vue
<!-- این بخش شرط ندارد و همیشه نمایش داده می‌شود -->
<div class="flex items-center justify-between">
  <span class="text-gray-700 font-bold">قیمت نهایی:</span>
  <span class="text-xl font-bold text-green-600">
    {{ new Intl.NumberFormat('fa-IR').format(discountedPrice) }} تومان
  </span>
</div>
```

## نتیجه

### ✅ بدون تخفیف:
```
┌─────────────────────────────────────┐
│ قیمت اصلی:       100,000 تومان     │
│                                     │
│ قیمت نهایی:      100,000 تومان     │
└─────────────────────────────────────┘
```

### ✅ با تخفیف 20%:
```
┌─────────────────────────────────────┐
│ قیمت اصلی:       100,000 تومان     │
│ میزان تخفیف:            20%        │
│ ─────────────────────────────────── │
│ قیمت نهایی:       80,000 تومان     │
└─────────────────────────────────────┘
```

### ✅ با تخفیف ثابت 15,000 تومان:
```
┌─────────────────────────────────────┐
│ قیمت اصلی:       100,000 تومان     │
│ میزان تخفیف:     15,000 تومان     │
│ ─────────────────────────────────── │
│ قیمت نهایی:       85,000 تومان     │
└─────────────────────────────────────┘
```

## محاسبه قیمت نهایی

محاسبه در `computed` به درستی انجام می‌شود:

```javascript
const discountedPrice = computed(() => {
  const raw = String(formData.value.price || '').replace(/,/g, '')
  const priceNum = parseFloat(raw) || 0
  
  // بدون تخفیف → قیمت اصلی
  if (!priceNum || !formData.value.hasDiscount) return priceNum

  const type = formData.value.discountType
  const val = parseFloat(formData.value.discountValue) || 0

  if (val <= 0) return priceNum

  // تخفیف درصدی
  if (type === 'percent') {
    const pct = Math.min(Math.max(val, 0), 100)
    return Math.max(0, Math.round(priceNum * (1 - pct / 100)))
  }

  // تخفیف ثابت
  return Math.max(0, Math.round(priceNum - val))
})
```

**نکته:** وقتی `hasDiscount` غیرفعال است، `discountedPrice` برابر با قیمت اصلی است.

## فایل تغییر یافته
- `apps/market/pages/panel/pet-shops/products/add-shop.vue`

## تاریخ
- **26 اکتبر 2025** - رفع مشکل نمایش قیمت نهایی

## تست

### سناریو 1: بدون تخفیف
1. وارد کردن قیمت: 100,000
2. toggle تخفیف: OFF
3. ✅ باکس قیمت نهایی نمایش داده شود
4. ✅ قیمت نهایی = 100,000

### سناریو 2: با تخفیف درصدی
1. وارد کردن قیمت: 100,000
2. toggle تخفیف: ON
3. نوع: درصدی
4. مقدار: 20
5. ✅ میزان تخفیف: 20%
6. ✅ قیمت نهایی: 80,000

### سناریو 3: با تخفیف ثابت
1. وارد کردن قیمت: 100,000
2. toggle تخفیف: ON
3. نوع: مبلغ ثابت
4. مقدار: 15,000
5. ✅ میزان تخفیف: 15,000 تومان
6. ✅ قیمت نهایی: 85,000

### سناریو 4: تغییر وضعیت تخفیف
1. وارد کردن قیمت: 100,000
2. toggle تخفیف: ON
3. مقدار: 20%
4. قیمت نهایی: 80,000 ✅
5. toggle تخفیف: OFF
6. ✅ باکس قیمت نهایی همچنان نمایش داده شود
7. ✅ قیمت نهایی: 100,000

---

## 🎉 مشکل رفع شد!

قیمت نهایی حالا **همیشه** نمایش داده می‌شود، صرف نظر از وضعیت تخفیف.
