<template>
  <div class="space-y-6 pb-24 md:pb-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">مدیریت کلینیک‌ها و دامپزشکان</h1>
        <p class="text-gray-500 mt-1">کلینیک‌ها و دامپزشکان فعال در سیستم</p>
      </div>
      <div class="flex items-center gap-2">
        <button @click="exportToExcel" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
          <i class="ti ti-file-spreadsheet text-green-600"></i>
          خروجی اکسل
        </button>
        <span class="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-full text-sm">
          <i class="ti ti-building-hospital ml-1"></i>
          {{ activeClinics.length }} کلینیک
        </span>
        <span class="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm">
          <i class="ti ti-stethoscope ml-1"></i>
          {{ activeVets.length }} دامپزشک
        </span>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white rounded-xl border border-gray-200 p-1.5 flex gap-1">
      <button 
        @click="activeTab = 'clinics'"
        class="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors"
        :class="activeTab === 'clinics' ? 'bg-rose-500 text-white' : 'text-gray-600 hover:bg-gray-100'"
      >
        <i class="ti ti-building-hospital ml-2"></i>
        کلینیک‌ها ({{ clinics.length }})
      </button>
      <button 
        @click="activeTab = 'vets'"
        class="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors"
        :class="activeTab === 'vets' ? 'bg-emerald-500 text-white' : 'text-gray-600 hover:bg-gray-100'"
      >
        <i class="ti ti-stethoscope ml-2"></i>
        دامپزشکان ({{ vets.length }})
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl p-4 border border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="relative">
          <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            v-model="filters.search"
            type="text"
            :placeholder="activeTab === 'clinics' ? 'جستجو نام کلینیک...' : 'جستجو نام دامپزشک...'"
            class="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <AppSelect
          v-model="filters.city"
          :options="cityOptions"
          placeholder="همه شهرها"
          icon="ti ti-map-pin"
        />

        <AppSelect
          v-if="activeTab === 'vets'"
          v-model="filters.specialty"
          :options="specialtyOptions"
          placeholder="همه تخصص‌ها"
          icon="ti ti-certificate"
        />

        <AppSelect
          v-model="filters.sort"
          :options="sortOptions"
          placeholder="مرتب‌سازی"
          icon="ti ti-arrows-sort"
        />
      </div>
    </div>

    <!-- کلینیک‌ها Grid -->
    <div v-if="activeTab === 'clinics'" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div 
        v-for="clinic in filteredClinics" 
        :key="clinic.id"
        class="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all"
      >
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white">
              <i class="ti ti-building-hospital text-xl"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-900">{{ clinic.name }}</h3>
              <p class="text-sm text-gray-500">{{ clinic.manager }}</p>
            </div>
          </div>
          
          <AppDropdown
            :items="getClinicDropdownItems(clinic)"
            @select="handleClinicAction($event, clinic)"
            position="bottom-start"
          >
            <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <i class="ti ti-dots-vertical text-gray-500"></i>
            </button>
          </AppDropdown>
        </div>

        <!-- Info -->
        <div class="space-y-2 mb-4">
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <i class="ti ti-map-pin text-gray-400"></i>
            <span>{{ clinic.city }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <i class="ti ti-phone text-gray-400"></i>
            <span dir="ltr">{{ clinic.phone }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <i class="ti ti-stethoscope text-gray-400"></i>
            <span>{{ clinic.vetsCount }} دامپزشک</span>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-2 p-3 bg-gray-50 rounded-lg mb-4">
          <div class="text-center">
            <p class="text-lg font-bold text-gray-900">{{ clinic.appointments }}</p>
            <p class="text-xs text-gray-500">نوبت</p>
          </div>
          <div class="text-center border-x border-gray-200">
            <p class="text-lg font-bold text-gray-900">{{ clinic.reviewsCount }}</p>
            <p class="text-xs text-gray-500">نظر</p>
          </div>
          <div class="text-center">
            <div class="flex items-center justify-center gap-1">
              <i class="ti ti-star-filled text-amber-400 text-sm"></i>
              <span class="font-bold text-gray-900">{{ clinic.rating }}</span>
            </div>
            <p class="text-xs text-gray-500">امتیاز</p>
          </div>
        </div>

        <!-- Status Badge -->
        <div class="flex items-center justify-between">
          <span 
            class="px-3 py-1 rounded-full text-xs font-medium"
            :class="clinic.isSuspended===true ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'"
          >
            {{ clinic.isSuspended===true ? 'تعلیق شده' : 'فعال' }}
          </span>
          <span class="text-xs text-gray-400">عضویت: {{ clinic.joinDate }}</span>
        </div>
      </div>
    </div>

    <!-- دامپزشکان Grid -->
    <div v-if="activeTab === 'vets'" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div 
        v-for="vet in filteredVets" 
        :key="vet.id"
        class="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all"
      >
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
              {{ vet.name.charAt(0) }}
            </div>
            <div>
              <h3 class="font-bold text-gray-900">{{ vet.name }}</h3>
              <span class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                {{ vet.specialty }}
              </span>
            </div>
          </div>
          
          <AppDropdown
            :items="getVetDropdownItems(vet)"
            @select="handleVetAction($event, vet)"
            position="bottom-start"
          >
            <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <i class="ti ti-dots-vertical text-gray-500"></i>
            </button>
          </AppDropdown>
        </div>

        <!-- Info -->
        <div class="space-y-2 mb-4">
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <i class="ti ti-building-hospital text-gray-400"></i>
            <span>{{ vet.clinic || 'دامپزشک مستقل' }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <i class="ti ti-phone text-gray-400"></i>
            <span dir="ltr">{{ vet.phone }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <i class="ti ti-id-badge text-gray-400"></i>
            <span>نظام پزشکی: {{ vet.licenseNumber }}</span>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-2 p-3 bg-gray-50 rounded-lg mb-4">
          <div class="text-center">
            <p class="text-lg font-bold text-gray-900">{{ vet.appointments }}</p>
            <p class="text-xs text-gray-500">ویزیت</p>
          </div>
          <div class="text-center border-x border-gray-200">
            <p class="text-lg font-bold text-gray-900">{{ vet.reviewsCount }}</p>
            <p class="text-xs text-gray-500">نظر</p>
          </div>
          <div class="text-center">
            <div class="flex items-center justify-center gap-1">
              <i class="ti ti-star-filled text-amber-400 text-sm"></i>
              <span class="font-bold text-gray-900">{{ vet.rating }}</span>
            </div>
            <p class="text-xs text-gray-500">امتیاز</p>
          </div>
        </div>

        <!-- Status Badge -->
        <div class="flex items-center justify-between">
          <span 
            class="px-3 py-1 rounded-full text-xs font-medium"
            :class="vet.isSuspended ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'"
          >
            {{ vet.isSuspended ? 'تعلیق شده' : 'فعال' }}
          </span>
          <span class="text-xs text-gray-400">عضویت: {{ vet.joinDate }}</span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="(activeTab === 'clinics' && filteredClinics.length === 0) || (activeTab === 'vets' && filteredVets.length === 0)" 
         class="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <i :class="['text-3xl text-gray-400', activeTab === 'clinics' ? 'ti ti-building-hospital-off' : 'ti ti-stethoscope-off']"></i>
      </div>
      <h3 class="font-bold text-gray-900 mb-2">{{ activeTab === 'clinics' ? 'کلینیکی یافت نشد' : 'دامپزشکی یافت نشد' }}</h3>
      <p class="text-gray-500">با فیلترهای انتخاب شده موردی وجود ندارد</p>
    </div>

    <!-- Suspend Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showSuspendModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50" @click="showSuspendModal = false"></div>
          <div class="relative bg-white rounded-2xl w-full max-w-md p-6">
            <button @click="showSuspendModal = false" class="absolute left-4 top-4 p-1 hover:bg-gray-100 rounded-lg">
              <i class="ti ti-x text-gray-500"></i>
            </button>

            <div class="text-center mb-6">
              <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="ti ti-ban text-3xl text-red-600"></i>
              </div>
              <h3 class="text-lg font-bold text-gray-900">تعلیق {{ suspendType === 'clinic' ? 'کلینیک' : 'دامپزشک' }}</h3>
              <p class="text-gray-500 mt-1">{{ selectedItem?.name }}</p>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">دلیل تعلیق</label>
                <textarea
                  v-model="suspendReason"
                  rows="3"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500"
                  placeholder="دلیل تعلیق را وارد کنید..."
                ></textarea>
              </div>

              <div class="flex gap-3">
                <button 
                  @click="showSuspendModal = false"
                  class="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
                >
                  انصراف
                </button>
                <button 
                  @click="confirmSuspend"
                  class="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700"
                >
                  تعلیق
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Details Modal -->
      <Transition name="modal">
        <div v-if="showDetailsModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50" @click="showDetailsModal = false"></div>
          <div class="relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <!-- Header -->
            <div class="p-5 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div class="flex items-center gap-3">
                <div :class="['w-12 h-12 rounded-xl flex items-center justify-center', detailsType === 'clinic' ? 'bg-rose-100' : 'bg-emerald-100']">
                  <i :class="['text-xl', detailsType === 'clinic' ? 'ti ti-building-hospital text-rose-600' : 'ti ti-stethoscope text-emerald-600']"></i>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 text-lg">{{ selectedItem?.name }}</h3>
                  <p class="text-sm text-gray-500">{{ detailsType === 'clinic' ? selectedItem?.manager : selectedItem?.specialty }}</p>
                </div>
              </div>
              <button @click="showDetailsModal = false" class="p-2 hover:bg-gray-100 rounded-lg">
                <i class="ti ti-x text-gray-500"></i>
              </button>
            </div>

            <!-- Tabs -->
            <div class="border-b border-gray-200 px-5 shrink-0">
              <div class="flex gap-6">
                <button 
                  @click="detailsTab = 'info'" 
                  :class="['py-3 text-sm font-medium border-b-2 -mb-px transition-colors', detailsTab === 'info' ? (detailsType === 'clinic' ? 'border-rose-500 text-rose-600' : 'border-emerald-500 text-emerald-600') : 'border-transparent text-gray-500 hover:text-gray-700']"
                >
                  <i class="ti ti-info-circle ml-1"></i>
                  اطلاعات {{ detailsType === 'clinic' ? 'کلینیک' : 'دامپزشک' }}
                </button>
                <button 
                  @click="detailsTab = 'finance'" 
                  :class="['py-3 text-sm font-medium border-b-2 -mb-px transition-colors', detailsTab === 'finance' ? (detailsType === 'clinic' ? 'border-rose-500 text-rose-600' : 'border-emerald-500 text-emerald-600') : 'border-transparent text-gray-500 hover:text-gray-700']"
                >
                  <i class="ti ti-chart-bar ml-1"></i>
                  گزارش مالی
                </button>
                <button 
                  @click="detailsTab = 'reviews'" 
                  :class="['py-3 text-sm font-medium border-b-2 -mb-px transition-colors', detailsTab === 'reviews' ? (detailsType === 'clinic' ? 'border-rose-500 text-rose-600' : 'border-emerald-500 text-emerald-600') : 'border-transparent text-gray-500 hover:text-gray-700']"
                >
                  <i class="ti ti-star ml-1"></i>
                  امتیازات و نظرات
                </button>
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-5">
              <!-- اطلاعات -->
              <div v-if="detailsTab === 'info'" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="bg-gray-50 rounded-xl p-4 space-y-4">
                    <h4 class="font-bold text-gray-900 flex items-center gap-2">
                      <i :class="['ti', detailsType === 'clinic' ? 'ti-building-hospital text-rose-500' : 'ti-stethoscope text-emerald-500']"></i>
                      اطلاعات اصلی
                    </h4>
                    <div class="space-y-3">
                      <div class="flex justify-between"><span class="text-gray-500">نام:</span><span class="font-medium">{{ selectedItem?.name }}</span></div>
                      <div v-if="detailsType === 'clinic'" class="flex justify-between"><span class="text-gray-500">مدیر:</span><span class="font-medium">{{ selectedItem?.manager }}</span></div>
                      <div v-if="detailsType === 'vet'" class="flex justify-between"><span class="text-gray-500">تخصص:</span><span class="font-medium">{{ selectedItem?.specialty }}</span></div>
                      <div v-if="detailsType === 'vet'" class="flex justify-between"><span class="text-gray-500">شماره نظام:</span><span class="font-medium">{{ selectedItem?.licenseNumber }}</span></div>
                      <div class="flex justify-between"><span class="text-gray-500">تاریخ عضویت:</span><span class="font-medium">{{ selectedItem?.joinDate }}</span></div>
                    </div>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-4 space-y-4">
                    <h4 class="font-bold text-gray-900 flex items-center gap-2">
                      <i class="ti ti-phone text-blue-500"></i>
                      اطلاعات تماس
                    </h4>
                    <div class="space-y-3">
                      <div class="flex justify-between"><span class="text-gray-500">تلفن:</span><span class="font-medium font-mono">{{ selectedItem?.phone }}</span></div>
                      <div v-if="detailsType === 'clinic'" class="flex justify-between"><span class="text-gray-500">شهر:</span><span class="font-medium">{{ selectedItem?.city }}</span></div>
                      <div v-if="detailsType === 'vet'" class="flex justify-between"><span class="text-gray-500">کلینیک:</span><span class="font-medium">{{ selectedItem?.clinic || 'مستقل' }}</span></div>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div v-if="detailsType === 'clinic'" class="bg-blue-50 rounded-xl p-4 text-center"><p class="text-3xl font-bold text-blue-600">{{ selectedItem?.vetsCount }}</p><p class="text-sm text-blue-700 mt-1">دامپزشک</p></div>
                  <div class="bg-green-50 rounded-xl p-4 text-center"><p class="text-3xl font-bold text-green-600">{{ selectedItem?.appointments }}</p><p class="text-sm text-green-700 mt-1">ویزیت</p></div>
                  <div v-if="detailsType === 'clinic'" class="bg-purple-50 rounded-xl p-4 text-center"><p class="text-3xl font-bold text-purple-600">{{ selectedItem?.reviewsCount }}</p><p class="text-sm text-purple-700 mt-1">نظر</p></div>
                  <div class="bg-amber-50 rounded-xl p-4 text-center"><p class="text-3xl font-bold text-amber-600">{{ selectedItem?.rating }}</p><p class="text-sm text-amber-700 mt-1">امتیاز</p></div>
                  <div v-if="detailsType === 'vet'" class="bg-rose-50 rounded-xl p-4 text-center"><p class="text-3xl font-bold text-rose-600">{{ selectedItem?.reviewsCount }}</p><p class="text-sm text-rose-700 mt-1">نظر</p></div>
                </div>

                <!-- وضعیت -->
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div class="flex items-center gap-3">

                    <div :class="['w-3 h-3 rounded-full', selectedItem?.isSuspended ? 'bg-red-500' : 'bg-green-500']"></div>

                    <span class="font-medium text-gray-900">{{ selectedItem?.isSuspended ? 'تعلیق شده' : 'فعال' }}</span>
                  </div>
                  <button 
                    @click="showDetailsModal = false; openSuspendModal(selectedItem, detailsType)"
                    :class="['px-4 py-2 rounded-lg text-sm font-medium', selectedItem?.isSuspended ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200']"
                  >
                    {{ selectedItem?.isSuspended ? 'رفع تعلیق' : 'تعلیق کردن' }}
                  </button>
                </div>
              </div>

              <!-- گزارش مالی -->
              <div v-if="detailsTab === 'finance'" class="space-y-6">
                <!-- خلاصه مالی -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm text-green-600">موجودی کیف پول</p>
                        <p class="text-2xl font-bold text-green-700 mt-1">{{ formatCurrency(selectedItem?.walletBalance) }}</p>
                        <p class="text-xs text-green-500 mt-1">تومان</p>
                      </div>
                      <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <i class="ti ti-wallet text-green-600 text-xl"></i>
                      </div>
                    </div>
                  </div>
                  <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm text-blue-600">کل فروش (تایید شده)</p>
                        <p class="text-2xl font-bold text-blue-700 mt-1">{{ formatCurrency(selectedItem?.totalSales) }}</p>
                        <p class="text-xs text-blue-500 mt-1">تومان</p>
                      </div>
                      <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <i class="ti ti-chart-pie text-blue-600 text-xl"></i>
                      </div>
                    </div>
                  </div>
                  <div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm text-amber-600">سفارشات موفق</p>
                        <p class="text-2xl font-bold text-amber-700 mt-1">{{ selectedItem?.completedOrdersCount }}</p>
                        <p class="text-xs text-amber-500 mt-1">عدد</p>
                      </div>
                      <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                        <i class="ti ti-shopping-cart text-amber-600 text-xl"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- تراکنش‌های اخیر -->
                <div class="bg-gray-50 rounded-xl p-4">
                  <h4 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <i class="ti ti-list text-gray-500"></i>
                    تراکنش‌های اخیر کیف پول
                  </h4>
                  <div v-if="selectedItem?.transactions && selectedItem.transactions.length > 0" class="space-y-3">
                    <div v-for="txn in selectedItem.transactions.slice(0, 5)" :key="txn.id" class="bg-white rounded-lg p-3 flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div :class="['w-10 h-10 rounded-lg flex items-center justify-center', txn.type === 'CREDIT' ? 'bg-green-100' : 'bg-red-100']">
                          <i :class="['ti', txn.type === 'CREDIT' ? 'ti-arrow-down-right text-green-600' : 'ti-arrow-up-left text-red-600']"></i>
                        </div>
                        <div>
                          <p class="font-medium text-gray-900 text-sm">{{ txn.description }}</p>
                          <p class="text-xs text-gray-500">{{ new Date(txn.createdAt).toLocaleDateString('fa-IR') }}</p>
                        </div>
                      </div>
                      <p :class="['font-bold text-sm', txn.type === 'CREDIT' ? 'text-green-600' : 'text-red-600']">
                        {{ txn.type === 'CREDIT' ? '+' : '-' }}{{ formatCurrency(txn.amount) }}
                      </p>
                    </div>
                  </div>
                  <div v-else class="text-center py-8 text-gray-500">
                    تراکنشی ثبت نشده است
                  </div>
                </div>
              </div>

              <!-- امتیازات و نظرات -->
              <div v-if="detailsTab === 'reviews'" class="space-y-6">
                <!-- خلاصه امتیازات -->
                <div class="bg-amber-50 border border-amber-200 rounded-xl p-6">
                  <div class="flex items-center gap-8">
                    <!-- امتیاز کلی -->
                    <div class="text-center shrink-0">
                      <p class="text-5xl font-bold text-amber-600">{{ selectedItem?.rating || '0.0' }}</p>
                      <div class="flex items-center justify-center gap-1 mt-2">
                        <i v-for="n in 5" :key="n"
                           :class="['ti ti-star-filled text-lg', n <= Math.floor(selectedItem?.rating || 0) ? 'text-amber-500' : 'text-gray-300']">
                        </i>
                      </div>
                      <p class="text-sm text-amber-700 mt-2">
                        از {{ selectedItem?.reviewsCount || 0 }} نظر
                      </p>
                    </div>
                    <!-- نمودار میله‌ای امتیازات -->
                    <div class="flex-1 space-y-2">
                      <template v-for="star in 5" :key="star">
                        <div class="flex items-center gap-2">
                          <span class="text-sm text-gray-600 w-8">{{ 6 - star }}</span>
                          <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div class="h-full bg-amber-500 rounded-full transition-all duration-500"
                                 :style="{ width: getRatingPercentage(6 - star) + '%' }">
                            </div>
                          </div>
                          <span class="text-sm text-gray-500 w-10">{{ getRatingCount(6 - star) }}</span>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>

                <!-- لیست نظرات -->
                <div class="space-y-4">
                  <h4 class="font-bold text-gray-900">نظرات اخیر</h4>
                  <!-- حالت خالی -->
                  <div v-if="!selectedItem?.reviews || selectedItem.reviews.length === 0"
                       class="bg-white border border-gray-200 rounded-xl p-8 text-center">
                    <i class="ti ti-message-off text-4xl text-gray-300 mb-2"></i>
                    <p class="text-gray-500">هنوز نظری برای این فروشگاه ثبت نشده است.</p>
                  </div>
                  <!-- لیست -->
                  <div v-else v-for="review in selectedItem.reviews" :key="review.id"
                       class="bg-white border border-gray-200 rounded-xl p-4 transition-shadow hover:shadow-md">
                    <div class="flex items-start justify-between mb-3">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">

                          <img
                              :src="review.user?.avatar"
                              :alt="(review.user?.name)?.charAt(0).toUpperCase()"
                              class="w-10 h-10 rounded-full object-cover"
                          >
                        </div>
                        <div>
                          <p class="font-medium text-gray-900">کاربر</p>
                          <p class="text-xs text-gray-500">{{ new Date(review.createdAt).toLocaleDateString('fa-IR') }}</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-1">
                        <i v-for="n in 5" :key="n"
                           :class="['ti ti-star-filled text-sm', n <= review.rating ? 'text-amber-500' : 'ti ti-star text-gray-300']">
                        </i>
                      </div>
                    </div>
                    <p class="text-gray-700 text-sm leading-relaxed">{{ review.comment }}</p>
                    <!-- پاسخ فروشگاه -->
                    <div v-if="review.reply" class="mt-3 pr-4 border-r-2 border-orange-300 bg-orange-50/50 py-2 rounded-r-lg">
                      <p class="text-xs text-orange-700 font-bold mb-1 flex items-center gap-1">
                        <i class="ti ti-brand-telegram"></i> پاسخ فروشگاه:
                      </p>
                      <p class="text-sm text-gray-800">{{ review.reply }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between shrink-0">
              <button 
                @click="detailsType === 'clinic' ? goToClinicDashboard(selectedItem) : goToVetDashboard(selectedItem)" 
                :class="['px-4 py-2 text-white rounded-lg flex items-center gap-2', detailsType === 'clinic' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700']"
              >
                <i class="ti ti-external-link"></i>
                ورود به پنل
              </button>
              <button @click="showDetailsModal = false" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">بستن</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast.show" class="fixed bottom-24 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 z-50">
        <div 
          class="px-4 py-3 rounded-xl shadow-lg flex items-center gap-3"
          :class="{
            'bg-green-600 text-white': toast.type === 'success',
            'bg-red-600 text-white': toast.type === 'error',
            'bg-amber-500 text-white': toast.type === 'warning'
          }"
        >
          <i :class="['ti text-xl', {
            'ti-check': toast.type === 'success',
            'ti-x': toast.type === 'error',
            'ti-alert-triangle': toast.type === 'warning'
          }]"></i>
          <span class="flex-1">{{ toast.message }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppDropdown from '@/components/AppDropdown.vue'
import AppSelect from '@/components/AppSelect.vue'

import{useTenantStore} from "@/stores/tenant.js";
import {useTenantRequestStore} from "@/stores/tenant-request.js";

const tenantReqStore=useTenantRequestStore()
const tenantStore=useTenantStore()
const router = useRouter()

const activeTab = ref('clinics')
const filters = ref({ search: '', city: '', specialty: '', sort: 'newest' })

const cityOptions = computed(() => {
  // ترکیب شهرهای کلینیک‌ها و دامپزشکان و حذف موارد تکراری
  const allCities = [
    ...rawClinics.value.map(c => c.city),
    ...rawVets.value.map(v => v.city)
  ]
  const uniqueCities = [...new Set(allCities.filter(Boolean))]

  return [
    { value: '', label: 'همه شهرها' },
    ...uniqueCities.map(city => ({ value: city, label: city }))
  ]
})

const specialtyOptions = computed(() => {
  // استخراج تخصص‌های یکتا از لیست دامپزشکان
  const allSpecialties = vets.value.map(v => v.specialty).filter(Boolean)
  const uniqueSpecialties = [...new Set(allSpecialties)]

  return [
    { value: '', label: 'همه تخصص‌ها' },
    ...uniqueSpecialties.map(spec => ({ value: spec, label: spec }))
  ]
})

const sortOptions = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'name', label: 'نام' },
  { value: 'rating', label: 'بالاترین امتیاز' }
]
const showSuspendModal = ref(false)
const showDetailsModal = ref(false)
const detailsTab = ref('info')
const detailsType = ref('clinic')
const selectedItem = ref(null)
const suspendType = ref('clinic')
const suspendReason = ref('')
const toast = ref({ show: false, message: '', type: 'success' })
// Helper: Format Currency
const formatCurrency = (value) => {
  if (!value) return '۰'
  return Number(value).toLocaleString('fa-IR')
}
// Helper: Rating Percentage
const getRatingPercentage = (starValue) => {
  if (!selectedItem.value?.reviews) return 0
  const total = selectedItem.value.reviews.length
  if (total === 0) return 0
  const count = selectedItem.value.reviews.filter(r => Math.round(r.rating) === starValue).length
  return Math.round((count / total) * 100)
}

// Helper: Rating Count
const getRatingCount = (starValue) => {
  if (!selectedItem.value?.reviews) return 0
  return selectedItem.value.reviews.filter(r => Math.round(r.rating) === starValue).length
}
// دسترسی به آرایه داروخانه‌ها از استور
const rawClinics = computed(() => tenantStore.clinics || [])

// تبدیل داده‌ها برای هماهنگی با قالب (Mapping)
const clinics = computed(() => {
  return rawClinics.value.map(item => {

    // پیدا کردن تنظیمات قیمت ویزیت
    const clinicInfoSetting = item.tenantSettings.find(s => s.key === 'clinic_info');
    const clinicInfo = clinicInfoSetting?.value || {};

    // Calculate Orders
    const ordersCount = item.orders ? item.orders.length : 0

    // Calculate Financials
    const walletBalance = item.wallet?.balance || 0
    const transactions = item.wallet?.transactions || []

    // Calculate Total Sales (Sum of orders with status PAID, SHIPPED, DELIVERED)
    const completedOrders = item.orders ? item.orders.filter(o =>
        ['CUSTOMER_PAID', 'TENANT_PROCESSING', 'TENANT_SHIPPED', 'DELIVERED'].includes(o.status)
    ) : []

    const totalSales = completedOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)

    // Format Categories
    const category = item.categories && item.categories.length > 0
        ? item.categories.join('، ')
        : '-'

    return {
      id: item.id,
      // اگر نام خالی بود، از نام مالک استفاده می‌کنیم
      name: item.name || item.ownerName || 'بدون نام',
      // نگاشت ownerName به manager که در قالب استفاده شده
      manager: item.ownerName,
      phone: item.phone,
      city: item.city,
      // بررسی وجود مجوز (در داده‌های شما فیلد documents وجود دارد)
      hasLicense: !!item.documents?.license,
      // امتیاز (تبدیل رشته به عدد)
      rating: parseFloat(item.rating) || 0,
      // فرمت تاریخ عضویت
      joinDate: new Date(item.createdAt).toLocaleDateString('fa-IR'),
      // وضعیت فعال بودن کلی
      isActive: item.status === 'active',
      owner: item.ownerName || '-',
      ownerUserId:item.ownerUserId,
      email: item.email,
      address: item.tenantAddress,
      category: category,
      registerDate: item.createdAt ? new Date(item.createdAt).toLocaleDateString('fa-IR') : '-',
      ordersCount: ordersCount,
      reviewsCount: item.reviewsCount,
      isSuspended:item.isSuspended, //tenant.status !== 'active',
      logo: item.documents?.logo?.thumbnail || null,

      // Financial Data for Details Modal
      walletBalance: walletBalance,
      totalSales: totalSales,
      completedOrdersCount: completedOrders.length,
      transactions: transactions,

      // Nested Data for Details Modal
      reviews: item.tenantReviews || [],
      originalData: item,
      vetsCount: item.vetsCount || 0, // اگر فیلد نداشت 0 بگذار
      appointments: item.appointments.length||0, // این فیلد در دیتای شما نبود، پیش‌فرض 0
      //patients: 0,     // این فیلد در دیتای شما نبود، پیش‌فرض 0
      licenseNumber:clinicInfo.licenseNumber|| '-',
    }
  })
})

