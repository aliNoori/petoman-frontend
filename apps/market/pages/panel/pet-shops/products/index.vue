<template>
  <div class="space-y-4 pb-20 lg:pb-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
      <!-- کارت کل محصولات -->
      <div class="group relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 cursor-pointer overflow-hidden">
        <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
              <i class="ti ti-shopping-bag text-white text-xl"></i>
            </div>
            <div class="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium">
              <i class="ti ti-database text-sm"></i>
              <span>کل</span>
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-600">کل محصولات</p>
            <p class="text-3xl font-bold text-gray-900 font-english">{{ stats.totalProducts }}</p>
            <p class="text-xs text-gray-500">محصولات موجود</p>
          </div>
        </div>
      </div>

      <!-- کارت محصولات فعال -->
      <div class="group relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 cursor-pointer overflow-hidden">
        <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/10 to-transparent rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
              <i class="ti ti-check text-white text-xl"></i>
            </div>
            <div class="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-medium">
              <i class="ti ti-circle-check text-sm"></i>
              <span>فعال</span>
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-600">محصولات فعال</p>
            <p class="text-3xl font-bold text-gray-900 font-english">{{ stats.activeProducts }}</p>
            <p class="text-xs text-gray-500">آماده فروش</p>
          </div>
        </div>
      </div>

      <!-- کارت موجودی کافی -->
      <div class="group relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 cursor-pointer overflow-hidden">
        <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
              <i class="ti ti-package text-white text-xl"></i>
            </div>
            <div class="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-600 rounded-lg text-xs font-medium">
              <i class="ti ti-box text-sm"></i>
              <span>موجودی</span>
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-600">موجودی کافی</p>
            <p class="text-3xl font-bold text-gray-900 font-english">{{ stats.goodStock }}</p>
            <p class="text-xs text-gray-500">موجودی بالای 50</p>
          </div>
        </div>
      </div>

      <!-- کارت کمبود موجودی -->
      <div class="group relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-200 cursor-pointer overflow-hidden">
        <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-500/10 to-transparent rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform duration-300">
              <i class="ti ti-alert-triangle text-white text-xl"></i>
            </div>
            <div class="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium">
              <i class="ti ti-exclamation-circle text-sm"></i>
              <span>کمبود</span>
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-600">کمبود موجودی</p>
            <p class="text-3xl font-bold text-gray-900 font-english">{{ stats.lowStock }}</p>
            <p class="text-xs text-gray-500">موجودی کمتر از 10</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
      <div class="flex gap-2 overflow-x-auto">
        <button
          @click="() => { showLowStock = false; }"
          :class="[
            'flex-1 px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap',
            !showLowStock
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30' 
              : 'text-gray-600 hover:bg-gray-50'
          ]"
        >
          <i class="ti ti-list text-lg"></i>
          <span>همه محصولات</span>
          <span v-if="!showLowStock" class="px-2 py-0.5 bg-white/20 rounded-lg text-xs font-bold">
            {{ allFilteredProducts.length }}
          </span>
        </button>
        <button
          @click="() => { showLowStock = true; }"
          :class="[
            'flex-1 px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap',
            showLowStock
              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30' 
              : 'text-gray-600 hover:bg-gray-50'
          ]"
        >
          <i class="ti ti-alert-triangle text-lg"></i>
          <span>کمبود موجودی</span>
          <span v-if="showLowStock" class="px-2 py-0.5 bg-white/20 rounded-lg text-xs font-bold">
            {{ products.filter(p => p.stock < 10).length }}
          </span>
        </button>
      </div>
    </div>

    <!-- Search & Add Button -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div class="flex flex-col lg:flex-row gap-4">
        <div class="flex-1 relative group">
          <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <i class="ti ti-search text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="جستجو بر اساس نام محصول، کد، یا دسته‌بندی..."
            class="w-full pr-4 pl-11 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
          />
        </div>
        <button
          @click="openAddModal"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <i class="ti ti-plus text-xl"></i>
          افزودن محصول
        </button>
      </div>
    </div>

    <!-- Products Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <!-- Table Header -->
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 class="text-lg font-bold text-gray-900">لیست محصولات</h3>
          <p class="text-sm text-gray-500 mt-1">
            نمایش 
            <span class="font-medium text-gray-900">{{ Math.min(currentPage * itemsPerPage, allFilteredProducts.length) }}</span>
            از 
            <span class="font-medium text-gray-900">{{ allFilteredProducts.length }}</span>
            محصول
          </p>
        </div>
        
        <div class="flex items-center gap-3">
          <!-- تعداد نمایش -->
          <div class="relative">
            <button
              @click="showItemsDropdown = !showItemsDropdown"
              class="px-4 py-2 border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-all flex items-center gap-2 bg-white"
            >
              <span class="text-sm font-medium text-gray-700">نمایش {{ itemsPerPage }}</span>
              <i class="ti ti-chevron-down text-sm text-gray-400"></i>
            </button>
            
            <transition name="dropdown">
              <div v-if="showItemsDropdown" class="absolute top-full left-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl overflow-hidden z-50 min-w-[120px]">
                <ul class="py-2">
                  <li
                    v-for="count in [10, 25, 50, 100]"
                    :key="count"
                    @click="changeItemsPerPage(count)"
                    class="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors flex items-center justify-between"
                    :class="{ 'bg-blue-50 text-blue-600 font-bold': itemsPerPage === count }"
                  >
                    <span class="text-sm">{{ count }}</span>
                    <i v-if="itemsPerPage === count" class="ti ti-check text-blue-600"></i>
                  </li>
                </ul>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <!-- Table Content - Desktop -->
      <div class="hidden lg:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                محصول
              </th>
              <th class="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                دسته‌بندی
              </th>
              <th class="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                قیمت
              </th>
              <th class="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                موجودی
              </th>
              <th class="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                وضعیت
              </th>
              <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="product in paginatedProducts"
              :key="product.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img v-if="product.image" :src="product.image" :alt="product.name" class="w-full h-full object-cover">
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <i class="ti ti-shopping-bag text-gray-400 text-xl"></i>
                    </div>
                  </div>
                  <div>
                    <p class="font-bold text-gray-900">{{ product.name }}</p>
                    <p class="text-sm text-gray-500">کد: {{ product.code }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-900">{{ product.category }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="font-bold text-gray-900 font-english">{{ formatMoney(product.price) }}</span>
                <span class="text-sm text-gray-500 mr-1">تومان</span>
              </td>
              <td class="px-6 py-4">
                <span :class="[
                  'font-bold font-english',
                  product.stock < 10 ? 'text-red-600' : product.stock < 50 ? 'text-amber-600' : 'text-green-600'
                ]">
                  {{ product.stock }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span :class="[
                  'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold',
                  product.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                ]">
                  <i :class="product.isActive ? 'ti ti-check' : 'ti ti-x'"></i>
                  {{ product.isActive ? 'فعال' : 'غیرفعال' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-center gap-2">
                  <button
                    @click="viewProduct(product)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="مشاهده جزئیات"
                  >
                    <i class="ti ti-eye text-lg"></i>
                  </button>
                  <button
                    @click="editProduct(product)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="ویرایش"
                  >
                    <i class="ti ti-edit text-lg"></i>
                  </button>
                  <button
                    @click="deleteProduct(product)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="حذف"
                  >
                    <i class="ti ti-trash text-lg"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div class="lg:hidden divide-y divide-gray-100">
        <div
          v-for="product in paginatedProducts"
          :key="product.id"
          class="p-4 hover:bg-gray-50 transition-colors"
        >
          <div class="flex gap-3 mb-3">
            <div class="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img v-if="product.image" :src="product.image" :alt="product.name" class="w-full h-full object-cover">
              <div v-else class="w-full h-full flex items-center justify-center">
                <i class="ti ti-shopping-bag text-gray-400 text-2xl"></i>
              </div>
            </div>
            <div class="flex-1">
              <div class="flex items-start justify-between mb-1">
                <h4 class="font-bold text-gray-900">{{ product.name }}</h4>
                <span :class="[
                  'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold',
                  product.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                ]">
                  {{ product.isActive ? 'فعال' : 'غیرفعال' }}
                </span>
              </div>
              <p class="text-xs text-gray-500 mb-2">کد: {{ product.code }}</p>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs text-gray-600">{{ product.category }}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between mb-3 pt-3 border-t border-gray-100">
            <div>
              <p class="text-xs text-gray-500 mb-1">قیمت</p>
              <p class="font-bold text-gray-900">
                <span class="font-english">{{ formatMoney(product.price) }}</span>
                <span class="text-sm text-gray-500 mr-1">تومان</span>
              </p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">موجودی</p>
              <p :class="[
                'font-bold font-english',
                product.stock < 10 ? 'text-red-600' : product.stock < 50 ? 'text-amber-600' : 'text-green-600'
              ]">
                {{ product.stock }}
              </p>
            </div>
          </div>

          <div class="flex gap-2">
            <button
              @click="viewProduct(product)"
              class="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg font-bold text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
            >
              <i class="ti ti-eye"></i>
              مشاهده
            </button>
            <button
              @click="editProduct(product)"
              class="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg font-bold text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
            >
              <i class="ti ti-edit"></i>
              ویرایش
            </button>
            <button
              @click="deleteProduct(product)"
              class="px-3 py-2 bg-red-50 text-red-700 rounded-lg font-bold text-sm hover:bg-red-100 transition-colors"
            >
              <i class="ti ti-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="allFilteredProducts.length === 0" class="p-12 text-center">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="ti ti-package text-4xl text-gray-400"></i>
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">محصولی یافت نشد</h3>
        <p class="text-gray-500 text-sm">هیچ محصولی با این فیلترها پیدا نشد.</p>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-100">
        <div class="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div class="text-sm text-gray-600">
            صفحه <span class="font-bold text-gray-900 font-english">{{ currentPage }}</span> از <span class="font-bold text-gray-900 font-english">{{ totalPages }}</span>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="currentPage = 1"
              :disabled="currentPage === 1"
              :class="[
                'px-3 py-2 rounded-lg font-bold transition-all text-sm',
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600'
              ]"
            >
              <i class="ti ti-chevrons-right"></i>
            </button>
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              :class="[
                'px-3 py-2 rounded-lg font-bold transition-all text-sm',
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600'
              ]"
            >
              <i class="ti ti-chevron-right"></i>
            </button>
            
            <!-- Page Numbers -->
            <div class="flex gap-2">
              <button
                v-for="page in displayedPages"
                :key="page"
                @click="currentPage = page"
                :class="[
                  'px-4 py-2 rounded-lg font-bold transition-all text-sm min-w-[40px]',
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600'
                ]"
              >
                {{ page }}
              </button>
            </div>
            
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              :class="[
                'px-3 py-2 rounded-lg font-bold transition-all text-sm',
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600'
              ]"
            >
              <i class="ti ti-chevron-left"></i>
            </button>
            <button
              @click="currentPage = totalPages"
              :disabled="currentPage === totalPages"
              :class="[
                'px-3 py-2 rounded-lg font-bold transition-all text-sm',
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600'
              ]"
            >
              <i class="ti ti-chevrons-left"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- View Product Modal -->
    <Teleport to="body">
      <transition name="modal">
        <div
          v-if="showViewModal && selectedProduct"
          @click.self="showViewModal = false"
          class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
        >
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <!-- Modal Header -->
            <div class="bg-blue-600 px-6 py-4 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <i class="ti ti-eye text-2xl text-white"></i>
                <h3 class="text-xl font-bold text-white">جزئیات محصول</h3>
              </div>
              <button
                @click="showViewModal = false"
                class="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <i class="ti ti-x text-xl"></i>
              </button>
            </div>

            <!-- Modal Body -->
            <div class="p-6 overflow-y-auto flex-1">
              <!-- Product Image/Icon -->
              <div class="mb-6">
                <div class="w-full h-64 rounded-xl overflow-hidden bg-gray-100">
                  <img v-if="selectedProduct.image" :src="selectedProduct.image" :alt="selectedProduct.name" class="w-full h-full object-cover">
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <i class="ti ti-shopping-bag text-gray-400 text-6xl"></i>
                  </div>
                </div>
              </div>

              <!-- Product Info -->
              <div class="space-y-4">
                <div>
                  <h4 class="text-2xl font-bold text-gray-900 mb-2">{{ selectedProduct.name }}</h4>
                  <p class="text-sm text-gray-500">کد محصول: {{ selectedProduct.code }}</p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-gray-50 rounded-xl p-4 col-span-2">
                    <p class="text-xs text-gray-500 mb-1">دسته‌بندی</p>
                    <p class="font-bold text-gray-900">{{ selectedProduct.category }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-xs text-gray-500 mb-1">قیمت</p>
                    <p class="font-bold text-gray-900">
                      <span class="font-english">{{ formatMoney(selectedProduct.price) }}</span>
                      <span class="text-sm mr-1">تومان</span>
                    </p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-xs text-gray-500 mb-1">موجودی</p>
                    <p :class="[
                      'font-bold font-english',
                      selectedProduct.stock < 10 ? 'text-red-600' : selectedProduct.stock < 50 ? 'text-amber-600' : 'text-green-600'
                    ]">
                      {{ selectedProduct.stock }}
                    </p>
                  </div>
                </div>

                <div v-if="selectedProduct.description" class="bg-gray-50 rounded-xl p-4">
                  <p class="text-xs text-gray-500 mb-2">توضیحات</p>
                  <p class="text-sm text-gray-700">{{ selectedProduct.description }}</p>
                </div>

                <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <p class="text-xs text-gray-500 mb-1">وضعیت</p>
                    <span :class="[
                      'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold',
                      selectedProduct.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    ]">
                      <i :class="selectedProduct.isActive ? 'ti ti-check' : 'ti ti-x'"></i>
                      {{ selectedProduct.isActive ? 'فعال' : 'غیرفعال' }}
                    </span>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 mb-1">تاریخ ایجاد</p>
                    <p class="text-sm font-bold text-gray-900">{{ selectedProduct.createdAt }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
              <button
                @click="editProduct(selectedProduct)"
                class="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <i class="ti ti-edit"></i>
                ویرایش محصول
              </button>
              <button
                @click="showViewModal = false"
                class="px-6 py-3 bg-white hover:bg-gray-100 text-gray-700 rounded-xl font-bold transition-all border-2 border-gray-200"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import medicineCategories from '~/data/medicine-categories.json'
import categories from '~/data/categories.json'

definePageMeta({
  layout: 'pet-shop'
})

// State
const searchQuery = ref('')
const showLowStock = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(5)
const showItemsDropdown = ref(false)
const showViewModal = ref(false)
const selectedProduct = ref(null)
const isLoading = ref(true)

// Products data
const products = ref([])

// Load products from localStorage or use sample data
onMounted(() => {
  loadProducts()
})

const loadProducts = () => {
  try {
    // بارگذاری از localStorage
    const savedProducts = localStorage.getItem('pet_shop_products')
    if (savedProducts) {
      products.value = JSON.parse(savedProducts)
    } else {
      // داده‌های تستی اولیه
      products.value = [
  // محصولات فروشگاه (از ProductSearchOrCreate)
  {
    id: 1,
    name: 'غذای خشک سگ رویال کنین Adult 15kg',
    code: 'PRD-RC-DOG-15',
    type: 'shop',
    category: 'پت مارکت › غذا › غذای سگ › غذای خشک',
    price: 3500000,
    stock: 45,
    isActive: true,
    image: null,
    description: 'غذای خشک مخصوص سگ بالغ نژاد متوسط',
    hasExpiryDate: true,
    expiryDate: '1405/03/20',
    createdAt: '1403/08/01'
  },
  {
    id: 2,
    name: 'کنسرو گربه شبا طعم تن ماهی 85g',
    code: 'PRD-SHEBA-CAT-85',
    type: 'shop',
    category: 'پت مارکت › غذا › غذای گربه › کنسرو',
    price: 45000,
    stock: 120,
    isActive: true,
    image: null,
    description: 'کنسرو ماکیان با طعم تن ماهی',
    hasExpiryDate: true,
    expiryDate: '1404/11/15',
    createdAt: '1403/08/02'
  },
  {
    id: 3,
    name: 'خاک گربه بنتونیت Ever Clean 10kg',
    code: 'PRD-EC-LIT-10',
    type: 'shop',
    category: 'پت مارکت › لوازم › گربه › خاک گربه',
    price: 320000,
    stock: 65,
    isActive: true,
    image: null,
    description: 'خاک گربه کلوخه شونده با رایحه لاوندر',
    hasExpiryDate: false,
    expiryDate: null,
    createdAt: '1403/08/03'
  },
  {
    id: 4,
    name: 'غذای خشک گربه پرشین Royal Canin 2kg',
    code: 'PRD-RC-PER-2',
    type: 'shop',
    category: 'پت مارکت › غذا › غذای گربه › غذای خشک',
    price: 850000,
    stock: 32,
    isActive: true,
    image: null,
    description: 'غذای خشک مخصوص گربه پرشین',
    hasExpiryDate: true,
    expiryDate: '1405/05/10',
    createdAt: '1403/08/04'
  },
  {
    id: 5,
    name: 'قلاده چرمی سگ Hunter سایز M',
    code: 'PRD-HUN-COL-M',
    type: 'shop',
    category: 'پت مارکت › لوازم › سگ › قلاده و بند',
    price: 180000,
    stock: 85,
    isActive: true,
    image: null,
    description: 'قلاده چرم طبیعی با دوخت دستی',
    hasExpiryDate: false,
    expiryDate: null,
    createdAt: '1403/08/05'
  },
  {
    id: 6,
    name: 'اسکرچر گربه طرح موش Trixie',
    code: 'PRD-TRI-SCR-01',
    type: 'shop',
    category: 'پت مارکت › لوازم › گربه › اسکرچر و اسباب بازی',
    price: 250000,
    stock: 42,
    isActive: true,
    image: null,
    description: 'اسکرچر با پوشش سیزال طبیعی',
    hasExpiryDate: false,
    expiryDate: null,
    createdAt: '1403/08/06'
  },
  {
    id: 7,
    name: 'غذای مرطوب سگ Pedigree 100g - بسته 12 عددی',
    code: 'PRD-PED-WET-100',
    type: 'shop',
    category: 'پت مارکت › غذا › غذای سگ › غذای مرطوب',
    price: 280000,
    stock: 95,
    isActive: true,
    image: null,
    description: 'غذای مرطوب با طعم گوشت و سبزیجات',
    hasExpiryDate: true,
    expiryDate: '1404/12/01',
    createdAt: '1403/08/07'
  },
  {
    id: 8,
    name: 'دانه مخلوط قناری Vitakraft 1kg',
    code: 'PRD-VIT-BIR-1',
    type: 'shop',
    category: 'پت مارکت › غذا › غذای پرنده › دانه',
    price: 95000,
    stock: 150,
    isActive: true,
    image: null,
    description: 'مخلوط دانه‌های مغذی برای قناری',
    hasExpiryDate: true,
    expiryDate: '1405/02/25',
    createdAt: '1403/08/08'
  },
  {
    id: 9,
    name: 'استخوان تشویقی سگ Dentastix 7 عددی',
    code: 'PRD-DEN-TRE-7',
    type: 'shop',
    category: 'پت مارکت › غذا › غذای سگ › تشویقی',
    price: 125000,
    stock: 8,
    isActive: true,
    image: null,
    description: 'استخوان جویدنی برای سلامت دندان',
    hasExpiryDate: true,
    expiryDate: '1404/10/15',
    createdAt: '1403/08/09'
  },
  {
    id: 10,
    name: 'پته گربه Gourmet Gold 85g',
    code: 'PRD-GOU-PAT-85',
    type: 'shop',
    category: 'پت مارکت › غذا › غذای گربه › پته',
    price: 38000,
    stock: 200,
    isActive: true,
    image: null,
    description: 'پته گربه با طعم مرغ و جگر',
    hasExpiryDate: true,
    expiryDate: '1404/09/30',
    createdAt: '1403/08/10'
  },
  // محصولها (از MedicineSearchOrCreate)
  {
    id: 11,
    name: 'آنتی بیوتیک آموکسی سیلین تزریقی 100ml',
    code: 'MED-AMX-100',
    type: 'medicine',
    category: 'آنتی‌بیوتیک‌ها › پنی‌سیلین‌ها › آموکسی‌سیلین',
    price: 385000,
    stock: 45,
    isActive: true,
    description: 'آنتی بیوتیک تزریقی برای درمان عفونت‌های باکتریایی',
    hasExpiryDate: true,
    expiryDate: '1404/11/20',
    createdAt: '1403/08/11'
  },
  {
    id: 12,
    name: 'قرص ضد انگل داخلی درونتال سگ',
    code: 'MED-DRT-DOG',
    type: 'medicine',
    category: 'ضد انگل‌ها › انگل‌های داخلی › قرص',
    price: 125000,
    stock: 120,
    isActive: true,
    description: 'قرص ضد انگل گسترده طیف برای سگ',
    hasExpiryDate: true,
    expiryDate: '1405/06/15',
    createdAt: '1403/08/12'
  },
  {
    id: 13,
    name: 'واکسن هاری رابیزین تک دوز',
    code: 'MED-RAB-1D',
    type: 'medicine',
    category: 'واکسن‌ها › واکسن‌های اجباری › هاری',
    price: 180000,
    stock: 5,
    isActive: true,
    description: 'واکسن پیشگیری از بیماری هاری',
    hasExpiryDate: true,
    expiryDate: '1404/12/30',
    createdAt: '1403/08/13'
  },
  {
    id: 14,
    name: 'قطره ضد التهاب چشم تتراسایکلین 5ml',
    code: 'MED-TET-EYE-5',
    type: 'medicine',
    category: 'چشم و گوش › قطره چشمی › ضد التهاب',
    price: 65000,
    stock: 85,
    isActive: true,
    description: 'قطره ضد التهاب و آنتی بیوتیک چشمی',
    hasExpiryDate: true,
    expiryDate: '1404/09/05',
    createdAt: '1403/08/14'
  },
  {
    id: 15,
    name: 'قرص ضد درد ملوکسیکام 2mg بسته 10 عددی',
    code: 'MED-MEL-2MG-10',
    type: 'medicine',
    category: 'ضد التهاب‌ها › NSAID › ملوکسیکام',
    price: 92000,
    stock: 3,
    isActive: false,
    description: 'قرص ضد التهاب و ضد درد برای سگ و گربه',
    hasExpiryDate: true,
    expiryDate: '1405/04/10',
    createdAt: '1403/08/15'
  },
  {
    id: 16,
    name: 'ویتامین B کمپلکس تزریقی 30ml',
    code: 'MED-VIT-B-30',
    type: 'medicine',
    category: 'ویتامین‌ها و مکمل‌ها › ویتامین B › تزریقی',
    price: 145000,
    stock: 65,
    isActive: true,
    description: 'مکمل ویتامین B برای تقویت سیستم عصبی',
    hasExpiryDate: true,
    expiryDate: '1404/10/25',
    createdAt: '1403/08/16'
  },
  {
    id: 17,
    name: 'پماد ضد قارچ میکونازول 20g',
    code: 'MED-MIC-20G',
    type: 'medicine',
    category: 'ضد قارچ‌ها › پماد › میکونازول',
    price: 58000,
    stock: 95,
    isActive: true,
    description: 'پماد موضعی برای درمان عفونت‌های قارچی پوستی',
    hasExpiryDate: true,
    expiryDate: '1405/03/12',
    createdAt: '1403/08/17'
  },
  {
    id: 18,
    name: 'شربت ضد سرفه برومهگزین 100ml',
    code: 'MED-BRO-100',
    type: 'medicine',
    category: 'تنفسی › ضد سرفه › شربت',
    price: 72000,
    stock: 42,
    isActive: true,
    description: 'شربت ضد سرفه و رفع التهاب تنفسی',
    hasExpiryDate: true,
    expiryDate: '1404/08/18',
    createdAt: '1403/08/18'
  },
  {
    id: 19,
    name: 'قرص قلب و عروق آتنولول 25mg',
    code: 'MED-ATN-25-10',
    type: 'medicine',
    category: 'قلب و عروق › بتابلوکرها › آتنولول',
    price: 110000,
    stock: 28,
    isActive: true,
    description: 'قرص درمان فشار خون و بیماری‌های قلبی',
    hasExpiryDate: true,
    expiryDate: '1405/07/22',
    createdAt: '1403/08/19'
  },
  {
    id: 20,
    name: 'قرص گوارشی متوکلوپرامید 10mg',
    code: 'MED-MET-10-20',
    type: 'medicine',
    category: 'گوارشی › ضد تهوع › متوکلوپرامید',
    price: 48000,
    stock: 150,
    isActive: true,
    description: 'قرص ضد تهوع و تنظیم حرکات روده',
    hasExpiryDate: true,
    expiryDate: '1405/05/30',
    createdAt: '1403/08/20'
  },
      ]
    }
    isLoading.value = false
  } catch (error) {
    console.error('Error loading products:', error)
    isLoading.value = false
  }
}

// Save products to localStorage
const saveProducts = () => {
  try {
    localStorage.setItem('pet_shop_products', JSON.stringify(products.value))
  } catch (error) {
    console.error('Error saving products:', error)
  }
}

// Watch for changes and save
watch(products, () => {
  saveProducts()
}, { deep: true })

// Stats
const stats = computed(() => ({
  totalProducts: products.value.length,
  activeProducts: products.value.filter(p => p.isActive).length,
  goodStock: products.value.filter(p => p.stock >= 50).length,
  lowStock: products.value.filter(p => p.stock < 10).length,
}))

// Filtered Products
const allFilteredProducts = computed(() => {
  let filtered = products.value

  // Filter low stock
  if (showLowStock.value) {
    filtered = filtered.filter(p => p.stock < 10)
  }

  // Search
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.code.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    )
  }

  return filtered
})

