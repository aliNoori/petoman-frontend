<template>
  <div class="space-y-6 pb-24 md:pb-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">مدیریت سوالات متداول</h1>
        <p class="text-gray-500 mt-1">سوالات متداول هر بخش را مدیریت کنید</p>
      </div>
      <button @click="openAddModal" class="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 flex items-center gap-2">
        <i class="ti ti-plus"></i>
        افزودن سوال
      </button>
    </div>

    <!-- Main Section Tabs -->
    <div class="bg-white rounded-xl border border-gray-200 p-1.5">
      <div class="flex flex-wrap gap-1">
        <button 
          v-for="section in mainSections" 
          :key="section.key"
          @click="activeSection = section.key; activeCategory = null"
          class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="activeSection === section.key ? '' : 'text-gray-600 hover:bg-gray-100'"
          :style="activeSection === section.key ? { backgroundColor: section.color, color: 'white' } : {}"
        >
          <i :class="section.icon"></i>
          <span>{{ section.label }}</span>
          <span 
            class="px-1.5 py-0.5 rounded-full text-xs"
            :class="activeSection === section.key ? 'bg-white/30' : 'bg-gray-200'"
          >
            {{ getSectionFaqCount(section.key) }}
          </span>
        </button>
      </div>
    </div>

    <!-- Category Filter + Management -->
    <div class="bg-white rounded-xl border border-gray-200 p-4">
      <div class="flex items-center justify-between mb-3">
        <p class="text-sm font-medium text-gray-700">دسته‌بندی‌های {{ currentSectionLabel }}</p>
        <button @click="openCategoryModal" class="text-sm text-cyan-600 hover:text-cyan-700 flex items-center gap-1">
          <i class="ti ti-settings"></i>
          مدیریت دسته‌ها
        </button>
      </div>
      <div class="flex flex-wrap gap-2">
        <button 
          @click="activeCategory = null"
          class="px-3 py-1.5 rounded-lg text-sm transition-colors"
          :class="activeCategory === null ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >
          همه
          <span class="mr-1 text-xs opacity-70">({{ getSectionFaqCount(activeSection) }})</span>
        </button>
        <button 
          v-for="cat in currentCategories" 
          :key="cat.key"
          @click="activeCategory = cat.key"
          class="px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1"
          :class="activeCategory === cat.key ? '' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          :style="activeCategory === cat.key ? { backgroundColor: cat.color, color: 'white' } : {}"
        >
          <i :class="cat.icon" class="text-xs"></i>
          {{ cat.label }}
          <span class="text-xs opacity-70">({{ getCategoryFaqCount(activeSection, cat.key) }})</span>
        </button>
      </div>
    </div>

    <!-- FAQ List -->
    <div class="space-y-3">
      <div 
        v-for="(faq, index) in filteredFaqs" 
        :key="faq.id" 
        class="bg-white rounded-xl border border-gray-200 overflow-hidden"
      >
        <div 
          class="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50"
          @click="toggleFaq(faq.id)"
        >
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-600 font-bold">
              {{ index + 1 }}
            </div>
            <div>
              <h3 class="font-bold text-gray-900">{{ faq.question }}</h3>
              <div class="flex items-center gap-2 mt-1">
                <span 
                  v-if="faq.category"
                  class="px-2 py-0.5 rounded text-xs"
                  :style="{ backgroundColor: getCategoryColor(faq.section, faq.category) + '20', color: getCategoryColor(faq.section, faq.category) }"
                >
                  {{ getCategoryLabel(faq.section, faq.category.label) }}
                </span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span 
              class="px-2 py-1 rounded-full text-xs font-medium"
              :class="faq.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
            >
              {{ faq.isActive ? 'فعال' : 'غیرفعال' }}
            </span>
            <i 
              class="ti text-gray-400 transition-transform"
              :class="expandedFaq === faq.id ? 'ti-chevron-up rotate-180' : 'ti-chevron-down'"
            ></i>
          </div>
        </div>
        
        <div v-if="expandedFaq === faq.id" class="px-5 pb-5 border-t border-gray-100">
          <div class="pt-4 pr-14">
            <p class="text-gray-700 leading-relaxed mb-4">{{ faq.answer }}</p>
            <div class="flex items-center gap-2">
              <button @click.stop="editFaq(faq)" class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1">
                <i class="ti ti-edit"></i>
                ویرایش
              </button>
              <button @click.stop="toggleFaqStatus(faq)" class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1">
                <i :class="faq.isActive ? 'ti ti-eye-off' : 'ti ti-eye'"></i>
                {{ faq.isActive ? 'غیرفعال' : 'فعال' }}
              </button>
              <button @click.stop="deleteFaq(faq)" class="px-3 py-1.5 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-1">
                <i class="ti ti-trash"></i>
                حذف
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredFaqs.length === 0" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <i class="ti ti-help text-gray-400 text-2xl"></i>
        </div>
        <h3 class="font-bold text-gray-900 mb-2">سوالی ثبت نشده</h3>
        <p class="text-gray-500 mb-4">برای این دسته‌بندی سوال متداولی وجود ندارد</p>
        <button @click="openAddModal" class="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
          افزودن اولین سوال
        </button>
      </div>
    </div>

    <!-- Add/Edit FAQ Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="closeModal">
      <div class="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div class="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 class="font-bold text-gray-900 text-lg">{{ editingFaq ? 'ویرایش سوال' : 'افزودن سوال جدید' }}</h3>
          <button @click="closeModal" class="p-2 hover:bg-gray-100 rounded-lg">
            <i class="ti ti-x text-gray-500"></i>
          </button>
        </div>
        
        <div class="p-5 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">بخش</label>
            <AppSelect
              v-model="formData.section"
              :options="sectionOptions"
              placeholder="انتخاب بخش"
              icon="ti ti-layout"
              @update:modelValue="formData.category = null"
            />
          </div>
          
          <div v-if="formData.section">
            <label class="block text-sm font-medium text-gray-700 mb-2">دسته‌بندی</label>
            <AppSelect
              v-model="formData.category"
              :options="getCategoryOptions(formData.section)"
              placeholder="انتخاب دسته‌بندی"
              icon="ti ti-category"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">سوال</label>
            <input 
              v-model="formData.question" 
              type="text" 
              placeholder="سوال را وارد کنید..."
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">پاسخ</label>
            <textarea 
              v-model="formData.answer" 
              rows="5"
              placeholder="پاسخ سوال را وارد کنید..."
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 resize-none"
            ></textarea>
          </div>
          
          <div class="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="isActive" 
              v-model="formData.isActive"
              class="w-4 h-4 text-cyan-600 rounded"
            />
            <label for="isActive" class="text-sm text-gray-700">فعال باشد</label>
          </div>
        </div>
        
        <div class="p-5 border-t border-gray-100 flex items-center justify-end gap-3">
          <button @click="closeModal" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            انصراف
          </button>
          <button @click="saveFaq" class="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
            {{ editingFaq ? 'ذخیره تغییرات' : 'افزودن سوال' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Category Management Modal -->
    <div v-if="showCategoryModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="closeCategoryModal">
      <div class="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <div class="p-5 border-b border-gray-100 flex items-center justify-between shrink-0">
          <h3 class="font-bold text-gray-900 text-lg">دسته‌بندی‌های {{ currentSectionLabel }}</h3>
          <button @click="closeCategoryModal" class="p-2 hover:bg-gray-100 rounded-lg">
            <i class="ti ti-x text-gray-500"></i>
          </button>
        </div>
        
        <!-- Add New Category -->
        <div class="p-4 border-b border-gray-100 bg-gray-50">
          <p class="text-sm font-medium text-gray-700 mb-3">افزودن دسته جدید</p>
          <div class="flex gap-2">
            <input 
              v-model="newCategory.label" 
              type="text" 
              placeholder="نام دسته..."
              class="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
            <div class="relative">
              <button 
                @click="showIconPicker = !showIconPicker"
                class="w-12 h-[42px] border border-gray-300 rounded-lg hover:bg-white flex items-center justify-center"
              >
                <i :class="newCategory.icon" class="text-xl text-gray-600"></i>
              </button>
              <!-- Icon Picker -->
              <div v-if="showIconPicker" class="absolute left-0 mt-2 w-64 bg-white rounded-xl border border-gray-200 shadow-xl p-3 z-10">
                <p class="text-xs text-gray-500 mb-2">انتخاب آیکون</p>
                <div class="grid grid-cols-6 gap-1 max-h-40 overflow-y-auto">
                  <button 
                    v-for="icon in availableIcons" 
                    :key="icon"
                    @click="newCategory.icon = icon; showIconPicker = false"
                    class="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
                    :class="newCategory.icon === icon ? 'bg-cyan-100 text-cyan-600' : ''"
                  >
                    <i :class="icon"></i>
                  </button>
                </div>
              </div>
            </div>
            <input 
              v-model="newCategory.color"
              type="color"
              class="w-12 h-[42px] border border-gray-300 rounded-lg cursor-pointer"
              title="رنگ دسته"
            />
            <button 
              @click="addCategory"
              :disabled="!newCategory.label.trim()"
              class="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50"
            >
              <i class="ti ti-plus"></i>
            </button>
          </div>
        </div>
        
        <!-- Categories List -->
        <div class="flex-1 overflow-y-auto p-4 space-y-2">
          <div 
            v-for="cat in currentCategories" 
            :key="cat.key"
            class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
          >
            <div 
              class="w-10 h-10 rounded-lg flex items-center justify-center"
              :style="{ backgroundColor: cat.color + '20', color: cat.color }"
            >
              <i :class="cat.icon" class="text-lg"></i>
            </div>
            <div class="flex-1">
              <p class="font-medium text-gray-900">{{ cat.label }}</p>
              <p class="text-xs text-gray-500">{{ getCategoryFaqCount(activeSection, cat.key) }} سوال</p>
            </div>
            <div class="flex items-center gap-1">
              <button 
                v-if="!cat.isDefault"
                @click="startEditCategory(cat)"
                class="p-2 hover:bg-gray-200 rounded-lg"
                title="ویرایش"
              >
                <i class="ti ti-edit text-gray-500"></i>
              </button>
              <button 
                v-if="!cat.isDefault"
                @click="deleteCategory(cat)"
                class="p-2 hover:bg-red-100 rounded-lg"
                title="حذف"
              >
                <i class="ti ti-trash text-red-500"></i>
              </button>
              <span v-if="cat.isDefault" class="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs">پیش‌فرض</span>
            </div>
          </div>
          
          <div v-if="currentCategories.length === 0" class="text-center py-8 text-gray-500">
            <i class="ti ti-category text-4xl mb-2"></i>
            <p>دسته‌بندی وجود ندارد</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Category Modal -->
    <div v-if="showEditCategoryModal" class="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" @click.self="showEditCategoryModal = false">
      <div class="bg-white rounded-2xl w-full max-w-sm">
        <div class="p-5 border-b border-gray-100">
          <h3 class="font-bold text-gray-900">ویرایش دسته‌بندی</h3>
        </div>
        <div class="p-5 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">نام دسته</label>
            <input 
              v-model="editingCategoryData.label" 
              type="text" 
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div class="flex gap-3">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">آیکون</label>
              <div class="relative">
                <button 
                  @click="showEditIconPicker = !showEditIconPicker"
                  class="w-full h-[42px] border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <i :class="editingCategoryData.icon" class="text-xl"></i>
                  <span class="text-sm text-gray-500">تغییر</span>
                </button>
                <div v-if="showEditIconPicker" class="absolute left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-xl p-3 z-10">
                  <div class="grid grid-cols-6 gap-1 max-h-40 overflow-y-auto">
                    <button 
                      v-for="icon in availableIcons" 
                      :key="icon"
                      @click="editingCategoryData.icon = icon; showEditIconPicker = false"
                      class="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
                      :class="editingCategoryData.icon === icon ? 'bg-cyan-100 text-cyan-600' : ''"
                    >
                      <i :class="icon"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">رنگ</label>
              <input 
                v-model="editingCategoryData.color"
                type="color"
                class="w-12 h-[42px] border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
        <div class="p-5 border-t border-gray-100 flex items-center justify-end gap-3">
          <button @click="showEditCategoryModal = false" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            انصراف
          </button>
          <button @click="saveEditCategory" class="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
            ذخیره
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import AppSelect from '@/components/AppSelect.vue'
import { useAdminFaqsStore } from "@/stores/admin/faqs.js";

// استفاده از استور
const faqsStore = useAdminFaqsStore();
const {
  fetchFaqs,
  fetchCategories,
  createFaq,
  updateFaq,
  deleteFaq: deleteFaqApi,
  createCategory,
  updateCategory,
  deleteCategory: deleteCategoryApi,
  categories: storeCategories,
  loading
} = faqsStore;

const activeSection = ref('market')
const activeCategory = ref(null)
const expandedFaq = ref(null)
const showAddModal = ref(false)
const showCategoryModal = ref(false)
const showEditCategoryModal = ref(false)
const showIconPicker = ref(false)
const showEditIconPicker = ref(false)
const editingFaq = ref(null)

const formData = ref({
  section: 'market',
  category: null,
  question: '',
  answer: '',
  isActive: true
})

const newCategory = ref({
  label: '',
  icon: 'ti ti-tag',
  color: '#06b6d4'
})

const editingCategoryData = ref({
  id: null,
  key: '',
  label: '',
  icon: '',
  color: ''
})

const availableIcons = [
  'ti ti-tag', 'ti ti-box', 'ti ti-package', 'ti ti-shopping-cart', 'ti ti-gift',
  'ti ti-paw', 'ti ti-bone', 'ti ti-fish', 'ti ti-feather', 'ti ti-heart',
  'ti ti-pill', 'ti ti-vaccine', 'ti ti-first-aid', 'ti ti-medical-cross', 'ti ti-stethoscope',
  'ti ti-clock', 'ti ti-calendar', 'ti ti-wallet', 'ti ti-credit-card', 'ti ti-receipt',
  'ti ti-truck-delivery', 'ti ti-map-pin', 'ti ti-home', 'ti ti-building', 'ti ti-phone',
  'ti ti-user', 'ti ti-users', 'ti ti-star', 'ti ti-award', 'ti ti-certificate',
  'ti ti-shield', 'ti ti-lock', 'ti ti-discount', 'ti ti-percentage', 'ti ti-chart-bar'
]

const mainSections = [
  { key: 'market', label: 'فروشگاه‌ها', icon: 'ti ti-building-store', color: '#f97316' },
  { key: 'pharmacy', label: 'داروخانه‌ها', icon: 'ti ti-pill', color: '#14b8a6' },
  { key: 'clinic', label: 'کلینیک‌ها', icon: 'ti ti-building-hospital', color: '#f43f5e' },
  { key: 'vet', label: 'دامپزشکان', icon: 'ti ti-stethoscope', color: '#10b981' },
]

// تعریف اولیه با ساختار خالی برای جلوگیری از خطای undefined
const sectionCategories = ref({
  market: [],
  pharmacy: [],
  clinic: [],
  vet: []
})

// Computed
const currentSectionLabel = computed(() => {
  return mainSections.find(s => s.key === activeSection.value)?.label || ''
})

const currentCategories = computed(() => {
  // اولویت با لیست محلی است (برای تغییرات سریع UI)، در غیر این صورت از استور می‌خواند
  return sectionCategories.value[activeSection.value] || faqsStore.categories?.[activeSection.value] || [];
});

const sectionOptions = computed(() => {
  return mainSections.map(s => ({
    value: s.key,
    label: s.label,
    icon: s.icon
  }))
})

const filteredFaqs = computed(() => {
  const allFaqs = Array.isArray(faqsStore.faqs) ? faqsStore.faqs : [];

  // فیلتر کردن بر اساس بخش فعال
  let result = allFaqs.filter(f => f.section === activeSection.value);

  // فیلتر بر اساس دسته‌بندی
  if (activeCategory.value) {
    const catObj = sectionCategories.value[activeSection.value]?.find(c => c.key === activeCategory.value);
    if (catObj && catObj.id) {
      result = result.filter(f => f.categoryId === catObj.id);
    } else {
      result = result.filter(f => f.category === activeCategory.value);
    }
  }

  return result;
});

// Methods Helper
const getSectionFaqCount = (section) => {
  const allFaqs = Array.isArray(faqsStore.faqs) ? faqsStore.faqs : [];
  return allFaqs.filter(f => f.section === section).length;
};

const getCategoryFaqCount = (section, categoryKey) => {
  const allFaqs = Array.isArray(faqsStore.faqs) ? faqsStore.faqs : [];
  const catObj = sectionCategories.value[section]?.find(c => c.key === categoryKey);
  const targetId = catObj ? catObj.id : null;

  return allFaqs.filter(f => {
    const isSection = f.section === section;
    const isCategory = targetId ? f.categoryId === targetId : f.category === categoryKey;
    return isSection && isCategory;
  }).length
}

const getCategoryLabel = (section, categoryKey) => {
  const categories = sectionCategories.value[section] || []
  return categories.find(c => c.key === categoryKey)?.label || categoryKey
}

const getCategoryColor = (section, categoryKey) => {
  const categories = sectionCategories.value[section] || []
  return categories.find(c => c.key === categoryKey)?.color || '#6b7280'
}

const getCategoryOptions = (section) => {
  const categories = sectionCategories.value[section] || []
  return categories.map(c => ({
    value: c.key,
    label: c.label,
    icon: c.icon
  }))
}

const toggleFaq = (id) => {
  expandedFaq.value = expandedFaq.value === id ? null : id
}

const toggleFaqStatus = (faq) => {
  faq.isActive = !faq.isActive
}

const openAddModal = () => {
  formData.value = {
    section: activeSection.value,
    category: activeCategory.value || (currentCategories.value[0]?.key || null),
    question: '',
    answer: '',
    isActive: true
  }
  showAddModal.value = true
}

const editFaq = (faq) => {
  editingFaq.value = faq
  const catObj = sectionCategories.value[faq.section]?.find(c => c.id === faq.categoryId);

  formData.value = {
    ...faq,
    category: catObj ? catObj.key : null
  }
  showAddModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  editingFaq.value = null
}

// Category Management
const openCategoryModal = () => {
  newCategory.value = {
    label: '',
    icon: 'ti ti-tag',
    color: '#06b6d4'
  }
  showIconPicker.value = false
  showCategoryModal.value = true
}

const closeCategoryModal = () => {
  showCategoryModal.value = false
  showIconPicker.value = false
}

const startEditCategory = (cat) => {
  editingCategoryData.value = { ...cat }
  showEditCategoryModal.value = true
  showEditIconPicker.value = false
}
watch(activeSection, async (newSection) => {
  if (newSection) {
    try {
      // ۱. دریافت دسته‌بندی‌ها
      await fetchCategories(newSection);

      // ۲. سینک کردن دسته‌بندی‌ها
      const targetCategories = faqsStore.categories ? faqsStore.categories[newSection] : undefined;
      if (targetCategories && Array.isArray(targetCategories)) {
        sectionCategories.value[newSection] = JSON.parse(JSON.stringify(targetCategories));
      } else {
        sectionCategories.value[newSection] = [];
      }

      await fetchFaqs();

    } catch (error) {
      console.error("Error loading section data:", error);
    }
  }
}, { immediate: true });
const saveFaq = async () => {
  if (!formData.value.question || !formData.value.answer) {
    alert('لطفاً سوال و پاسخ را وارد کنید')
    return
  }

  try {
    const catObj = sectionCategories.value[formData.value.section]?.find(c => c.key === formData.value.category);

    const payload = {
      section: formData.value.section,
      question: formData.value.question,
      answer: formData.value.answer,
      isActive: formData.value.isActive,
      categoryId: catObj ? catObj.id : null // فقط categoryId ارسال می‌شود
    };

    if (editingFaq.value) {
      await updateFaq(editingFaq.value.id, payload);
    } else {
      await createFaq(payload);
    }

    closeModal();
    await fetchFaqs();
  } catch (e) {
    console.error(e);
    alert('خطا در ذخیره سوال');
  }
}

const deleteFaq = async (faq) => {
  if (confirm('آیا از حذف این سوال اطمینان دارید؟')) {
    try {
      await deleteFaqApi(faq.id);
    } catch (e) {
      alert('خطا در حذف');
    }
  }
}

const addCategory = async () => {
  if (!newCategory.value.label.trim()) return

  try {
    const key = 'custom_' + Date.now();
    const payload = {
      section: activeSection.value,
      key: key,
      label: newCategory.value.label.trim(),
      icon: newCategory.value.icon,
      color: newCategory.value.color
    };

    const createdCat = await createCategory(payload);

    if (!sectionCategories.value[activeSection.value]) {
      sectionCategories.value[activeSection.value] = [];
    }
    sectionCategories.value[activeSection.value].push({
      ...createdCat,
      isDefault: false
    });

    newCategory.value = { label: '', icon: 'ti ti-tag', color: '#06b6d4' }
  } catch (e) {
    alert('خطا در ایجاد دسته‌بندی');
  }
}

const saveEditCategory = async () => {
  try {
    const catList = sectionCategories.value[activeSection.value];
    const catObj = catList.find(c => c.key === editingCategoryData.value.key);

    if (catObj && catObj.id) {
      await updateCategory(catObj.id, {
        label: editingCategoryData.value.label,
        icon: editingCategoryData.value.icon,
        color: editingCategoryData.value.color
      });

      const index = catList.findIndex(c => c.key === editingCategoryData.value.key);
      if (index !== -1) {
        catList[index] = { ...catList[index], ...editingCategoryData.value };
      }
    }
    showEditCategoryModal.value = false;
  } catch (e) {
    alert('خطا در ویرایش دسته‌بندی');
  }
}

const deleteCategory = async (cat) => {
  const allFaqs = Array.isArray(storeFaqs) ? storeFaqs : [];
  const faqsInCategory = allFaqs.filter(f => {
    if (cat.id) return f.categoryId === cat.id;
    return f.category === cat.key;
  }).length

  if (faqsInCategory > 0) {
    if (!confirm(`این دسته‌بندی ${faqsInCategory} سوال دارد. آیا مطمئنید؟ سوالات این دسته حذف می‌شوند.`)) {
      return
    }
  }

  try {
    if (cat.id) {
      await deleteCategoryApi(cat.id);
    }

    sectionCategories.value[activeSection.value] = sectionCategories.value[activeSection.value].filter(c => c.key !== cat.key);

    if (activeCategory.value === cat.key) {
      activeCategory.value = null
    }
  } catch (e) {
    alert('خطا در حذف دسته‌بندی');
  }
}
</script>
