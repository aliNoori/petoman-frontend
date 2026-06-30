<template>
  <div class="space-y-6 pb-24 md:pb-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">مدیریت محصولات</h1>
        <p class="text-gray-500 mt-1">مشاهده و تأیید محصولات فروشگاه‌ها و داروخانه‌ها</p>
      </div>
      <button @click="exportToExcel" class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
        <i class="ti ti-file-spreadsheet"></i>
        خروجی اکسل
      </button>
    </div>

    <!-- Tabs -->
    <div class="bg-white rounded-xl border border-gray-200 p-1.5">
      <div class="flex gap-1">
        <button 
          @click="activeTab = 'market'"
          class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
          :class="activeTab === 'market' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
        >
          <i class="ti ti-building-store"></i>
          <span>محصولات پت‌شاپ‌ها</span>
          <span class="px-2 py-0.5 rounded-full text-xs" :class="activeTab === 'market' ? 'bg-white/20' : 'bg-gray-200'">
            {{ marketProducts.length }}
          </span>
        </button>
        <button 
          @click="activeTab = 'pharmacy'"
          class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
          :class="activeTab === 'pharmacy' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
        >
          <i class="ti ti-pill"></i>
          <span>محصولات داروخانه‌ها</span>
          <span class="px-2 py-0.5 rounded-full text-xs" :class="activeTab === 'pharmacy' ? 'bg-white/20' : 'bg-gray-200'">
            {{ pharmacyProducts.length }}
          </span>
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl border border-gray-200 p-4">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1 relative">
          <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input 
            v-model="search"
            type="text" 
            placeholder="جستجو در محصولات..." 
            class="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <AppSelect
          v-model="statusFilter"
          :options="statusOptions"
          placeholder="وضعیت"
          class="w-full md:w-48"
        />
        <AppSelect
          v-model="categoryFilter"
          :options="activeTab === 'market' ? marketCategories : pharmacyCategories"
          placeholder="دسته‌بندی"
          class="w-full md:w-48"
        />
      </div>
    </div>

    <!-- Market Products Tab -->
    <div v-if="activeTab === 'market'" class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

      <!-- Desktop Table View -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full text-right">
          <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="py-4 px-5 text-sm font-bold text-gray-700">محصول</th>
            <th class="py-4 px-5 text-sm font-bold text-gray-700">فروشگاه</th>
            <th class="py-4 px-5 text-sm font-bold text-gray-700">دسته‌بندی</th>
            <th class="py-4 px-5 text-sm font-bold text-gray-700">قیمت</th>
            <th class="py-4 px-5 text-sm font-bold text-gray-700">موجودی</th>
            <th class="py-4 px-5 text-sm font-bold text-gray-700">وضعیت</th>
            <th class="py-4 px-5 text-sm font-bold text-gray-700">تاریخ ثبت</th>
            <th class="py-4 px-5 text-center text-sm font-bold text-gray-700">عملیات</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
          <tr v-for="product in filteredMarketProducts" :key="product.id" class="hover:bg-gray-50 transition-colors">
            <!-- Product Info -->
            <td class="py-4 px-5">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                  <img :src="resolveUrl(product.image)" :alt="product.name" class="w-full h-full object-cover" />
                </div>
                <div class="min-w-0">
                  <p class="font-bold text-gray-900 truncate max-w-[150px]" :title="product.name">{{ product.name }}</p>
                  <p class="text-xs text-gray-500 truncate" :title="product.brand">{{ product.brand }}</p>
                </div>
              </div>
            </td>

            <!-- Shop Info -->
            <td class="py-4 px-5">
              <p class="font-medium text-gray-900 text-sm">{{ product.shopName }}</p>
              <p class="text-xs text-gray-500">{{ product.ownerName }}</p>
            </td>

            <!-- Category -->
            <td class="py-4 px-5">
            <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
              {{ product.category }}
            </span>
            </td>

            <!-- Price & Discount -->
            <td class="py-4 px-5">
              <div class="flex flex-col items-end">
                <p class="font-bold text-gray-900 text-sm">{{ formatPrice(product.price) }}</p>
                <p v-if="product.discount" class="text-xs text-red-500 line-through mt-0.5">
                  {{ formatPrice(product.originalPrice) }}
                </p>
              </div>
            </td>

            <!-- Stock -->
            <td class="py-4 px-5">
            <span
                class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium"
                :class="product.stock > 10 ? 'bg-green-50 text-green-700 border border-green-100' : product.stock > 0 ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' : 'bg-red-50 text-red-700 border border-red-100'"
            >
              {{ product.stock > 0 ? product.stock + ' عدد' : 'ناموجود' }}
            </span>
            </td>

            <!-- Status -->
            <td class="py-4 px-5">
            <span
                class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold"
                :class="getStatusClass(product.status)"
            >
              {{ getStatusLabel(product.status) }}
            </span>
            </td>

            <!-- Date -->
            <td class="py-4 px-5 text-sm text-gray-500">
              {{ product.createdAt }}
            </td>

            <!-- Actions -->
            <td class="py-4 px-5">
              <div class="flex items-center justify-center gap-2">
                <button @click="viewProduct(product)" class="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="مشاهده">
                  <i class="ti ti-eye text-lg"></i>
                </button>
                <button
                    v-if="product.status === 'pending'"
                    @click="approveProduct(product)"
                    class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="تأیید"
                >
                  <i class="ti ti-check text-lg"></i>
                </button>
                <button
                    v-if="product.status === 'pending'"
                    @click="openRejectModal(product)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="رد"
                >
                  <i class="ti ti-x text-lg"></i>
                </button>
                <button @click="deleteProduct(product)" class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="حذف">
                  <i class="ti ti-trash text-lg"></i>
                </button>
              </div>
            </td>
          </tr>

          <!-- Empty State Table -->
          <tr v-if="filteredMarketProducts.length === 0">
            <td colspan="8" class="py-16 text-center">
              <div class="flex flex-col items-center justify-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <i class="ti ti-package-off text-3xl text-gray-400"></i>
                </div>
                <p class="text-gray-500 font-medium">محصولی یافت نشد</p>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Card View -->
      <div class="md:hidden p-4 space-y-4">
        <div v-for="product in filteredMarketProducts" :key="product.id" class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <!-- Header: Image & Name -->
          <div class="flex gap-3 mb-3">
            <div class="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
              <img :src="resolveUrl(product.image)" :alt="product.name" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-gray-900 text-sm mb-1 line-clamp-1">{{ product.name }}</h3>
              <p class="text-xs text-gray-500 mb-1">{{ product.shopName }}</p>
              <p class="text-xs text-gray-400">{{ product.createdAt }}</p>
              <p class="text-xs text-gray-400">{{ product.brand }}</p>
            </div>
          </div>

          <!-- Grid Details -->
          <div class="grid grid-cols-2 gap-3 mb-4 text-xs">
            <div class="bg-gray-50 p-2 rounded-lg">
              <span class="text-gray-500 block mb-1">قیمت:</span>
              <span class="font-bold text-gray-900">{{ formatPrice(product.price) }}</span>
              <p v-if="product.discount" class="text-[10px] text-red-500 line-through mt-0.5">
                {{ formatPrice(product.originalPrice) }}
              </p>
            </div>
            <div class="bg-gray-50 p-2 rounded-lg">
              <span class="text-gray-500 block mb-1">دسته‌بندی:</span>
              <span class="font-medium text-gray-700">{{ product.category }}</span>
            </div>
            <div class="bg-gray-50 p-2 rounded-lg">
              <span class="text-gray-500 block mb-1">موجودی:</span>
              <span
                  class="font-medium"
                  :class="product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'"
              >
            {{ product.stock > 0 ? product.stock + ' عدد' : 'ناموجود' }}
          </span>
            </div>
            <div class="bg-gray-50 p-2 rounded-lg">
              <span class="text-gray-500 block mb-1">وضعیت:</span>
              <span
                  class="font-medium"
                  :class="getStatusClass(product.status, true)"
              >
            {{ getStatusLabel(product.status) }}
          </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between pt-3 border-t border-gray-100">
            <div class="flex gap-2">
              <button @click="viewProduct(product)" class="p-2 text-gray-500 hover:bg-gray-100 rounded-lg" title="مشاهده">
                <i class="ti ti-eye"></i>
              </button>
              <button
                  v-if="product.status === 'pending'"
                  @click="approveProduct(product)"
                  class="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                  title="تأیید"
              >
                <i class="ti ti-check"></i>
              </button>
              <button
                  v-if="product.status === 'pending'"
                  @click="openRejectModal(product)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="رد"
              >
                <i class="ti ti-x"></i>
              </button>
              <button @click="deleteProduct(product)" class="p-2 text-red-400 hover:bg-red-50 rounded-lg" title="حذف">
                <i class="ti ti-trash"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State Mobile -->
        <div v-if="filteredMarketProducts.length === 0" class="text-center py-12">
          <div class="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <i class="ti ti-package-off text-3xl text-gray-400"></i>
          </div>
          <p class="text-gray-500 font-medium">محصولی یافت نشد</p>
        </div>
      </div>
    </div>
    <!-- Pharmacy Products Tab -->
    <div v-if="activeTab === 'pharmacy'" class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

      <!-- Desktop Table View -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full text-right">
          <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="py-4 px-5 text-sm font-bold text-gray-700">محصول/دارو</th>
            <th class="py-4 px-5 text-sm font-bold text-gray-700">داروخانه</th>
            <th class="py-4 px-5 text-sm font-bold text-gray-700">دسته‌بندی</th>
            <th class="py-4 px-5 text-sm font-bold text-gray-700">قیمت</th>
            <th class="py-4 px-5 text-sm font-bold text-gray-700">موجودی</th>
            <th class="py-4 px-5 text-sm font-bold text-gray-700">نسخه‌ای</th>
            <th class="py-4 px-5 text-sm font-bold text-gray-700">وضعیت</th>
            <th class="py-4 px-5 text-sm font-bold text-gray-700">تاریخ ثبت</th>
            <th class="py-4 px-5 text-center text-sm font-bold text-gray-700">عملیات</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
          <tr v-for="product in filteredPharmacyProducts" :key="product.id" class="hover:bg-gray-50 transition-colors">
            <!-- Product Info -->
            <td class="py-4 px-5">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                  <img :src="resolveUrl(product.image)" :alt="product.name" class="w-full h-full object-cover" />
                </div>
                <div class="min-w-0">
                  <p class="font-bold text-gray-900 truncate max-w-[150px]" :title="product.name">{{ product.name }}</p>
                  <p class="text-xs text-gray-500 truncate" :title="product.brand">{{ product.brand }}</p>
                </div>
              </div>
            </td>

            <!-- Pharmacy Info -->
            <td class="py-4 px-5">
              <p class="font-medium text-gray-900 text-sm">{{ product.pharmacyName }}</p>
              <p class="text-xs text-gray-500">{{ product.ownerName }}</p>
            </td>

            <!-- Category -->
            <td class="py-4 px-5">
            <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
              {{ product.category }}
            </span>
            </td>

            <!-- Price -->
            <td class="py-4 px-5">
              <p class="font-bold text-gray-900 text-sm">{{ formatPrice(product.price) }}</p>
            </td>

            <!-- Stock -->
            <td class="py-4 px-5">
            <span
                class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium"
                :class="product.stock > 10 ? 'bg-green-50 text-green-700 border border-green-100' : product.stock > 0 ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' : 'bg-red-50 text-red-700 border border-red-100'"
            >
              {{ product.stock > 0 ? product.stock + ' عدد' : 'ناموجود' }}
            </span>
            </td>

            <!-- Prescription -->
            <td class="py-4 px-5">
            <span
                class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium"
                :class="product.requiresPrescription ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'"
            >
              {{ product.requiresPrescription ? 'نسخه‌ای' : 'آزاد' }}
            </span>
            </td>

            <!-- Status -->
            <td class="py-4 px-5">
            <span
                class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold"
                :class="getStatusClass(product.status)"
            >
              {{ getStatusLabel(product.status) }}
            </span>
            </td>

            <!-- Date -->
            <td class="py-4 px-5 text-sm text-gray-500">
              {{ product.createdAt }}
            </td>

            <!-- Actions -->
            <td class="py-4 px-5">
              <div class="flex items-center justify-center gap-2">
                <button @click="viewProduct(product)" class="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="مشاهده">
                  <i class="ti ti-eye text-lg"></i>
                </button>
                <button
                    v-if="product.status === 'pending'"
                    @click="approveProduct(product)"
                    class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="تأیید"
                >
                  <i class="ti ti-check text-lg"></i>
                </button>
                <button
                    v-if="product.status === 'pending'"
                    @click="openRejectModal(product)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="رد"
                >
                  <i class="ti ti-x text-lg"></i>
                </button>
                <button @click="deleteProduct(product)" class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="حذف">
                  <i class="ti ti-trash text-lg"></i>
                </button>
              </div>
            </td>
          </tr>

          <!-- Empty State Table -->
          <tr v-if="filteredPharmacyProducts.length === 0">
            <td colspan="9" class="py-16 text-center">
              <div class="flex flex-col items-center justify-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <i class="ti ti-pill-off text-3xl text-gray-400"></i>
                </div>
                <p class="text-gray-500 font-medium">محصولی یافت نشد</p>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Card View -->
      <div class="md:hidden p-4 space-y-4">
        <div v-for="product in filteredPharmacyProducts" :key="product.id" class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <!-- Header: Image & Name -->
          <div class="flex gap-3 mb-3">
            <div class="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
              <img :src="resolveUrl(product.image)" :alt="product.name" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-gray-900 text-sm mb-1 line-clamp-1">{{ product.name }}</h3>
              <p class="text-xs text-gray-500 mb-1">{{ product.pharmacyName }}</p>
              <p class="text-xs text-gray-400">{{ product.createdAt }}</p>
            </div>
          </div>

          <!-- Grid Details -->
          <div class="grid grid-cols-2 gap-3 mb-4 text-xs">
            <div class="bg-gray-50 p-2 rounded-lg">
              <span class="text-gray-500 block mb-1">قیمت:</span>
              <span class="font-bold text-gray-900">{{ formatPrice(product.price) }}</span>
            </div>
            <div class="bg-gray-50 p-2 rounded-lg">
              <span class="text-gray-500 block mb-1">دسته‌بندی:</span>
              <span class="font-medium text-gray-700">{{ product.category }}</span>
            </div>
            <div class="bg-gray-50 p-2 rounded-lg">
              <span class="text-gray-500 block mb-1">موجودی:</span>
              <span
                  class="font-medium"
                  :class="product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'"
              >
            {{ product.stock > 0 ? product.stock + ' عدد' : 'ناموجود' }}
          </span>
            </div>
            <div class="bg-gray-50 p-2 rounded-lg">
              <span class="text-gray-500 block mb-1">نسخه‌ای:</span>
              <span
                  class="font-medium"
                  :class="product.requiresPrescription ? 'text-red-600' : 'text-green-600'"
              >
            {{ product.requiresPrescription ? 'بله' : 'خیر' }}
          </span>
            </div>
          </div>

          <!-- Status & Actions -->
          <div class="flex items-center justify-between pt-3 border-t border-gray-100">
        <span
            class="px-3 py-1 rounded-full text-xs font-bold"
            :class="getStatusClass(product.status)"
        >
          {{ getStatusLabel(product.status) }}
        </span>

            <div class="flex gap-2">
              <button @click="viewProduct(product)" class="p-2 text-gray-500 hover:bg-gray-100 rounded-lg" title="مشاهده">
                <i class="ti ti-eye"></i>
              </button>
              <button
                  v-if="product.status === 'pending'"
                  @click="approveProduct(product)"
                  class="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                  title="تأیید"
              >
                <i class="ti ti-check"></i>
              </button>
              <button
                  v-if="product.status === 'pending'"
                  @click="openRejectModal(product)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="رد"
              >
                <i class="ti ti-x"></i>
              </button>
              <button @click="deleteProduct(product)" class="p-2 text-red-400 hover:bg-red-50 rounded-lg" title="حذف">
                <i class="ti ti-trash"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State Mobile -->
        <div v-if="filteredPharmacyProducts.length === 0" class="text-center py-12">
          <div class="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <i class="ti ti-pill-off text-3xl text-gray-400"></i>
          </div>
          <p class="text-gray-500 font-medium">محصولی یافت نشد</p>
        </div>
      </div>
    </div>
    <!-- View Product Modal -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="showViewModal = false">
      <div class="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
          <h3 class="font-bold text-gray-900 text-lg">جزئیات محصول</h3>
          <button @click="showViewModal = false" class="p-2 hover:bg-gray-100 rounded-lg">
            <i class="ti ti-x text-gray-500"></i>
          </button>
        </div>
        
        <div v-if="selectedProduct" class="p-5 space-y-6">
          <!-- Product Image -->
          <div class="flex justify-center">
            <img :src="resolveUrl(selectedProduct.image)" :alt="selectedProduct.name" class="w-48 h-48 rounded-xl object-cover bg-gray-100" />
          </div>
          
          <!-- Product Info -->
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 bg-gray-50 rounded-xl">
              <p class="text-xs text-gray-500 mb-1">نام محصول</p>
              <p class="font-bold text-gray-900">{{ selectedProduct.name }}</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-xl">
              <p class="text-xs text-gray-500 mb-1">برند</p>
              <p class="font-bold text-gray-900">{{ selectedProduct.brand }}</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-xl">
              <p class="text-xs text-gray-500 mb-1">دسته‌بندی</p>
              <p class="font-bold text-gray-900">{{ selectedProduct.category }}</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-xl">
              <p class="text-xs text-gray-500 mb-1">قیمت</p>
              <p class="font-bold text-gray-900">{{ formatPrice(selectedProduct.price) }} تومان</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-xl">
              <p class="text-xs text-gray-500 mb-1">موجودی</p>
              <p class="font-bold text-gray-900">{{ selectedProduct.stock }} عدد</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-xl">
              <p class="text-xs text-gray-500 mb-1">وضعیت</p>
              <span 
                class="px-2 py-1 rounded-lg text-xs"
                :class="getStatusClass(selectedProduct.status)"
              >
                {{ getStatusLabel(selectedProduct.status) }}
              </span>
            </div>
          </div>
          
          <!-- Description -->
          <div class="p-4 bg-gray-50 rounded-xl">
            <p class="text-xs text-gray-500 mb-2">توضیحات</p>
            <p class="text-gray-700">{{ selectedProduct.description }}</p>
          </div>
          
          <!-- Shop/Pharmacy Info -->
          <div class="p-4 bg-blue-50 rounded-xl">
            <p class="text-xs text-blue-600 mb-2">اطلاعات {{ activeTab === 'market' ? 'فروشگاه' : 'داروخانه' }}</p>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <i :class="activeTab === 'market' ? 'ti ti-building-store' : 'ti ti-pill'" class="text-blue-600"></i>
              </div>
              <div>
                <p class="font-bold text-gray-900">{{ activeTab === 'market' ? selectedProduct.shopName : selectedProduct.pharmacyName }}</p>
                <p class="text-xs text-gray-500">{{ selectedProduct.ownerName }}</p>
              </div>
            </div>
          </div>
          
          <!-- Actions -->
          <div v-if="selectedProduct.status === 'pending'" class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button @click="openRejectModal(selectedProduct); showViewModal = false" class="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
              <i class="ti ti-x ml-1"></i>
              رد محصول
            </button>
            <button @click="approveProduct(selectedProduct); showViewModal = false" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <i class="ti ti-check ml-1"></i>
              تأیید محصول
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="showRejectModal = false">
      <div class="bg-white rounded-2xl w-full max-w-md">
        <div class="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 class="font-bold text-gray-900 text-lg">رد محصول</h3>
          <button @click="showRejectModal = false" class="p-2 hover:bg-gray-100 rounded-lg">
            <i class="ti ti-x text-gray-500"></i>
          </button>
        </div>
        
        <div class="p-5 space-y-4">
          <div v-if="productToReject" class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <img :src="resolveUrl(productToReject.image)" :alt="productToReject.name" class="w-12 h-12 rounded-lg object-cover" />
            <div>
              <p class="font-bold text-gray-900">{{ productToReject.name }}</p>
              <p class="text-xs text-gray-500">{{ activeTab === 'market' ? productToReject.shopName : productToReject.pharmacyName }}</p>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">دلیل رد <span class="text-red-500">*</span></label>
            <textarea 
              v-model="rejectReason" 
              rows="4" 
              placeholder="دلیل رد محصول را وارد کنید..."
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 resize-none"
            ></textarea>
          </div>
        </div>
        
        <div class="p-5 border-t border-gray-100 flex items-center justify-end gap-3">
          <button @click="showRejectModal = false" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">انصراف</button>
          <button @click="rejectProduct" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            <i class="ti ti-x ml-1"></i>
            رد محصول
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="toast.show" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div 
          class="px-6 py-3 rounded-xl shadow-lg flex items-center gap-3"
          :class="{
            'bg-green-600 text-white': toast.type === 'success',
            'bg-red-600 text-white': toast.type === 'error'
          }"
        >
          <i :class="toast.type === 'success' ? 'ti ti-check' : 'ti ti-x'"></i>
          {{ toast.message }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppSelect from '@/components/AppSelect.vue'
import {useRequestShopStore} from "@/stores/market/request-shop.js";
import {useTenantRequestStore} from "@/stores/tenant-request.js";
import {useCategoryStore} from "@/stores/market/category.js";
import {useUrlHelper} from "@/composables/useUrlHelper.js";

const activeTab = ref('market')
const search = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')
const showViewModal = ref(false)
const showRejectModal = ref(false)
const selectedProduct = ref(null)
const productToReject = ref(null)
const rejectReason = ref('')
const toast = ref({ show: false, message: '', type: 'success' })
const {resolveUrl}=useUrlHelper()
const statusOptions = [
  { value: '', label: 'همه وضعیت‌ها' },
  { value: 'pending', label: 'در انتظار تأیید' },
  { value: 'approved', label: 'تأیید شده' },
  { value: 'rejected', label: 'رد شده' },
  { value: 'needs_revision', label: 'نیاز به اصلاح' },
]

// دریافت دسته‌بندی‌ها از استور
const marketCategoryStore = useCategoryStore()

// تابع تبدیل درخت دسته‌بندی به لیست فلت (بر اساس نام برای تطبیق با Breadcrumb)
const flattenCategories = (categories, prefix = '') => {
  let options = []
  categories.forEach(cat => {
    const label = prefix ? `${prefix} ${cat.name}` : cat.name
    options.push({ value: cat.name, label: label })

    if (cat.children && cat.children.length > 0) {
      options = options.concat(flattenCategories(cat.children, prefix ? `${prefix}  ›` : ''))
    }
  })
  return options
}

// مدیریت دسته‌بندی‌ها بر اساس تب فعال
const marketCategories = computed(() => {
  const allCats = marketCategoryStore.categories || []
  if (allCats.length === 0) return [{ value: '', label: 'همه دسته‌ها' }]

  // پیدا کردن ریشه "پت شاپ" (ایندکس 0 در دیتای شما)
  const petShopRoot = allCats.find(c => c.slug === 'petshop' || c.name === 'پت شاپ')

  if (!petShopRoot || !petShopRoot.children) return [{ value: '', label: 'همه دسته‌ها' }]

  const flatList = flattenCategories(petShopRoot.children)
  return [
    { value: '', label: 'همه دسته‌ها' },
    ...flatList
  ]
})

const pharmacyCategories = computed(() => {
  const allCats = marketCategoryStore.categories || []
  if (allCats.length === 0) return [{ value: '', label: 'همه دسته‌ها' }]

  // پیدا کردن ریشه "داروخانه" (ایندکس 1 در دیتای شما)
  const pharmacyRoot = allCats.find(c => c.slug === 'pharmacy' || c.name === 'داروخانه')

  if (!pharmacyRoot || !pharmacyRoot.children) return [{ value: '', label: 'همه دسته‌ها' }]

  const flatList = flattenCategories(pharmacyRoot.children)
  return [
    { value: '', label: 'همه دسته‌ها' },
    ...flatList
  ]
})

const requestShopStore = useRequestShopStore()

const marketProducts = computed(() => {
  const products = requestShopStore.products || [];
  return products
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((req) => ({
        id: req.id,
        name: req.name,
        shopName: req.tenant,
        category: req.categoryBreadcrumb,
        categoryId: req.categoryId,
        brand: req.brand,
        price: req.discountedPrice || req.price,
        originalPrice: req.price,
        discount: !!req.hasDiscount,
        stock: req.stock,
        description: req.description,
        image: req.image,
        status: req.status,
        createdAt: new Date(req.createdAt).toLocaleDateString('fa-IR')
      }));
});

const tenantReqStore = useTenantRequestStore()
const pharmacyProducts = computed(() => {
  const medicines = tenantReqStore.medicines || [];
  return medicines
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((req) => ({
        id: req.id,
        name: req.name,
        pharmacyName: req.tenant,
        category: req.categoryBreadcrumb || req.category, // استفاده از Breadcrumb اگر وجود داشت
        brand: '',
        price: req.discountedPrice || req.price,
        originalPrice: req.price,
        stock: req.stock,
        description: req.description,
        image: req.image,
        status: req.status,
        requiresPrescription: req.prescriptionRequired || false,
        createdAt: new Date(req.createdAt).toLocaleDateString('fa-IR')
      }));
})

const filteredMarketProducts = computed(() => {
  return marketProducts.value.filter(p => {
    const matchSearch = !search.value ||
        p.name.includes(search.value) ||
        p.shopName.includes(search.value)

    const matchStatus = !statusFilter.value || p.status === statusFilter.value

    // فیلتر بر اساس نام دسته در Breadcrumb
    const matchCategory = !categoryFilter.value || p.category.includes(categoryFilter.value)

    return matchSearch && matchStatus && matchCategory
  })
})

const filteredPharmacyProducts = computed(() => {
  return pharmacyProducts.value.filter(p => {
    const matchSearch = !search.value ||
        p.name.includes(search.value) ||
        p.pharmacyName.includes(search.value)

    const matchStatus = !statusFilter.value || p.status === statusFilter.value

    // فیلتر بر اساس نام دسته در Breadcrumb (مشابه پت شاپ)
    const matchCategory = !categoryFilter.value || p.category.includes(categoryFilter.value)

    return matchSearch && matchStatus && matchCategory
  })
})

const formatPrice = (price) => new Intl.NumberFormat('fa-IR').format(price)

const getStatusClass = (status) => {
  switch(status) {
    case 'pending': return 'bg-yellow-100 text-yellow-700'
    case 'approved': return 'bg-green-100 text-green-700'
    case 'rejected': return 'bg-red-100 text-red-700'
    case 'needs_revision': return 'bg-orange-100 text-orange-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const getStatusLabel = (status) => {
  switch(status) {
    case 'pending': return 'در انتظار'
    case 'approved': return 'تأیید شده'
    case 'rejected': return 'رد شده'
    case 'needs_revision': return 'نیاز به اصلاح'
    default: return status
  }
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}

const viewProduct = (product) => {
  selectedProduct.value = product
  showViewModal.value = true
}

const approveProduct = async (product) => {
  if (activeTab.value === 'market') {
    await requestShopStore.approveProductRequest(product.id)
  }
  if (activeTab.value === 'pharmacy') {
      await tenantReqStore.approveMedicineRequest(product.id)
  }
  product.status = 'approved'
  showToast(`محصول "${product.name}" تأیید شد`)
}

const openRejectModal = (product) => {
  productToReject.value = product
  rejectReason.value = ''
  showRejectModal.value = true
}

const rejectProduct = async () => {
  if (!rejectReason.value.trim()) {
    showToast('لطفاً دلیل رد را وارد کنید', 'error')
    return
  }

  productToReject.value.status = 'rejected'
  productToReject.value.rejectReason = rejectReason.value
  if (activeTab.value === 'market') {
    await requestShopStore.rejectProductRequest(productToReject.value.id, rejectReason.value)
  }
  if (activeTab.value === 'pharmacy') {
      await tenantReqStore.rejectMedicineRequest(productToReject.value.id, rejectReason.value)
  }
  showToast(`محصول "${productToReject.value.name}" رد شد`)
  showRejectModal.value = false
}

const deleteProduct = async (product) => {
  if (confirm(`آیا از حذف "${product.name}" اطمینان دارید؟`)) {
    if (activeTab.value === 'market') {
      await requestShopStore.rejectProductRequest(product.id, 'delete')
      marketProducts.value = marketProducts.value.filter(p => p.id !== product.id)
    } else {
      await tenantReqStore.rejectMedicineRequest(product.id, 'delete')
      pharmacyProducts.value = pharmacyProducts.value.filter(p => p.id !== product.id)
    }
    showToast('محصول حذف شد')
  }
}

const exportToExcel = () => {
  const products = activeTab.value === 'market' ? filteredMarketProducts.value : filteredPharmacyProducts.value
  const headers = activeTab.value === 'market'
      ? ['نام محصول', 'فروشگاه', 'دسته‌بندی', 'قیمت', 'موجودی', 'وضعیت', 'تاریخ']
      : ['نام محصول', 'داروخانه', 'دسته‌بندی', 'قیمت', 'موجودی', 'نسخه‌ای', 'وضعیت', 'تاریخ']

  let csv = '\uFEFF' + headers.join(',') + '\n'

  products.forEach(p => {
    if (activeTab.value === 'market') {
      csv += `"${p.name}","${p.shopName}","${p.category}","${p.price}","${p.stock}","${getStatusLabel(p.status)}","${p.createdAt}"\n`
    } else {
      csv += `"${p.name}","${p.pharmacyName}","${p.category}","${p.price}","${p.stock}","${p.requiresPrescription ? 'بله' : 'خیر'}","${getStatusLabel(p.status)}","${p.createdAt}"\n`
    }
  })

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `products-${activeTab.value}-${new Date().toLocaleDateString('fa-IR')}.csv`
  link.click()

  showToast('فایل اکسل دانلود شد')
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
</style>