// Paginated Products
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return allFilteredProducts.value.slice(start, end)
})

// Total Pages
const totalPages = computed(() => {
  return Math.ceil(allFilteredProducts.value.length / itemsPerPage.value)
})

// Displayed page numbers
const displayedPages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []
  
  if (total <= 7) {
    // Show all pages if 7 or less
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)
    
    if (current > 3) {
      pages.push('...')
    }
    
    // Show pages around current
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i)
    }
    
    if (current < total - 2) {
      pages.push('...')
    }
    
    // Always show last page
    pages.push(total)
  }
  
  return pages.filter((page, index, self) => self.indexOf(page) === index)
})

// Methods
const formatMoney = (value) => {
  return new Intl.NumberFormat('fa-IR').format(value)
}

const changeItemsPerPage = (count) => {
  itemsPerPage.value = count
  currentPage.value = 1
  showItemsDropdown.value = false
}

const viewProduct = (product) => {
  selectedProduct.value = product
  showViewModal.value = true
}

const editProduct = (product) => {
  navigateTo(`/panel/pet-shops/products/add-shop?id=${product.id}`)
}

const deleteProduct = (product) => {
  if (confirm(`آیا از حذف محصول "${product.name}" اطمینان دارید؟`)) {
    const index = products.value.findIndex(p => p.id === product.id)
    if (index !== -1) {
      products.value.splice(index, 1)
    }
  }
}

