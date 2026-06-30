<template>
  <div class="space-y-4 pb-20 lg:pb-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
      <!-- کارت کل محصولات -->
      <div class="group relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 cursor-pointer overflow-hidden">
        <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
              <i class="ti ti-package text-white text-xl"></i>
            </div>
            <div class="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium">
              <i class="ti ti-database text-sm"></i>
              <span>کل</span>
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-600">کل محصولات</p>
            <p class="text-3xl font-bold text-gray-900 font-english">{{ stats.totalProducts }}</p>
            <p class="text-xs text-gray-500">محصولات ثبت شده</p>
          </div>
        </div>
      </div>

      <!-- کارت محصولات فروشگاه -->
      <div class="group relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 cursor-pointer overflow-hidden">
        <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
              <i class="ti ti-shopping-bag text-white text-xl"></i>
            </div>
            <div class="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-600 rounded-lg text-xs font-medium">
              <i class="ti ti-shopping-cart text-sm"></i>
              <span>فروشگاه</span>
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-600">محصولات فروشگاه</p>
            <p class="text-3xl font-bold text-gray-900 font-english">{{ stats.shopProducts }}</p>
            <p class="text-xs text-gray-500">غذا، لوازم و اسباب‌بازی</p>
          </div>
        </div>
      </div>

      <!-- کارت کمبود موجودی -->
      <div class="group relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-amber-200 cursor-pointer overflow-hidden">
        <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform duration-300">
              <i class="ti ti-alert-triangle text-white text-xl"></i>
            </div>
            <div class="flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-600 rounded-lg text-xs font-medium">
              <i class="ti ti-exclamation-circle text-sm"></i>
              <span>کمبود</span>
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-600">کمبود موجودی</p>
            <p class="text-3xl font-bold text-gray-900 font-english">{{ stats.lowStock }}</p>
            <p class="text-xs text-gray-500">نیاز به تامین دارند</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
      <div class="flex gap-2 overflow-x-auto">
        <button
            @click="() => { productTypeFilter = ''; showLowStock = false; }"
            :class="[
            'flex-1 px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap',
            productTypeFilter === '' && !showLowStock
              ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30'
              : 'text-gray-600 hover:bg-gray-50'
          ]"
        >
          <i class="ti ti-list text-lg"></i>
          <span class="hidden lg:inline">همه محصولات</span>
          <span v-if="productTypeFilter === '' && !showLowStock" class="px-2 py-0.5 bg-white/20 rounded-lg text-xs font-bold">
            {{ allFilteredProducts.length }}
          </span>
        </button>
        <button
            @click="() => { productTypeFilter = 'shop'; showLowStock = false; }"
            :class="[
            'flex-1 px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap',
            productTypeFilter === 'shop' && !showLowStock
              ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30'
              : 'text-gray-600 hover:bg-gray-50'
          ]"
        >
          <i class="ti ti-shopping-bag text-lg"></i>
          <span class="hidden lg:inline">فروشگاه</span>
          <span v-if="productTypeFilter === 'shop' && !showLowStock" class="px-2 py-0.5 bg-white/20 rounded-lg text-xs font-bold">
            {{ products.filter(p => p.type === 'shop').length }}
          </span>
        </button>
        <!-- تب داروها -->
        <button
            @click="() => { productTypeFilter = 'medicine'; showLowStock = false; }"
            :class="[
                      'flex-1 px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap',
                      productTypeFilter === 'medicine' && !showLowStock
                        ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30'
                        : 'text-gray-600 hover:bg-gray-50'
            ]"
        >
          <i class="ti ti-medicine-syrup text-lg"></i>
          <span class="hidden lg:inline">داروها</span>
          <span v-if="productTypeFilter === 'medicine' && !showLowStock" class="px-2 py-0.5 bg-white/20 rounded-lg text-xs font-bold">
            {{ medicines.length }}
          </span>
        </button>
        <button
            @click="() => { showLowStock = true; productTypeFilter = ''; }"
            :class="[
            'flex-1 px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap',
            showLowStock
              ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30'
              : 'text-gray-600 hover:bg-gray-50'
          ]"
        >
          <i class="ti ti-alert-triangle text-lg"></i>
          <span class="hidden lg:inline">کمبود موجودی</span>
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
            <i class="ti ti-search text-gray-400 group-focus-within:text-teal-500 transition-colors"></i>
          </div>
          <input
              v-model="searchQuery"
              type="text"
              placeholder="جستجو بر اساس نام محصول، کد، یا دسته‌بندی..."
              class="w-full pr-4 pl-11 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
          />
        </div>
        <button
            @click="openAddModal"
            class="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap"
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
                class="px-4 py-2 border-2 border-gray-200 rounded-xl hover:border-teal-500 transition-all flex items-center gap-2 bg-white"
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
                      class="px-4 py-2 hover:bg-teal-50 cursor-pointer transition-colors flex items-center justify-between"
                      :class="{ 'bg-teal-50 text-teal-600 font-bold': itemsPerPage === count }"
                  >
                    <span class="text-sm">{{ count }}</span>
                    <i v-if="itemsPerPage === count" class="ti ti-check text-teal-600"></i>
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
            <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
              تاییدیه مدیر
            </th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
          <tr
              v-for="product in paginatedProducts"
              :key="product.id"
              class="hover:bg-gray-50 transition-colors"
              :class="{ 'pointer-events-none opacity-50 bg-orange-50': product.status === 'pending'}"
          >
            <!-- ستون محصول -->
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                      v-if="product.image"
                      :src="resolveUrl(product.image)"
                      :alt="product.name"
                      class="w-full h-full object-cover"
                  >
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

            <!-- ستون دسته‌بندی -->
            <td class="px-6 py-4">
              <span class="text-sm text-gray-900">{{ product.categoryBreadcrumb }}</span>
            </td>

            <!-- ستون قیمت -->
            <td class="px-6 py-4">
              <span class="font-bold text-gray-900 font-english">{{ formatMoney(product.price) }}</span>
              <span class="text-sm text-gray-500 mr-1">تومان</span>
            </td>

            <!-- ستون موجودی -->
            <td class="px-6 py-4">
              <span :class="[
                'font-bold font-english',
                product.stock < 10 ? 'text-red-600' : product.stock < 50 ? 'text-amber-600' : 'text-green-600'
              ]">
                {{ product.stock }}
              </span>
            </td>

            <!-- ستون وضعیت -->
            <td class="px-6 py-4">
              <button
                  @click="toggleProductStatus(product)"
                  :class="[
                  'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer hover:opacity-80',
                  product.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                ]"
              >
                <i :class="product.isActive ? 'ti ti-check' : 'ti ti-x'"></i>
                {{ product.isActive ? 'فعال' : 'غیرفعال' }}
              </button>
            </td>

            <!-- ستون عملیات -->
            <td class="px-6 py-4">
              <div class="flex items-center justify-center gap-2">
                <!-- دکمه واریانت فقط برای محصولات فروشگاه نمایش داده شود -->
                <button
                    v-if="productTypeFilter !== 'medicine'"
                    @click="openVariantModal(product)"
                    class="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="مدیریت واریانت‌ها"
                >
                  <i class="ti ti-layers-linked text-lg"></i>
                </button>

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

            <!-- ستون تاییدیه مدیر -->
            <td class="px-6 py-4">
              <div class="flex flex-col gap-1">
                <!-- Badge وضعیت -->
                <span :class="[
                  'inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold w-fit border',
                  getStatusClass(product.status)
                ]">
                  <i :class="getStatusIcon(product.status)"></i>
                  {{ getStatusLabel(product.status, product) }}
                </span>
                <!-- نمایش دلیل رد شدن در صورت وجود -->
                <div v-if="product.status === 'rejected' && product.rejectionReason"
                     class="flex items-start gap-1.5 max-w-[200px] group relative">
                  <i class="ti ti-alert-circle text-red-500 text-xs mt-0.5 flex-shrink-0"></i>
                  <p class="text-[10px] text-red-600 leading-relaxed line-clamp-2">
                    {{ product.rejectionReason }}
                  </p>
                  <!-- تولتیپ -->
                  <div class="absolute bottom-full right-0 mb-2 w-64 p-2 bg-gray-800 text-white text-[10px] rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                    {{ product.rejectionReason }}
                    <div class="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
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
            :class="{ 'pointer-events-none opacity-50 bg-orange-50': product.status === 'pending'}"
        >
          <div class="flex gap-3 mb-3">
            <div class="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                  v-if="product.image"
                  :src="resolveUrl(product.image)"
                  :alt="product.name"
                  class="w-full h-full object-cover"
              >
              <div v-else class="w-full h-full flex items-center justify-center">
                <i class="ti ti-shopping-bag text-gray-400 text-2xl"></i>
              </div>
            </div>
            <div class="flex-1">
              <div class="flex items-start justify-between mb-1">
                <h4 class="font-bold text-gray-900">{{ product.name }}</h4>
                <button
                    @click="toggleProductStatus(product)"
                    :class="[
                            'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer hover:opacity-80 border',
                            product.isActive
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          ]"
                >
                  <i :class="product.isActive ? 'ti ti-check' : 'ti ti-x'"></i>
                  {{ product.isActive ? 'فعال' : 'غیرفعال' }}
                </button>
              </div>
              <p class="text-xs text-gray-500 mb-2">کد: {{ product.code }}</p>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs text-gray-600">{{ product.categoryBreadcrumb }}</span>
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

          <!-- بخش تاییدیه مدیر برای موبایل -->
          <div class="mb-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-gray-500">تاییدیه مدیر</span>
              <span :class="[
                'inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border',
                getStatusClass(product.status)
              ]">
                <i :class="getStatusIcon(product.status)"></i>
                {{ getStatusLabel(product.status, product) }}
              </span>
            </div>
            <!-- نمایش دلیل رد شدن در صورت وجود -->
            <div v-if="product.status === 'rejected' && product.rejectionReason"
                 class="flex items-start gap-1.5 mt-2">
              <i class="ti ti-alert-circle text-red-500 text-xs mt-0.5 flex-shrink-0"></i>
              <p class="text-[10px] text-red-600 leading-relaxed">
                {{ product.rejectionReason }}
              </p>
            </div>
          </div>

          <div class="flex gap-2">
            <!-- دکمه واریانت فقط برای محصولات فروشگاه نمایش داده شود -->
            <button
                v-if="productTypeFilter !== 'medicine'"
                @click="openVariantModal(product)"
                class="flex-1 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg font-bold text-sm hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"
            >
              <i class="ti ti-layers"></i>
              واریانت
            </button>

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
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-teal-500 hover:text-teal-600'
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
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-teal-500 hover:text-teal-600'
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
                    ? 'bg-teal-600 text-white'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-teal-500 hover:text-teal-600'
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
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-teal-500 hover:text-teal-600'
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
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-teal-500 hover:text-teal-600'
              ]"
            >
              <i class="ti ti-chevrons-left"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Type Selection Modal -->
    <Teleport to="body">
      <transition name="modal">
        <div
            v-if="showProductTypeModal"
            @click.self="showProductTypeModal = false"
            class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
        >
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <!-- Modal Header -->
            <div class="bg-teal-600 px-6 py-4 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <i class="ti ti-plus text-2xl text-white"></i>
                <h3 class="text-xl font-bold text-white">افزودن محصول جدید</h3>
              </div>
              <button
                  @click="showProductTypeModal = false"
                  class="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <i class="ti ti-x text-xl"></i>
              </button>
            </div>

            <!-- Modal Body -->
            <div class="p-6">
              <p class="text-gray-600 mb-6 text-center">نوع محصولی که می‌خواهید اضافه کنید را انتخاب کنید:</p>

              <div class="grid grid-cols-2 gap-4">
                <!-- افزودن محصول فروشگاه -->
                <button
                    @click="goToAddShopProduct"
                    class="bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-purple-500 rounded-2xl p-6 transition-all"
                >
                  <div class="flex flex-col items-center gap-4">
                    <div class="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center">
                      <i class="ti ti-shopping-bag text-4xl text-purple-600"></i>
                    </div>
                    <div>
                      <h4 class="text-lg font-bold text-gray-900">محصول فروشگاه</h4>
                      <p class="text-xs text-gray-500 mt-1">غذا، لوازم و اسباب‌بازی</p>
                    </div>
                  </div>
                </button>

                <!-- افزودن دارو فروشگاه -->
                <button
                    @click="goToAddShopMedicine"
                    class="bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-purple-500 rounded-2xl p-6 transition-all"
                >
                  <div class="flex flex-col items-center gap-4">
                    <div class="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center">
                      <i class="ti ti-medicine-syrup text-4xl text-purple-600"></i>
                    </div>
                    <div>
                      <h4 class="text-lg font-bold text-gray-900">دارو</h4>
                      <p class="text-xs text-gray-500 mt-1">انواع دارو و ملزومات آن</p>
                    </div>
                  </div>
                </button>
              </div>

            </div>
          </div>
        </div>
      </transition>
    </Teleport>

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
                  <img v-if="selectedProduct.image" :src="resolveUrl(selectedProduct.image)" :alt="selectedProduct.name"
                       class="w-full h-full object-cover">
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
                    <p class="font-bold text-gray-900">{{ selectedProduct.categoryBreadcrumb }}</p>
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
                    <p class="text-sm font-bold text-gray-900">{{ formatDate(selectedProduct.createdAt) }}</p>
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

    <!-- Variant Modal -->
    <Teleport to="body">
      <transition name="modal">
        <div
            v-if="showVariantModal && selectedProduct"
            @click.self="closeVariantModal"
            class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 sm:p-6"
        >
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">

            <!-- Modal Header -->
            <div class="bg-purple-600 px-4 sm:px-6 py-4 flex items-center justify-between shrink-0">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <i class="ti ti-layers text-2xl text-white"></i>
                </div>
                <div>
                  <h3 class="text-lg sm:text-xl font-bold text-white">مدیریت واریانت‌ها</h3>
                  <p class="text-purple-200 text-xs sm:text-sm">{{ selectedProduct.name }}</p>
                </div>
              </div>
              <button
                  @click="closeVariantModal"
                  class="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <i class="ti ti-x text-xl"></i>
              </button>
            </div>

            <!-- Modal Body -->
            <div class="p-4 sm:p-6 overflow-y-auto flex-1 bg-gray-50/50">
              <div class="space-y-6">

                <!-- List of Variants -->
                <div v-if="tempVariants.length > 0" class="space-y-6">
                  <div
                      v-for="(variant, vIndex) in tempVariants"
                      :key="vIndex"
                      class="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                  >
                    <!-- Variant Header -->
                    <div class="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <span class="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <span class="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs">
                      {{ vIndex + 1 }}
                    </span>
                    مشخصات واریانت
                  </span>
                      <button
                          @click="removeVariant(vIndex)"
                          class="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1"
                      >
                        <i class="ti ti-trash"></i>
                        حذف
                      </button>
                    </div>

                    <div class="p-4 sm:p-5">
                      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

                        <!-- Column 1: Image (Full width on mobile, 3 cols on desktop) -->
                        <div class="lg:col-span-3">
                          <label class="block text-xs font-bold text-gray-600 mb-2">تصویر محصول</label>
                          <div
                              class="relative w-full aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-purple-500 bg-gray-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group"
                              @click="triggerVariantImageUpload(vIndex)"
                          >
                            <img
                                v-if="variant.imagePreview"
                                :src="variant.imagePreview"
                                class="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                            <div v-else class="text-center p-4">
                              <i class="ti ti-camera-plus text-3xl text-gray-300 group-hover:text-purple-500 mb-2 transition-colors"></i>
                              <p class="text-xs text-gray-500 font-medium">انتخاب تصویر</p>
                            </div>

                            <!-- Remove Image Button -->
                            <button
                                v-if="variant.imagePreview || variant.imageFile"
                                @click.stop="removeVariantImage(vIndex)"
                                class="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg transition-colors"
                            >
                              <i class="ti ti-x text-sm"></i>
                            </button>

                            <input
                                :ref="el => { if(el) variantImageInputs[vIndex] = el }"
                                type="file"
                                accept="image/*"
                                class="hidden"
                                @change="handleVariantImageUpload($event, vIndex)"
                            />
                          </div>
                        </div>

                        <!-- Column 2: Details (Full width on mobile, 9 cols on desktop) -->
                        <div class="lg:col-span-9 space-y-5">
                          <!-- Name Input -->
                          <div>
                            <label class="block text-xs font-bold text-gray-600 mb-1.5">نام واریانت</label>
                            <input
                                v-model="variant.name"
                                type="text"
                                class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none text-sm"
                                placeholder="مثلاً: قرمز - سایز لارج"
                            />
                          </div>

                          <!-- Price & Stock Grid -->
                          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label class="block text-xs font-bold text-gray-600 mb-1.5">قیمت (تومان)</label>
                              <input
                                  v-model.number="variant.price"
                                  type="number"
                                  class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none text-sm font-english dir-ltr"
                                  placeholder="0"
                              />
                            </div>
                            <div>
                              <label class="block text-xs font-bold text-gray-600 mb-1.5">موجودی (عدد)</label>
                              <input
                                  v-model.number="variant.stock"
                                  type="number"
                                  class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none text-sm font-english dir-ltr"
                                  placeholder="0"
                              />
                            </div>
                          </div>

                          <!-- Attributes Section -->
                          <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <div class="flex items-center justify-between mb-3">
                              <span class="text-xs font-bold text-gray-600">ویژگی‌های فنی</span>
                              <button
                                  @click="addAttribute(vIndex)"
                                  class="text-xs text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1"
                              >
                                <i class="ti ti-plus"></i>
                                افزودن ویژگی
                              </button>
                            </div>

                            <div v-if="variant.attributesList && variant.attributesList.length > 0" class="space-y-2">
                              <div
                                  v-for="(attr, aIndex) in variant.attributesList"
                                  :key="aIndex"
                                  class="flex flex-col sm:flex-row gap-2 items-start sm:items-center"
                              >
                                <input
                                    v-model="attr.key"
                                    type="text"
                                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs focus:border-purple-500 outline-none bg-white"
                                    placeholder="نام (مثلا: رنگ)"
                                />
                                <input
                                    v-model="attr.value"
                                    type="text"
                                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs focus:border-purple-500 outline-none bg-white"
                                    placeholder="مقدار (مثلا: قرمز)"
                                />
                                <button
                                    @click="removeAttribute(vIndex, aIndex)"
                                    class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-1 sm:mt-0"
                                >
                                  <i class="ti ti-trash"></i>
                                </button>
                              </div>
                            </div>
                            <div v-else class="text-center py-4 text-xs text-gray-400 bg-white rounded-lg border border-dashed border-gray-200">
                              هنوز ویژگی‌ای تعریف نشده است.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
                  <div class="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-3">
                    <i class="ti ti-box text-3xl text-gray-300"></i>
                  </div>
                  <p class="text-sm text-gray-500 font-medium">هنوز واریانتی اضافه نشده است.</p>
                </div>

                <!-- Add New Variant Button -->
                <button
                    @click="addVariantRow"
                    class="w-full py-3 border-2 border-dashed border-purple-300 text-purple-600 rounded-xl font-bold hover:bg-purple-50 hover:border-purple-400 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <i class="ti ti-plus-circle text-lg"></i>
                  افزودن واریانت جدید
                </button>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-3 justify-end shrink-0">
              <button
                  @click="closeVariantModal"
                  class="w-full sm:w-auto px-6 py-2.5 bg-white hover:bg-gray-100 text-gray-700 rounded-xl font-bold transition-all border border-gray-300 shadow-sm"
              >
                انصراف
              </button>
              <button
                  @click="saveVariants"
                  class="w-full sm:w-auto px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
              >
                <i class="ti ti-device-floppy"></i>
                ذخیره تغییرات
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
import { useRouter } from 'vue-router'
import medicineCategories from '@/data/medicine-categories.json'
import categories from '@/data/categories.json'
import {usePharmacyProductStore} from "@/stores/pharmacy/product.js";
import {useMedicineStore} from "@/stores/pharmacy/medicine.store.js";
import {useUrlHelper} from "@/composables/useUrlHelper.js";

