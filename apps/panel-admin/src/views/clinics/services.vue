<template>
  <div class="space-y-4 lg:space-y-6">
    <!-- Header Section -->
    <div class="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h2 class="text-xl lg:text-2xl font-bold text-gray-900">مدیریت خدمات</h2>
          <p class="text-sm text-gray-600 mt-1">تعریف خدمات و درمان‌های ارائه شده</p>
        </div>
        <button @click="showAddModal = true"
                class="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
          <i class="ti ti-plus w-5 h-5 ml-2"></i>
          افزودن خدمت جدید
        </button>
      </div>
    </div>

    <!-- Info Banner -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
      <i class="ti ti-info-circle w-5 h-5 text-blue-600 mt-0.5 ml-3"></i>
      <div class="flex-1 text-sm text-blue-800">
        <p class="font-medium">توجه:</p>
        <p class="mt-1">هر تغییری که در خدمات ایجاد می‌کنید پس از بررسی توسط مدیریت فعال خواهد شد (۲۴ تا ۴۸ ساعت)</p>
      </div>
    </div>

    <!-- Services List -->
    <div class="bg-white rounded-xl border border-gray-200">
      <!-- Search Bar -->
      <div class="p-4 lg:p-6 border-b border-gray-200">
        <div class="relative">
          <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"></i>
          <input
              v-model="searchQuery"
              type="text"
              placeholder="جستجو در خدمات..."
              class="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
        </div>
      </div>

      <!-- Services Grid -->
      <div v-if="filteredServices.length > 0" class="p-4 lg:p-6">
        <div class="grid grid-cols-1 gap-3">
          <div
              v-for="service in filteredServices"
              :key="service.id"
              class="border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:shadow-sm transition-all"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex-1 min-w-0">
                <h3 class="text-base font-semibold text-gray-900 mb-1">{{ service.name }}</h3>
                <p class="text-sm text-gray-600 mb-2">{{ service.description }}</p>
                <div class="flex items-center gap-4 text-sm">
                  <span class="text-green-600 font-semibold">{{ formatPriceForDisplay(service.price) }} تومان</span>
                  <span :class="[
                    'px-2 py-0.5 rounded text-xs font-medium',
                    service.status === 'active' ? 'bg-green-100 text-green-700' :
                    service.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-600'
                  ]">
                    {{ getStatusText(service.status) }}
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button
                    @click="editService(service)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="ویرایش"
                >
                  <i class="ti ti-edit w-5 h-5"></i>
                </button>
                <button
                    @click="deleteService(service.id)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="حذف"
                >
                  <i class="ti ti-trash w-5 h-5"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="p-8 lg:p-12 text-center">
        <i class="ti ti-package-off w-16 h-16 text-gray-300 mx-auto mb-4"></i>
        <p class="text-gray-500">{{ searchQuery ? 'خدمتی یافت نشد' : 'هنوز خدمتی تعریف نشده است' }}</p>
      </div>
    </div>

    <!-- Add/Edit Modal - Desktop -->
    <div v-if="showAddModal"
         class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 hidden lg:flex items-start justify-center pt-20 p-4">
      <div class="bg-white rounded-xl w-full max-w-lg max-h-[calc(100vh-6rem)] overflow-y-auto shadow-2xl">
        <div class="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <h3 class="text-lg font-bold text-gray-900">
            {{ editingService ? 'ویرایش خدمت' : 'افزودن خدمت جدید' }}
          </h3>
          <button @click="closeModal" class="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
            <i class="ti ti-x w-5 h-5"></i>
          </button>
        </div>

        <form @submit.prevent="saveService" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">نام خدمت *</label>
            <input
                v-model="formData.name"
                type="text"
                required
                placeholder="مثال: معاینه عمومی"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
            <textarea
                v-model="formData.description"
                rows="3"
                placeholder="توضیحات مختصری درباره خدمت..."
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            ></textarea>
          </div>

          <div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">قیمت (تومان) *</label>
              <input
                  v-model="displayPrice"
                  type="text"
                  required
                  placeholder="قیمت"
                  @input="handlePriceInput"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
            </div>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
                type="button"
                @click="closeModal"
                class="px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              انصراف
            </button>
            <button
                type="submit"
                class="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <i class="ti ti-check w-5 h-5 ml-2"></i>
              {{ editingService ? 'ذخیره تغییرات' : 'افزودن خدمت' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add/Edit Modal - Mobile Bottom Sheet (اصلاح شده) -->
    <div v-if="showAddModal" class="fixed inset-0 z-[9999] lg:hidden">
      <!-- 1. لایه تاریک پس‌زمینه (برای بستن مودال با کلیک) -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal"></div>

      <!-- 2. کانتینر اصلی با ارتفاع کامل صفحه -->
      <div class="relative w-full h-full flex items-end sm:items-center justify-center">

        <!-- 3. کادر مودال (Sheet) -->
        <div
            class="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slide-up flex flex-col max-h-[90vh] sm:max-h-[85vh]"
            @click.stop
        >
          <!-- Handle Bar -->
          <div class="flex justify-center pt-3 pb-1 shrink-0">
            <div class="w-12 h-1.5 bg-gray-300 rounded-full"></div>
          </div>

          <!-- Header (ثابت) -->
          <div class="border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
            <h3 class="text-lg font-bold text-gray-900">
              {{ editingService ? 'ویرایش خدمت' : 'افزودن خدمت جدید' }}
            </h3>
            <button @click="closeModal" class="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
              <i class="ti ti-x w-5 h-5"></i>
            </button>
          </div>

          <!-- Form (اسکرول‌خورده) -->
          <form @submit.prevent="saveService" class="p-6 space-y-4 overflow-y-auto flex-1">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">نام خدمت _</label>
              <input
                  v-model="formData.name"
                  type="text"
                  required
                  placeholder="مثال: معاینه عمومی"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
              <textarea
                  v-model="formData.description"
                  rows="3"
                  placeholder="توضیحات مختصری درباره خدمت..."
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-base"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">قیمت (تومان)_ </label>
              <input
                  v-model="displayPrice"
                  type="text"
                  required
                  placeholder="قیمت"
                  @input="handlePriceInput"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
              >
            </div>

            <!-- دکمه‌ها -->
            <div class="flex items-center gap-3 pt-4 pb-2">
              <button
                  type="button"
                  @click="closeModal"
                  class="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                انصراف
              </button>
              <button
                  type="submit"
                  class="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center font-medium"
              >
                <i class="ti ti-check w-5 h-5 ml-2"></i>
                {{ editingService ? 'ذخیره' : 'افزودن' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted, watch} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {useVetClinicServicesStore} from "@/stores/vet-clinic/service.ts";

const router = useRouter()
const route = useRoute()
const vetClinicServiceStore = useVetClinicServicesStore()
const searchQuery = ref('')
const showAddModal = ref(false)
const editingService = ref(null)

const formData = ref({
  name: '',
  description: '',
  price: ''
})
const services = computed(() => vetClinicServiceStore.services)

const filteredServices = computed(() => {
  if (!searchQuery.value) return services.value

  return services.value.filter(service =>
      service.name.includes(searchQuery.value) ||
      service.description.includes(searchQuery.value)
  )
})

// --- Helper Functions ---
const displayPrice = ref('');
// تبدیل عدد خالص به فرمت نمایشی (فارسی و با کاما)
const formatPriceForDisplay = (price) => {
  if (!price) return '';
  const numericValue = String(price).replace(/,/g, '');
  if (numericValue === '') return '';
  return new Intl.NumberFormat('fa-IR').format(Number(numericValue));
};

// تبدیل ارقام فارسی به انگلیسی
const toEnglishDigits = (str) => {
  if (!str) return '';
  return str.toString().replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
};

// هندلر تایپ کاربر: فقط عدد انگلیسی قبول کن و در formData ذخیره کن
const handlePriceInput = (event) => {
  // ۱. گرفتن مقدار ورودی و حذف تمام غیرعددها
  let value = event.target.value.replace(/[^0-9۰-۹]/g, '');

  // ۲. تبدیل ارقام فارسی به انگلیسی برای ذخیره‌سازی
  value = toEnglishDigits(value);

  // ۳. ذخیره مقدار خالص در formData
  formData.value.price = value;

  // ۴. آپدیت کردن فیلد نمایشی (برای اینکه کاربر فرمت شده را ببیند)
  displayPrice.value = formatPriceForDisplay(value);
};

const handlePriceChange = (event) => {
  const value = event.target.value.replace(/,/g, '')
  if (value === '' || /^\d+$/.test(value)) {
    formData.value.price = formatPriceForDisplay(value)
  }
}

const getStatusText = (status) => {
  const statusMap = {
    active: 'فعال',
    pending: 'در انتظار تایید',
    inactive: 'غیرفعال'
  }
  return statusMap[status] || status
}

const editService = (service) => {
  editingService.value = service
  displayPrice.value=formatPriceForDisplay(service.price)
  formData.value = {
    name: service.name,
    description: service.description,
    price: service.price
  }
  showAddModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  editingService.value = null
  formData.value = {
    name: '',
    description: '',
    price: ''
  }
}

const saveService = async () => {
  try {
    // آماده‌سازی پیلود (تمیز کردن قیمت)
    const payload = {
      ...formData.value,
      price: toEnglishDigits(formData.value.price.replace(/,/g, ''))
    };

    if (editingService.value) {
      // --- ویرایش ---
      // استور هم به سرور درخواست می‌فرستد و هم لیست لوکال را آپدیت می‌کند
      await vetClinicServiceStore.updateService(editingService.value.id, payload);
      //alert('✅ تغییرات خدمت با موفقیت ثبت شد و پس از تایید مدیریت اعمال خواهد شد.');
      if (typeof window.showToast === 'function') {
        window.showToast(' تغییرات خدمت با موفقیت ثبت شد و پس از تایید مدیریت اعمال خواهد شد.', 'success', 5000);
      }
    } else {
      // --- ایجاد جدید ---
      // استور سرویس را می‌سازد و به لیست اضافه می‌کند
      await vetClinicServiceStore.createService(payload);
      //alert('✅ خدمت جدید با موفقیت ثبت شد و پس از تایید مدیریت فعال خواهد شد.');
      if (typeof window.showToast === 'function') {
        window.showToast(' خدمت جدید با موفقیت ثبت شد و پس از تایید مدیریت فعال خواهد شد.', 'success', 5000);
      }
    }

    closeModal();
  } catch (error) {
    console.error('Error saving service:', error);
    //alert('خطایی در ذخیره اطلاعات رخ داد.');
    if (typeof window.showToast === 'function') {
      window.showToast(error.response?.data?.message, 'error', 5000);
    }
  }
};

const deleteService = async (id) => {
  if (confirm('آیا از حذف این خدمت اطمینان دارید؟ این عمل نیاز به تایید مدیریت دارد.')) {

    try {
      // ارسال درخواست حذف به استور
      await vetClinicServiceStore.deleteService(id);

      //alert('✅ درخواست حذف خدمت ثبت شد و پس از تایید مدیریت اعمال خواهد شد.');
      if (typeof window.showToast === 'function') {
        window.showToast(' درخواست حذف خدمت ثبت شد و پس از تایید مدیریت اعمال خواهد شد.', 'success', 5000);
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('خطایی در حذف خدمت رخ داد.');
      if (typeof window.showToast === 'function') {
        window.showToast(error.response?.data?.message, 'error', 5000);
      }

    } finally {

    }
  }
};
</script>

<style scoped>
@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
</style>
