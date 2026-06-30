<template>
  <div class="space-y-4 pb-20 lg:pb-6">
    <!-- Header with Add Button -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-gray-900">ویژگی‌های محصولات</h2>
          <p class="text-sm text-gray-500 mt-1">تعریف ویژگی‌ها و مقادیر آن‌ها برای محصولات</p>
        </div>
        <button
          @click="openAddModal"
          class="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 flex items-center gap-2"
        >
          <i class="ti ti-plus text-xl"></i>
          افزودن ویژگی
        </button>
      </div>
    </div>

    <!-- Attributes List -->
    <div class="space-y-4">
      <div
        v-for="attribute in attributes"
        :key="attribute.id"
        class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div class="p-5">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <i class="ti ti-adjustments text-2xl text-blue-600"></i>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 text-lg">{{ attribute.name }}</h3>
                <div class="flex items-center gap-2 mt-1">
                  <span :class="[
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold',
                    attribute.type === 'medicine' ? 'bg-teal-50 text-teal-700' : 'bg-purple-50 text-purple-700'
                  ]">
                    {{ attribute.type === 'medicine' ? 'دارو' : 'فروشگاه' }}
                  </span>
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                    {{ attribute.inputType === 'text' ? 'متن' : attribute.inputType === 'number' ? 'عدد' : 'انتخابی' }}
                  </span>
                </div>
              </div>
            </div>
            <div class="flex gap-2">
              <button
                @click="editAttribute(attribute)"
                class="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                title="ویرایش"
              >
                <i class="ti ti-edit text-lg"></i>
              </button>
              <button
                @click="deleteAttribute(attribute)"
                class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="حذف"
              >
                <i class="ti ti-trash text-lg"></i>
              </button>
            </div>
          </div>

          <!-- Values (for select type) -->
          <div v-if="attribute.inputType === 'select' && attribute.values.length > 0" class="mb-4">
            <p class="text-xs text-gray-500 mb-2">مقادیر قابل انتخاب:</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(value, index) in attribute.values"
                :key="index"
                class="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
              >
                {{ value }}
              </span>
            </div>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <p class="text-xs text-gray-500 mb-1">وضعیت</p>
              <span :class="[
                'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold',
                attribute.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              ]">
                <i :class="attribute.isActive ? 'ti ti-check' : 'ti ti-x'"></i>
                {{ attribute.isActive ? 'فعال' : 'غیرفعال' }}
              </span>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">الزامی</p>
              <span :class="[
                'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold',
                attribute.isRequired ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'
              ]">
                {{ attribute.isRequired ? 'بله' : 'خیر' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="attributes.length === 0" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
      <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="ti ti-adjustments text-4xl text-gray-400"></i>
      </div>
      <h3 class="text-lg font-bold text-gray-900 mb-2">هنوز ویژگی نداری</h3>
      <p class="text-gray-500 text-sm mb-4">اولین ویژگی خودت را تعریف کن</p>
      <button
        @click="openAddModal"
        class="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-all"
      >
        افزودن ویژگی
      </button>
    </div>

    <!-- Add/Edit Modal -->
    <Teleport to="body">
      <transition name="modal">
        <div
          v-if="showModal"
          @click.self="showModal = false"
          class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
        >
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <!-- Modal Header -->
            <div class="bg-teal-600 px-6 py-4 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <i class="ti ti-adjustments text-2xl text-white"></i>
                <h3 class="text-xl font-bold text-white">
                  {{ editMode ? 'ویرایش ویژگی' : 'افزودن ویژگی' }}
                </h3>
              </div>
              <button
                @click="showModal = false"
                class="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <i class="ti ti-x text-xl"></i>
              </button>
            </div>

            <!-- Modal Body -->
            <div class="p-6 overflow-y-auto flex-1">
              <div class="space-y-4">
                <!-- نام ویژگی -->
                <div>
                  <input
                    v-model="formData.name"
                    type="text"
                    placeholder="نام ویژگی (مثال: وزن، رنگ، برند)"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                  />
                </div>

                <!-- نوع محصول -->
                <div class="relative">
                  <button
                    @click="showTypeDropdown = !showTypeDropdown"
                    type="button"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-right flex items-center justify-between hover:border-teal-500 transition-all"
                  >
                    <span :class="formData.type ? 'text-gray-900' : 'text-gray-400'">
                      {{ formData.type ? (formData.type === 'medicine' ? 'دارو' : 'محصول فروشگاه') : 'نوع محصول' }}
                    </span>
                    <i class="ti ti-chevron-down text-gray-400"></i>
                  </button>
                  <transition name="dropdown">
                    <div v-if="showTypeDropdown" class="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl overflow-hidden z-50">
                      <ul class="py-2">
                        <li
                          @click="selectType('medicine')"
                          class="px-4 py-3 hover:bg-teal-50 cursor-pointer transition-colors flex items-center gap-2"
                          :class="{ 'bg-teal-50 text-teal-600 font-bold': formData.type === 'medicine' }"
                        >
                          <i class="ti ti-pill text-lg"></i>
                          <span>دارو</span>
                        </li>
                        <li
                          @click="selectType('shop')"
                          class="px-4 py-3 hover:bg-teal-50 cursor-pointer transition-colors flex items-center gap-2"
                          :class="{ 'bg-teal-50 text-teal-600 font-bold': formData.type === 'shop' }"
                        >
                          <i class="ti ti-shopping-bag text-lg"></i>
                          <span>محصول فروشگاه</span>
                        </li>
                      </ul>
                    </div>
                  </transition>
                </div>

                <!-- نوع ورودی -->
                <div class="relative">
                  <button
                    @click="showInputTypeDropdown = !showInputTypeDropdown"
                    type="button"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-right flex items-center justify-between hover:border-teal-500 transition-all"
                  >
                    <span :class="formData.inputType ? 'text-gray-900' : 'text-gray-400'">
                      {{ formData.inputType === 'text' ? 'متن' : formData.inputType === 'number' ? 'عدد' : formData.inputType === 'select' ? 'انتخابی (دراپ‌داون)' : 'نوع ورودی' }}
                    </span>
                    <i class="ti ti-chevron-down text-gray-400"></i>
                  </button>
                  <transition name="dropdown">
                    <div v-if="showInputTypeDropdown" class="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl overflow-hidden z-50">
                      <ul class="py-2">
                        <li
                          @click="selectInputType('text')"
                          class="px-4 py-3 hover:bg-teal-50 cursor-pointer transition-colors"
                          :class="{ 'bg-teal-50 text-teal-600 font-bold': formData.inputType === 'text' }"
                        >
                          متن
                        </li>
                        <li
                          @click="selectInputType('number')"
                          class="px-4 py-3 hover:bg-teal-50 cursor-pointer transition-colors"
                          :class="{ 'bg-teal-50 text-teal-600 font-bold': formData.inputType === 'number' }"
                        >
                          عدد
                        </li>
                        <li
                          @click="selectInputType('select')"
                          class="px-4 py-3 hover:bg-teal-50 cursor-pointer transition-colors"
                          :class="{ 'bg-teal-50 text-teal-600 font-bold': formData.inputType === 'select' }"
                        >
                          انتخابی (دراپ‌داون)
                        </li>
                      </ul>
                    </div>
                  </transition>
                </div>

                <!-- مقادیر (فقط برای select) -->
                <div v-if="formData.inputType === 'select'" class="space-y-3">
                  <div class="flex gap-2">
                    <input
                      v-model="newValue"
                      @keyup.enter="addValue"
                      type="text"
                      placeholder="مقدار جدید (Enter برای افزودن)"
                      class="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                    />
                    <button
                      @click="addValue"
                      type="button"
                      class="px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-all"
                    >
                      <i class="ti ti-plus"></i>
                    </button>
                  </div>
                  <div v-if="formData.values.length > 0" class="flex flex-wrap gap-2">
                    <div
                      v-for="(value, index) in formData.values"
                      :key="index"
                      class="inline-flex items-center gap-2 px-3 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium"
                    >
                      <span>{{ value }}</span>
                      <button
                        @click="removeValue(index)"
                        type="button"
                        class="hover:bg-teal-100 rounded p-0.5 transition-colors"
                      >
                        <i class="ti ti-x text-sm"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- الزامی بودن -->
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p class="font-bold text-gray-900">ویژگی الزامی</p>
                    <p class="text-sm text-gray-500">این ویژگی باید حتما پر شود</p>
                  </div>
                  <button
                    @click="formData.isRequired = !formData.isRequired"
                    type="button"
                    :class="[
                      'relative inline-flex h-8 w-14 items-center rounded-full transition-colors',
                      formData.isRequired ? 'bg-red-600' : 'bg-gray-300'
                    ]"
                  >
                    <span
                      :class="[
                        'inline-block h-6 w-6 transform rounded-full bg-white transition-transform',
                        formData.isRequired ? 'translate-x-1' : 'translate-x-7'
                      ]"
                    ></span>
                  </button>
                </div>

                <!-- وضعیت -->
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p class="font-bold text-gray-900">وضعیت ویژگی</p>
                    <p class="text-sm text-gray-500">فعال یا غیرفعال کردن این ویژگی</p>
                  </div>
                  <button
                    @click="formData.isActive = !formData.isActive"
                    type="button"
                    :class="[
                      'relative inline-flex h-8 w-14 items-center rounded-full transition-colors',
                      formData.isActive ? 'bg-teal-600' : 'bg-gray-300'
                    ]"
                  >
                    <span
                      :class="[
                        'inline-block h-6 w-6 transform rounded-full bg-white transition-transform',
                        formData.isActive ? 'translate-x-1' : 'translate-x-7'
                      ]"
                    ></span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
              <button
                @click="saveAttribute"
                :disabled="!isFormValid"
                :class="[
                  'flex-1 px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2',
                  isFormValid
                    ? 'bg-teal-600 hover:bg-teal-700 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                ]"
              >
                <i class="ti ti-check"></i>
                {{ editMode ? 'ذخیره تغییرات' : 'افزودن ویژگی' }}
              </button>
              <button
                @click="showModal = false"
                class="px-6 py-3 bg-white hover:bg-gray-100 text-gray-700 rounded-xl font-bold transition-all border-2 border-gray-200"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'