const router = useRouter()
const productStore = usePharmacyProductStore()
const medicineStore = useMedicineStore()
const {resolveUrl}=useUrlHelper()
// State
const searchQuery = ref('')
const productTypeFilter = ref('')
const showLowStock = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(25)
const showItemsDropdown = ref(false)
const showProductTypeModal = ref(false)
const isLoading = ref(true)
const showViewModal = ref(false)
const selectedProduct = ref(null)
const showVariantModal = ref(false)
const tempVariants = ref([])

// Products data
const products = computed(() => productStore.products)
const medicines = computed(() => medicineStore.medicines)

// Load products from localStorage or use sample data
onMounted(async () => {
  await productStore.fetchGlobalProducts()
})

// Save products to localStorage
const saveProducts = () => {
  try {
    localStorage.setItem('pharmacy_products', JSON.stringify(products.value))
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
  totalProducts: products.value.filter(p => p.type === 'shop').length,
  medicines: products.value.filter(p => p.type === 'medicine').length,
  shopProducts: products.value.filter(p => p.type === 'shop').length,
  lowStock: products.value.filter(p => p.type === 'shop' && p.stock < 10).length,
}))

// Filtered Products
const allFilteredProducts = computed(() => {
  let filtered = []

  // اگر تب داروها انتخاب شده باشد
  if (productTypeFilter.value === 'medicine'&& medicines.value.length>0) {
    filtered = medicines.value.map(m => ({
      ...m,
      // نگاشت فیلدهای دارو به فیلدهای استاندارد محصول برای نمایش در جدول
      name: m.medicine?.name,
      code: m.medicine?.code,
      image: m.medicine?.image,
      categoryBreadcrumb: m.medicine?.categoryBreadcrumb,
      // فیلدهای موجودی و قیمت از سطح اصلی آبجکت
      price: m.price,
      stock: m.stock,
      status: m.status,
      isActive: m.isActive
    }))
  } else {
    // برای محصولات فروشگاه
    filtered = products.value.filter(p => p.type === 'shop')

    // فیلتر بر اساس نوع (اگر غیر از shop انتخاب شده بود)
    if (productTypeFilter.value) {
      filtered = filtered.filter(p => p.type === productTypeFilter.value)
    }

    // فیلتر کمبود موجودی
    if (showLowStock.value) {
      filtered = filtered.filter(p => p.stock < 10)
    }
  }

  // اعمال جستجو (مشترک برای هر دو حالت)
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p => {
      const name = p.name || p.medicine?.name || ''
      const code = p.code || p.medicine?.code || ''
      const category = p.categoryBreadcrumb || p.medicine?.category || ''

      return name.toLowerCase().includes(query) ||
          code.toLowerCase().includes(query) ||
          category.toLowerCase().includes(query)
    })
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

const formatDate = (value) => {
  return new Date(value).toLocaleDateString('fa-IR')
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
  if (productTypeFilter.value === 'medicine') {
    // هدایت به صفحه ویرایش دارو
    router.push(`/pharmacies/products/add-medicine?id=${product.id}`)
  } else {
    // هدایت به صفحه ویرایش محصول فروشگاه
    router.push(`/pharmacies/products/add-shop?id=${product.id}`)
  }
}

const deleteProduct = async (product) => {
  // استفاده از نام صحیح برای داروها
  const productName = productTypeFilter.value === 'medicine'
      ? (product.medicine?.name || product.name)
      : product.name

  if (confirm(`آیا از حذف محصول "${productName}" اطمینان دارید؟`)) {
    if (productTypeFilter.value === 'medicine') {
      await medicineStore.deleteMedicine(product.id)
    } else {
      await productStore.deleteProduct(product.id)
    }
  }
}

const openAddModal = () => {
  showProductTypeModal.value = true
}

const goToAddMedicine = () => {
  showProductTypeModal.value = false
  router.push('/pharmacies/products/add-medicine')
}

const goToAddShopProduct = () => {
  showProductTypeModal.value = false
  router.push('/pharmacies/products/add-shop')
}

const goToAddShopMedicine = () => {
  showProductTypeModal.value = false
  router.push('/pharmacies/products/add-medicine')
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
onMounted(async () => {
  await productStore.fetchGlobalProducts()
  await medicineStore.fetchMedicines()
  if (typeof window !== 'undefined') {
    window.addEventListener('product-added', (event) => {
      if (event.detail) {
        addProduct(event.detail)
      }
    })
    // Listen for storage changes from other tabs
    window.addEventListener('storage', (event) => {
      if (event.key === 'pharmacy_products') {
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

const getStatusClass = (status) => {
  switch (status) {
    case 'approved':
      return 'bg-green-50 text-green-700 border-green-100';
    case 'pending':
      return 'bg-amber-50 text-amber-700 border-amber-100';
    case 'rejected':
      return 'bg-red-50 text-red-700 border-red-100';
    case 'needs_revision':
      return 'bg-orange-50 text-orange-700 border-orange-100';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-100';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'approved':
      return 'ti ti-check';
    case 'pending':
      return 'ti ti-loader';
    case 'rejected':
      return 'ti ti-x-circle';
    case 'needs_revision':
      return 'ti ti-alert-triangle';
    default:
      return 'ti ti-help';
  }
};

const getStatusLabel = (status, product) => {
  switch (status) {
    case 'approved':
      return 'تایید شده';
    case 'pending':
      return 'در انتظار تایید';
    case 'rejected':
      return 'رد';//product.rejectionReason;
    case 'needs_revision':
      return 'در انتظار ویرایش';//product.rejectionReason;
    default:
      return 'نامشخص';
  }
};

const toggleProductStatus = async (product) => {
  try {
    if (productTypeFilter.value === 'medicine') {
      await medicineStore.updateMedicineStatus(product.id, !product.isActive);
    }else{
      await productStore.updateProductStatus(product.id, !product.isActive);
    }

    // اگر API failed شد، دوباره برگردانید:
    // product.isActive = !product.isActive;
  } catch (error) {
    console.error('Error updating status:', error);
  }
};

// --- Variant Modal Logic ---
// آرایه‌ای برای نگهداری رفرنس‌های اینپوت فایل
const variantImageInputs = ref([]);

/* بستن مودال واریانت */
const closeVariantModal = () => {
  showVariantModal.value = false;
  selectedProduct.value = null;
  tempVariants.value = [];
  variantImageInputs.value = [];
};

// --- توابع مدیریت تصویر ---
/** کلیک روی باکس آپلود باعث کلیک روی اینپوت مخفی می‌شود */
const triggerVariantImageUpload = (index) => {
  const input = variantImageInputs.value[index];
  if (input) {
    input.click();
  }
};

/** هندل کردن انتخاب فایل توسط کاربر */
const handleVariantImageUpload = (event, index) => {
  const file = event.target.files[0];
  if (!file) return;
  // ایجاد URL برای پیش‌نمایش
  const previewUrl = URL.createObjectURL(file);
  // آپدیت کردن آبجکت واریانت
  tempVariants.value[index].imageFile = file;
  tempVariants.value[index].imagePreview = previewUrl;
};

/** حذف تصویر انتخاب شده */
const removeVariantImage = (index) => {
  tempVariants.value[index].imageFile = null;
  tempVariants.value[index].imagePreview = null;
  // پاک کردن اینپوت فایل برای اینکه اگر همان فایل دوباره انتخاب شد change event اجرا شود
  if (variantImageInputs.value[index]) {
    variantImageInputs.value[index].value = '';
  }
};

// --- توابع ویژگی‌ها (بدون تغییر) ---
const addAttribute = (variantIndex) => {
  if (tempVariants.value[variantIndex]) {
    tempVariants.value[variantIndex].attributesList.push({
      key: '',
      value: ''
    });
  }
};

const removeAttribute = (variantIndex, attrIndex) => {
  if (tempVariants.value[variantIndex]) {
    tempVariants.value[variantIndex].attributesList.splice(attrIndex, 1);
  }
};

/** باز کردن مودال واریانت برای یک محصول خاص */
const openVariantModal = (product) => {
  selectedProduct.value = product;
  if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
    // نگهداری ID بسیار مهم است تا استور بتواند ویرایش را تشخیص دهد
    tempVariants.value = product.variants.map(v => {
      const attributesList = [];
      if (v.attributes && typeof v.attributes === 'object') {
        Object.keys(v.attributes).forEach(key => {
          attributesList.push({ key: key, value: v.attributes[key] });
        });
      }
      return {
        id: v.id, // حفظ ID برای ویرایش
        name: v.name,
        attributesList: attributesList,
        price: v.price,
        stock: v.stock,
        isActive: v.isActive,
        imagePreview: resolveUrl(v.image) || null,
        imageFile: null
      };
    });
  } else {
    tempVariants.value = [];
  }
  showVariantModal.value = true;
};

/** افزودن یک ردیف واریانت خالی (بدون ID = جدید) */
const addVariantRow = () => {
  tempVariants.value.push({
    // id را نمی‌گذاریم تا استور آن را به عنوان "جدید" بشناسد
    name: '',
    attributesList: [],
    price: 0,
    stock: 0,
    isActive: true,
    imageFile: null,
    imagePreview: null
  });
};

/** حذف یک ردیف واریانت از لیست موقت (فقط از لیست فرم حذف می‌شود، با زدن دکمه ذخیره از دیتابیس هم پاک می‌شود) */
const removeVariant = (index) => {
  tempVariants.value.splice(index, 1);
};

const saveVariants = async () => {
  if (!selectedProduct.value) return;
  try {
    const variantsPayload = tempVariants.value.map(v => {
      const attributes = {};
      if (v.attributesList && Array.isArray(v.attributesList)) {
        v.attributesList.forEach(item => {
          if (item.key && item.key.trim() !== '') {
            attributes[item.key] = item.value;
          }
        });
      }
      return {
        id: v.id, // ارسال ID (اگر وجود داشته باشد)
        name: v.name || 'بدون نام',
        attributes: attributes,
        price: Number(v.price) || 0,
        stock: Number(v.stock) || 0,
        isActive: v.isActive !== undefined ? v.isActive : true,
        imageFile: v.imageFile,
        image: v.imagePreview // ارسال URL عکس قبلی برای مواقعی که عکس عوض نشده
      };
    });
    // ارسال به استور
    const res = await productStore.syncVariants(selectedProduct.value.id, variantsPayload);
    closeVariantModal();

    if (typeof window.showToast === 'function'&&res.statusCode===200) {
      window.showToast(`واریانت با موفقیت ایجاد/ویرایش شد!`, 'success', 5000);
    }
  } catch (err) {
    const status = err.response?.status;
    const errorMessage = err.response?.data;
    //console.error('Error saving variants:', error);
    //alert('خطا در ذخیره واریانت‌ها');
    if (typeof window.showToast === 'function') {
      // متن را با تگ bold زیبا کنید
      const safeMessage = errorMessage.replace(/(.+)/, '<strong>$1</strong>');
      window.showToast(safeMessage, 'error', 5000, status);
    }
  }
};
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