const rawVets = computed(() => tenantStore.vets || [])
const vets = computed(() => {
  return rawVets.value.map(item => {

    // پیدا کردن تنظیمات قیمت ویزیت
    const vetInfoSetting = item.tenantSettings.find(s => s.key === 'clinic_info');
    const vetInfo = vetInfoSetting?.value || {};

    // Calculate Orders
    const ordersCount = item.orders ? item.orders.length : 0

    // Calculate Financials
    const walletBalance = item.wallet?.balance || 0
    const transactions = item.wallet?.transactions || []

    // Calculate Total Sales (Sum of orders with status PAID, SHIPPED, DELIVERED)
    const completedOrders = item.orders ? item.orders.filter(o =>
        ['CUSTOMER_PAID', 'TENANT_PROCESSING', 'TENANT_SHIPPED', 'DELIVERED'].includes(o.status)
    ) : []

    const totalSales = completedOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)

    // Format Categories
    const category = item.categories && item.categories.length > 0
        ? item.categories.join('، ')
        : '-'

    return {
      id: item.id,
      // اگر نام خالی بود، از نام مالک استفاده می‌کنیم
      name: item.name || item.ownerName || 'بدون نام',
      // نگاشت ownerName به manager که در قالب استفاده شده
      manager: item.ownerName,
      phone: item.phone,
      city: item.city,
      // بررسی وجود مجوز (در داده‌های شما فیلد documents وجود دارد)
      hasLicense: !!item.documents?.license,
      // امتیاز (تبدیل رشته به عدد)
      rating: parseFloat(item.rating) || 0,
      // فرمت تاریخ عضویت
      joinDate: new Date(item.createdAt).toLocaleDateString('fa-IR'),
      // وضعیت فعال بودن کلی
      isActive: item.status === 'active',
      owner: item.ownerName || '-',
      ownerUserId:item.ownerUserId,
      email: item.email,
      address: item.tenantAddress,
      category: category,
      registerDate: item.createdAt ? new Date(item.createdAt).toLocaleDateString('fa-IR') : '-',
      ordersCount: ordersCount,
      reviewsCount: item.reviewsCount,
      isSuspended:item.isSuspended, //tenant.status !== 'active',
      logo: item.documents?.logo?.thumbnail || null,
      // Financial Data for Details Modal
      walletBalance: walletBalance,
      totalSales: totalSales,
      completedOrdersCount: completedOrders.length,
      transactions: transactions,
      // Nested Data for Details Modal
      reviews: item.tenantReviews || [],
      originalData: item,
      vetsCount: item.vetsCount || 0, // اگر فیلد نداشت 0 بگذار
      appointments: item.appointments.length||0, // این فیلد در دیتای شما نبود، پیش‌فرض 0
      //patients: 0,     // این فیلد در دیتای شما نبود، پیش‌فرض 0
      specialty: vetInfo.specialty || 'عمومی', // اگر تخصص null بود عمومی بگذار
      clinic: item.name, // چون دامپزشک خودش تننت است، نام خودش را به عنوان کلینیک نشان می‌دهیم
      licenseNumber:vetInfo.licenseNumber|| '-', // در دیتای شما فیلد لایسنس جداگانه نبود
    }
  })
})