// State
const showModal = ref(false)
const editMode = ref(false)
const showTypeDropdown = ref(false)
const showInputTypeDropdown = ref(false)
const newValue = ref('')

const formData = ref({
  name: '',
  type: '',
  inputType: '',
  values: [],
  isRequired: false,
  isActive: true
})

// Sample Data
const attributes = ref([
  {
    id: 1,
    name: 'وزن',
    type: 'shop',
    inputType: 'number',
    values: [],
    isRequired: true,
    isActive: true
  },
  {
    id: 2,
    name: 'رنگ',
    type: 'shop',
    inputType: 'select',
    values: ['قرمز', 'آبی', 'سبز', 'زرد', 'سیاه', 'سفید'],
    isRequired: false,
    isActive: true
  },
  {
    id: 3,
    name: 'دوز مصرف',
    type: 'medicine',
    inputType: 'text',
    values: [],
    isRequired: true,
    isActive: true
  },
  {
    id: 4,
    name: 'شکل دارویی',
    type: 'medicine',
    inputType: 'select',
    values: ['قرص', 'کپسول', 'شربت', 'آمپول', 'پماد'],
    isRequired: true,
    isActive: true
  },
  {
    id: 5,
    name: 'برند',
    type: 'shop',
    inputType: 'select',
    values: ['Royal Canin', 'Pedigree', 'Whiskas', 'Pro Plan'],
    isRequired: false,
    isActive: true
  },
])