const openAddModal = () => {
  // مستقیم به صفحه افزودن محصول می‌ریم
  navigateTo('/panel/pet-shops/products/add-shop')
}

// Add product from other pages
const addProduct = (product) => {
  const newProduct = {
    id: products.value.length > 0 ? Math.max(...products.value.map(p => p.id)) + 1 : 1,
    ...product,
    createdAt: new Date().toLocaleDateString('fa-IR')
  }
  products.value.push(newProduct)
}

// Listen for product additions from other pages
onMounted(() => {
  if (process.client) {
    window.addEventListener('product-added', (event) => {
      if (event.detail) {
        addProduct(event.detail)
      }
    })
    
    // Listen for storage changes from other tabs
    window.addEventListener('storage', (event) => {
      if (event.key === 'pet_shop_products') {
        loadProducts()
      }
    })
  }
})

// Watch currentPage to reset if exceeds total pages
watch(() => allFilteredProducts.value.length, () => {
  if (currentPage.value > totalPages.value && totalPages.value > 0) {
    currentPage.value = 1
  }
})
</script>

<style scoped>
/* Dropdown Animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Modal Animation */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #14b8a6;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #0d9488;
}

/* English Numbers */
.font-english {
  font-family: system-ui, -apple-system, sans-serif;
  direction: ltr;
  display: inline-block;
}
</style>