const activeClinics = computed(() => clinics.value.filter(c => !c.isSuspended))
const activeVets = computed(() => vets.value.filter(v => !v.isSuspended))

const filteredClinics = computed(() => {
  return clinics.value.filter(c => {
    if (filters.value.search && !c.name.includes(filters.value.search)) return false
    if (filters.value.city && c.city !== filters.value.city) return false
    return true
  })
})

const filteredVets = computed(() => {
  return vets.value.filter(v => {
    if (filters.value.search && !v.name.includes(filters.value.search)) return false
    if (filters.value.specialty && v.specialty !== filters.value.specialty) return false
    return true
  })
})

const getClinicDropdownItems = (clinic) => {
  const items = [
    { label: 'مشاهده جزئیات', icon: 'ti ti-eye', action: 'view' },
    { label: 'ورود به داشبورد', icon: 'ti ti-external-link', action: 'dashboard' },
    { divider: true },
  ]

  if (clinic.isSuspended) {
    items.push({ 
      label: 'رفع تعلیق', 
      icon: 'ti ti-lock-open',
      action: 'unsuspend',
      success: true
    })
  } else {
    items.push({ 
      label: 'تعلیق کلینیک', 
      icon: 'ti ti-ban',
      action: 'suspend',
      danger: true
    })
  }

  return items
}