// Computed
const isFormValid = computed(() => {
  const hasName = formData.value.name.trim() !== ''
  const hasType = formData.value.type !== ''
  const hasInputType = formData.value.inputType !== ''
  const hasValuesIfSelect = formData.value.inputType !== 'select' || formData.value.values.length > 0
  return hasName && hasType && hasInputType && hasValuesIfSelect
})

// Methods
const openAddModal = () => {
  editMode.value = false
  formData.value = {
    name: '',
    type: '',
    inputType: '',
    values: [],
    isRequired: false,
    isActive: true
  }
  newValue.value = ''
  showModal.value = true
}

const editAttribute = (attribute) => {
  editMode.value = true
  formData.value = { ...attribute, values: [...attribute.values] }
  newValue.value = ''
  showModal.value = true
}

const selectType = (type) => {
  formData.value.type = type
  showTypeDropdown.value = false
}

const selectInputType = (type) => {
  formData.value.inputType = type
  if (type !== 'select') {
    formData.value.values = []
  }
  showInputTypeDropdown.value = false
}

const addValue = () => {
  const value = newValue.value.trim()
  if (value && !formData.value.values.includes(value)) {
    formData.value.values.push(value)
    newValue.value = ''
  }
}

const removeValue = (index) => {
  formData.value.values.splice(index, 1)
}

const saveAttribute = () => {
  if (!isFormValid.value) return

  if (editMode.value) {
    // Update existing
    const index = attributes.value.findIndex(a => a.id === formData.value.id)
    if (index !== -1) {
      attributes.value[index] = { ...formData.value }
    }
  } else {
    // Add new
    const newAttribute = {
      ...formData.value,
      id: Date.now()
    }
    attributes.value.push(newAttribute)
  }

  showModal.value = false
}

const deleteAttribute = (attribute) => {
  if (confirm(`آیا از حذف ویژگی "${attribute.name}" اطمینان دارید؟`)) {
    const index = attributes.value.findIndex(a => a.id === attribute.id)
    if (index !== -1) {
      attributes.value.splice(index, 1)
    }
  }
}
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
</style>