const getVetDropdownItems = (vet) => {
  const items = [
    { label: 'مشاهده جزئیات', icon: 'ti ti-eye', action: 'view' },
    { label: 'ورود به داشبورد', icon: 'ti ti-external-link', action: 'dashboard' },
    { divider: true },
  ]

  if (vet.isSuspended) {
    items.push({ 
      label: 'رفع تعلیق', 
      icon: 'ti ti-lock-open',
      action: 'unsuspend',
      success: true
    })
  } else {
    items.push({ 
      label: 'تعلیق دامپزشک', 
      icon: 'ti ti-ban',
      action: 'suspend',
      danger: true
    })
  }

  return items
}

const handleClinicAction = async (action, clinic) => {

  selectedItem.value = clinic
  suspendType.value = 'clinic'

  switch (action) {
    case 'view':
      detailsTab.value = 'info'
      detailsType.value = 'clinic'
      showDetailsModal.value = true
      break
    case 'dashboard':
      goToClinicDashboard(clinic)
      break
    case 'suspend':
      suspendReason.value = ''
      showSuspendModal.value = true
      break
    case 'unsuspend':
      clinic.isSuspended = false
      const newStatus = !selectedItem.value.isSuspended;
      await tenantReqStore.toggleSuspend(selectedItem.value.id, newStatus);
      showToast(`تعلیق ${clinic.name} برداشته شد`, 'success')
      break
  }
}

const handleVetAction = (action, vet) => {
  selectedItem.value = vet
  suspendType.value = 'vet'
  
  switch (action) {
    case 'view':
      detailsTab.value = 'info'
      detailsType.value = 'vet'
      showDetailsModal.value = true
      break
    case 'dashboard':
      goToVetDashboard(vet)
      break
    case 'suspend':
      suspendReason.value = ''
      showSuspendModal.value = true
      break
    case 'unsuspend':
      vet.isSuspended = false
      showToast(`تعلیق ${vet.name} برداشته شد`, 'success')
      break
  }
}

const goToClinicDashboard = (clinic) => {
  const admin_panel_type='VET'
  const url = `/clinic?token=${localStorage.getItem('auth_token')}&tenantId=${clinic.id}&admin_panel_type=${admin_panel_type}`;
  window.open(
      url,
      'ClinicDashboardWindow', // نام پنجره (اگر باز باشد همان را فوکوس می‌کند)
      'width=1200,height=800,top=100,left=100,resizable=yes,scrollbars=yes'
  )
  showToast(`در حال ورود به داشبورد ${clinic.name}...`, 'success')
}

const goToVetDashboard = (vet) => {
  const admin_panel_type='VET'
  const url = `/clinic?token=${localStorage.getItem('auth_token')}&tenantId=${vet.id}&admin_panel_type=${admin_panel_type}`;

  window.open(
      url,
      'VetDashboardWindow', // نام پنجره (اگر باز باشد همان را فوکوس می‌کند)
      'width=1200,height=800,top=100,left=100,resizable=yes,scrollbars=yes'
  )
  showToast(`در حال ورود به داشبورد ${vet.name}...`, 'success')
}

const confirmSuspend = async () => {
  try {
    // ۱. محاسبه وضعیت جدید (برعکس وضعیت فعلی)
    // اگر الان true است، باید false بفرستیم تا تعلیق برداشته شود
    const newStatus = !selectedItem.value.isSuspended;

    // ۲. ارسال درخواست به سرور با وضعیت جدید
    await tenantReqStore.toggleSuspend(selectedItem.value.id, newStatus);

    // ۳. آپدیت کردن وضعیت در لیست محلی (برای اینکه UI سریع تغییر کند)
    selectedItem.value.isSuspended = newStatus;

    // ۴. نمایش پیام مناسب
    if (newStatus) {
      showToast(`${selectedItem.value.name} با موفقیت تعلیق شد`, 'error');
    } else {
      showToast(`تعلیق ${selectedItem.value.name} برداشته شد`, 'success');
    }

    // ۵. بستن مودال
    showSuspendModal.value = false;

  } catch (error) {
    console.error(error);
    showToast('عملیات با خطا مواجه شد', 'error');
  }
}

const openSuspendModal = (item, type) => {
  selectedItem.value = item
  suspendType.value = type
  suspendReason.value = ''
  showSuspendModal.value = true
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}

// Export to Excel
const exportToExcel = () => {
  let data = []
  let filename = ''
  
  if (activeTab.value === 'clinics') {
    filename = 'کلینیک‌ها'
    data = filteredClinics.value.map(clinic => ({
      'نام کلینیک': clinic.name,
      'مدیر': clinic.owner,
      'شماره موبایل': clinic.phone,
      'شهر': clinic.city,
      'آدرس': clinic.address.displayName,
      'امتیاز': clinic.rating,
      'تعداد دامپزشک': clinic.vetsCount,
      'تعداد ویزیت': clinic.appointments,
      'موجودی (تومان)': clinic.balance,
      'وضعیت': clinic.isActive ? 'فعال' : 'غیرفعال'
    }))
  } else {
    filename = 'دامپزشکان'
    data = filteredVets.value.map(vet => ({
      'نام دامپزشک': vet.name,
      'کد نظام': vet.medicalCode,
      'تخصص': vet.specialty,
      'شماره موبایل': vet.phone,
      'کلینیک': vet.clinic,
      'شهر': vet.city,
      'امتیاز': vet.rating,
      'تعداد ویزیت': vet.visits,
      'موجودی (تومان)': vet.balance,
      'وضعیت': vet.isActive ? 'فعال' : 'غیرفعال'
    }))
  }
  
  if (data.length === 0) {
    showToast('داده‌ای برای خروجی وجود ندارد', 'error')
    return
  }
  
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(h => {
        let val = row[h]
        if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
          val = `"${val.replace(/"/g, '""')}"`
        }
        return val
      }).join(',')
    )
  ].join('\n')
  
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}-${new Date().toLocaleDateString('fa-IR')}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
  
  showToast('خروجی اکسل با موفقیت دانلود شد')
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
