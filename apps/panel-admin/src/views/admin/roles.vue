<template>
  <div class="space-y-6 pb-24 md:pb-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">مدیریت نقش‌ها</h1>
        <p class="text-gray-500 mt-1">تعریف و مدیریت نقش‌ها و دسترسی‌های سیستم</p>
      </div>
      <button 
        @click="openAddRoleModal"
        class="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
      >
        <i class="ti ti-plus"></i>
        افزودن نقش جدید
      </button>
    </div>

    <!-- لیست نقش‌ها -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="role in roles" 
        :key="role.id"
        class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
      >
        <!-- Header -->
        <div 
          class="p-4 flex items-center justify-between"
          :style="{ backgroundColor: role.color + '15' }"
        >
          <div class="flex items-center gap-3">
            <div 
              class="w-12 h-12 rounded-xl flex items-center justify-center"
              :style="{ backgroundColor: role.color + '30' }"
            >
              <i :class="[role.icon, 'text-2xl']" :style="{ color: role.color }"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-900">{{ role.name }}</h3>
              <p class="text-xs text-gray-500">{{ role.usersCount }} کاربر</p>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <button 
              @click="editRole(role)" 
              class="p-2 hover:bg-white/50 rounded-lg"
              title="ویرایش"
            >
              <i class="ti ti-edit text-gray-500"></i>
            </button>
            <button 
              v-if="!role.isSystem"
              @click="deleteRole(role)" 
              class="p-2 hover:bg-white/50 rounded-lg"
              title="حذف"
            >
              <i class="ti ti-trash text-red-500"></i>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="p-4">
          <p class="text-sm text-gray-600 mb-4">{{ role.description }}</p>
          
          <div class="mb-4">
            <p class="text-xs text-gray-500 mb-2 flex items-center justify-between">
              <span>دسترسی‌ها</span>
              <span class="font-medium">{{ role.permissions.length }} مورد</span>
            </p>
            <div class="flex flex-wrap gap-1">
              <span 
                v-for="perm in role.permissions.slice(0, 4)" 
                :key="perm"
                class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
              >
                {{ getPermissionLabel(perm) }}
              </span>
              <span 
                v-if="role.permissions.length > 4"
                class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
              >
                +{{ role.permissions.length - 4 }} مورد دیگر
              </span>
            </div>
          </div>

          <button 
            @click="viewRolePermissions(role)"
            class="w-full py-2 text-sm text-center rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-2"
            :style="{ color: role.color }"
          >
            <i class="ti ti-eye"></i>
            مشاهده همه دسترسی‌ها
          </button>
        </div>
      </div>
    </div>

    <!-- مودال افزودن/ویرایش نقش -->
    <div v-if="showRoleModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="showRoleModal = false">
      <div class="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div class="p-5 border-b border-gray-100 flex items-center justify-between shrink-0">
          <h3 class="font-bold text-gray-900 text-lg">{{ editingRole ? 'ویرایش نقش' : 'افزودن نقش جدید' }}</h3>
          <button @click="showRoleModal = false" class="p-2 hover:bg-gray-100 rounded-lg">
            <i class="ti ti-x text-gray-500"></i>
          </button>
        </div>
        
        <div class="p-5 overflow-y-auto flex-1 space-y-5">
          <!-- اطلاعات پایه -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block mb-2 font-medium text-gray-900">نام نقش <span class="text-red-500">*</span></label>
              <input 
                v-model="roleForm.name"
                type="text"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="مثال: مدیر محتوا"
              />
            </div>
            <div>
              <label class="block mb-2 font-medium text-gray-900">آیکون</label>
              <div class="flex flex-wrap gap-2">
                <button 
                  v-for="icon in iconOptions" 
                  :key="icon"
                  @click="roleForm.icon = icon"
                  class="p-2 border rounded-lg transition-colors"
                  :class="roleForm.icon === icon ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'"
                >
                  <i :class="icon" class="text-lg text-gray-600"></i>
                </button>
              </div>
            </div>
          </div>

          <div>
            <label class="block mb-2 font-medium text-gray-900">توضیحات</label>
            <textarea 
              v-model="roleForm.description"
              rows="2"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="توضیح کوتاه درباره این نقش..."
            ></textarea>
          </div>

          <div>
            <label class="block mb-2 font-medium text-gray-900">رنگ</label>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="color in colorOptions" 
                :key="color"
                @click="roleForm.color = color"
                class="w-8 h-8 rounded-full border-2 transition-all"
                :style="{ backgroundColor: color }"
                :class="roleForm.color === color ? 'border-gray-900 scale-110' : 'border-transparent'"
              ></button>
            </div>
          </div>

          <!-- دسترسی‌ها -->
          <div>
            <label class="block mb-3 font-medium text-gray-900">دسترسی‌ها</label>
            
            <div class="space-y-4">
              <div v-for="group in permissionGroups" :key="group.key" class="border border-gray-200 rounded-xl overflow-hidden">
                <button 
                  @click="togglePermissionGroup(group.key)"
                  class="w-full p-3 bg-gray-50 flex items-center justify-between hover:bg-gray-100"
                >
                  <div class="flex items-center gap-2">
                    <i :class="group.icon" class="text-gray-500"></i>
                    <span class="font-medium text-gray-900">{{ group.label }}</span>
                    <span class="text-xs text-gray-500">({{ getGroupSelectedCount(group.key) }}/{{ group.permissions.length }})</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <label class="flex items-center gap-2 text-sm text-gray-600" @click.stop>
                      <input 
                        type="checkbox" 
                        :checked="isGroupSelected(group.key)"
                        @change="toggleAllGroupPermissions(group.key)"
                        class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      همه
                    </label>
                    <i class="ti text-gray-400" :class="expandedGroups.includes(group.key) ? 'ti-chevron-up' : 'ti-chevron-down'"></i>
                  </div>
                </button>
                
                <div v-show="expandedGroups.includes(group.key)" class="p-3 grid grid-cols-2 gap-2 border-t border-gray-100">
                  <label 
                    v-for="perm in group.permissions" 
                    :key="perm.key"
                    class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input 
                      type="checkbox" 
                      :value="perm.key" 
                      v-model="roleForm.permissions"
                      class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span class="text-sm text-gray-700">{{ perm.label }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 bg-gray-50 flex items-center justify-end gap-3 shrink-0">
          <button @click="showRoleModal = false" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
            انصراف
          </button>
          <button 
            @click="saveRole"
            :disabled="!roleForm.name"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 disabled:opacity-50"
          >
            <i class="ti ti-check"></i>
            {{ editingRole ? 'ذخیره تغییرات' : 'افزودن نقش' }}
          </button>
        </div>
      </div>
    </div>

    <!-- مودال مشاهده دسترسی‌های نقش -->
    <div v-if="showPermissionsModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="showPermissionsModal = false">
      <div class="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <div 
          class="p-5 flex items-center justify-between shrink-0"
          :style="{ backgroundColor: selectedRole?.color + '15' }"
        >
          <div class="flex items-center gap-3">
            <div 
              class="w-12 h-12 rounded-xl flex items-center justify-center"
              :style="{ backgroundColor: selectedRole?.color + '30' }"
            >
              <i :class="[selectedRole?.icon, 'text-2xl']" :style="{ color: selectedRole?.color }"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-900">{{ selectedRole?.name }}</h3>
              <p class="text-sm text-gray-500">{{ selectedRole?.permissions.length }} دسترسی</p>
            </div>
          </div>
          <button @click="showPermissionsModal = false" class="p-2 hover:bg-white/50 rounded-lg">
            <i class="ti ti-x text-gray-500"></i>
          </button>
        </div>
        
        <div class="p-5 overflow-y-auto flex-1">
          <div class="space-y-3">
            <div 
              v-for="group in permissionGroups" 
              :key="group.key"
              class="border border-gray-100 rounded-xl p-3"
            >
              <h4 class="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <i :class="[group.icon, 'text-gray-500']"></i>
                {{ group.label }}
              </h4>
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="perm in group.permissions.filter(p => selectedRole?.permissions.includes(p.key))" 
                  :key="perm.key"
                  class="px-2 py-1 text-xs rounded-full"
                  :style="{ backgroundColor: selectedRole?.color + '20', color: selectedRole?.color }"
                >
                  {{ perm.label }}
                </span>
                <span 
                  v-if="group.permissions.filter(p => selectedRole?.permissions.includes(p.key)).length === 0"
                  class="text-xs text-gray-400"
                >
                  بدون دسترسی
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 bg-gray-50 flex items-center justify-end gap-3 shrink-0">
          <button @click="showPermissionsModal = false" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
            بستن
          </button>
          <button 
            @click="showPermissionsModal = false; editRole(selectedRole)"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <i class="ti ti-edit"></i>
            ویرایش نقش
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="showToast" class="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-70">
        <div :class="[
          'px-5 py-3 rounded-xl shadow-lg flex items-center gap-3',
          toastType === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        ]">
          <i :class="toastType === 'success' ? 'ti ti-check text-xl' : 'ti ti-x text-xl'"></i>
          <span class="font-medium">{{ toastMessage }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import {ref,onMounted,computed} from 'vue'
import { useRoleStore} from "@/stores/admin/role.js";

const showRoleModal = ref(false)
const showPermissionsModal = ref(false)
const editingRole = ref(null)
const selectedRole = ref(null)
const expandedGroups = ref([])
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

const roleStore = useRoleStore();

// دسترسی به نقش‌ها از استور (به جای roles محلی)
const roles = computed(() => roleStore.roles);

// دریافت لیست هنگام لود شدن کامپوننت
onMounted(async () => {
  await roleStore.fetchRoles();
});
// آیکون‌ها
const iconOptions = [
  'ti ti-shield',
  'ti ti-shield-check',
  'ti ti-user-shield',
  'ti ti-crown',
  'ti ti-star',
  'ti ti-settings',
  'ti ti-chart-bar',
  'ti ti-message',
  'ti ti-file-text',
  'ti ti-wallet',
  'ti ti-package',
  'ti ti-headset',
]

// رنگ‌ها
const colorOptions = [
  '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
  '#ec4899', '#6366f1', '#14b8a6', '#f97316', '#84cc16'
]

// فرم نقش
const roleForm = ref({
  name: '',
  description: '',
  icon: 'ti ti-shield',
  color: '#8b5cf6',
  permissions: []
})

// گروه‌های دسترسی
const permissionGroups = [
  {
    key: 'dashboard',
    label: 'داشبورد',
    icon: 'ti ti-layout-dashboard',
    permissions: [
      { key: 'dashboard.view', label: 'مشاهده داشبورد' },
      { key: 'dashboard.stats', label: 'مشاهده آمار' },
    ]
  },
  {
    key: 'users',
    label: 'کاربران',
    icon: 'ti ti-users',
    permissions: [
      { key: 'users.view', label: 'مشاهده کاربران' },
      { key: 'users.create', label: 'افزودن کاربر' },
      { key: 'users.edit', label: 'ویرایش کاربر' },
      { key: 'users.delete', label: 'حذف کاربر' },
      { key: 'users.block', label: 'مسدود کردن' },
    ]
  },
  {
    key: 'content',
    label: 'محتوا',
    icon: 'ti ti-file-text',
    permissions: [
      { key: 'content.view', label: 'مشاهده محتوا' },
      { key: 'content.create', label: 'افزودن محتوا' },
      { key: 'content.edit', label: 'ویرایش محتوا' },
      { key: 'content.delete', label: 'حذف محتوا' },
      { key: 'content.publish', label: 'انتشار محتوا' },
    ]
  },
  {
    key: 'orders',
    label: 'سفارشات',
    icon: 'ti ti-shopping-cart',
    permissions: [
      { key: 'orders.view', label: 'مشاهده سفارشات' },
      { key: 'orders.edit', label: 'ویرایش سفارشات' },
      { key: 'orders.cancel', label: 'لغو سفارش' },
      { key: 'orders.refund', label: 'استرداد وجه' },
    ]
  },
  {
    key: 'finance',
    label: 'مالی',
    icon: 'ti ti-wallet',
    permissions: [
      { key: 'finance.view', label: 'مشاهده مالی' },
      { key: 'finance.reports', label: 'گزارشات مالی' },
      { key: 'finance.withdraw', label: 'تأیید برداشت' },
      { key: 'finance.transactions', label: 'تراکنش‌ها' },
    ]
  },
  {
    key: 'support',
    label: 'پشتیبانی',
    icon: 'ti ti-headset',
    permissions: [
      { key: 'support.view', label: 'مشاهده تیکت‌ها' },
      { key: 'support.reply', label: 'پاسخ تیکت' },
      { key: 'support.close', label: 'بستن تیکت' },
    ]
  },
  {
    key: 'settings',
    label: 'تنظیمات',
    icon: 'ti ti-settings',
    permissions: [
      { key: 'settings.view', label: 'مشاهده تنظیمات' },
      { key: 'settings.edit', label: 'ویرایش تنظیمات' },
      { key: 'settings.roles', label: 'مدیریت نقش‌ها' },
    ]
  },
]

// نقش‌ها
/*const roles = ref([
  { 
    id: 1, 
    name: 'مدیر کل', 
    description: 'دسترسی کامل به تمام بخش‌های سیستم',
    icon: 'ti ti-crown',
    color: '#8b5cf6',
    isSystem: true,
    usersCount: 1,
    permissions: permissionGroups.flatMap(g => g.permissions.map(p => p.key))
  },
  { 
    id: 2, 
    name: 'مدیر محتوا', 
    description: 'مدیریت محتوا و مطالب سایت',
    icon: 'ti ti-file-text',
    color: '#3b82f6',
    isSystem: false,
    usersCount: 2,
    permissions: ['dashboard.view', 'content.view', 'content.create', 'content.edit', 'content.publish']
  },
  { 
    id: 3, 
    name: 'مدیر مالی', 
    description: 'مدیریت امور مالی و تراکنش‌ها',
    icon: 'ti ti-wallet',
    color: '#10b981',
    isSystem: false,
    usersCount: 1,
    permissions: ['dashboard.view', 'dashboard.stats', 'finance.view', 'finance.reports', 'finance.withdraw', 'finance.transactions']
  },
  { 
    id: 4, 
    name: 'پشتیبانی', 
    description: 'پاسخگویی به تیکت‌ها و درخواست‌های کاربران',
    icon: 'ti ti-headset',
    color: '#f59e0b',
    isSystem: false,
    usersCount: 3,
    permissions: ['dashboard.view', 'support.view', 'support.reply', 'users.view']
  },
  { 
    id: 5, 
    name: 'مدیر سفارشات', 
    description: 'مدیریت سفارشات و پیگیری',
    icon: 'ti ti-shopping-cart',
    color: '#ef4444',
    isSystem: false,
    usersCount: 2,
    permissions: ['dashboard.view', 'orders.view', 'orders.edit', 'orders.cancel', 'users.view']
  },
])*/

// گرفتن لیبل دسترسی
const getPermissionLabel = (key) => {
  for (const group of permissionGroups) {
    const perm = group.permissions.find(p => p.key === key)
    if (perm) return perm.label
  }
  return key
}

// باز/بسته کردن گروه دسترسی
const togglePermissionGroup = (key) => {
  const index = expandedGroups.value.indexOf(key)
  if (index > -1) {
    expandedGroups.value.splice(index, 1)
  } else {
    expandedGroups.value.push(key)
  }
}

// بررسی انتخاب همه دسترسی‌های یک گروه
const isGroupSelected = (groupKey) => {
  const group = permissionGroups.find(g => g.key === groupKey)
  if (!group) return false
  return group.permissions.every(p => roleForm.value.permissions.includes(p.key))
}

// تعداد دسترسی‌های انتخاب شده در یک گروه
const getGroupSelectedCount = (groupKey) => {
  const group = permissionGroups.find(g => g.key === groupKey)
  if (!group) return 0
  return group.permissions.filter(p => roleForm.value.permissions.includes(p.key)).length
}

// انتخاب/لغو همه دسترسی‌های یک گروه
const toggleAllGroupPermissions = (groupKey) => {
  const group = permissionGroups.find(g => g.key === groupKey)
  if (!group) return
  
  const isSelected = isGroupSelected(groupKey)
  const groupPermKeys = group.permissions.map(p => p.key)
  
  if (isSelected) {
    roleForm.value.permissions = roleForm.value.permissions.filter(p => !groupPermKeys.includes(p))
  } else {
    roleForm.value.permissions = [...new Set([...roleForm.value.permissions, ...groupPermKeys])]
  }
}

// نمایش Toast
const showToastMessage = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// باز کردن مودال افزودن نقش
const openAddRoleModal = () => {
  editingRole.value = null
  roleForm.value = {
    name: '',
    description: '',
    icon: 'ti ti-shield',
    color: '#8b5cf6',
    permissions: []
  }
  expandedGroups.value = []
  showRoleModal.value = true
}

// ویرایش نقش
const editRole = (role) => {
  if (role.isSystem) {
    showToastMessage('امکان ویرایش نقش‌های سیستمی وجود ندارد', 'error');
    return;
  }
  editingRole.value = role
  roleForm.value = {
    name: role.name,
    description: role.description,
    icon: role.icon,
    color: role.color,
    permissions: [...role.permissions]
  }
  expandedGroups.value = permissionGroups.map(g => g.key)
  showRoleModal.value = true
}

// ذخیره نقش (ایجاد یا ویرایش)
const saveRole = async () => {
  // تبدیل لیست کلیدهای دسترسی به آبجکت‌های شامل key و label
  const permissionsPayload = roleForm.value.permissions.map(permKey => {
    // پیدا کردن لیبل مربوط به این کلید از لیست permissionGroups
    let label = permKey;
    for (const group of permissionGroups) {
      const found = group.permissions.find(p => p.key === permKey);
      if (found) {
        label = found.label;
        break;
      }
    }
    return { key: permKey, label: label };
  });

  const payload = {
    name: roleForm.value.name,
    description: roleForm.value.description,
    icon: roleForm.value.icon,
    color: roleForm.value.color,
    permissions: permissionsPayload // ارسال آرایه آبجکت‌ها به جای رشته‌ها
  };
  // --- تغییرات اینجا تمام می‌شود ---

  let success = false;

  if (editingRole.value) {
    // ویرایش
    success = await roleStore.updateRole(editingRole.value.id, payload);
    if (success) showToastMessage('نقش با موفقیت ویرایش شد');
  } else {
    // افزودن
    success = await roleStore.createRole(payload);
    if (success) showToastMessage('نقش جدید با موفقیت اضافه شد');
  }

  if (success) {
    showRoleModal.value = false;
  } else {
    showToastMessage(roleStore.error || 'عملیات با خطا مواجه شد', 'error');
  }
}

// حذف نقش
const deleteRole = async (role) => {
  if (confirm(`آیا از حذف نقش "${role.name}" اطمینان دارید؟`)) {
    const success = await roleStore.deleteRole(role.id);
    if (success) {
      showToastMessage('نقش با موفقیت حذف شد');
    } else {
      showToastMessage(roleStore.error || 'خطا در حذف نقش', 'error');
    }
  }
}
// ذخیره نقش
/*const saveRole = () => {
  if (editingRole.value) {
    // ویرایش
    const index = roles.value.findIndex(r => r.id === editingRole.value.id)
    if (index !== -1) {
      roles.value[index] = {
        ...roles.value[index],
        name: roleForm.value.name,
        description: roleForm.value.description,
        icon: roleForm.value.icon,
        color: roleForm.value.color,
        permissions: roleForm.value.permissions
      }
    }
    showToastMessage('نقش با موفقیت ویرایش شد')
  } else {
    // افزودن
    const newRole = {
      id: Date.now(),
      name: roleForm.value.name,
      description: roleForm.value.description,
      icon: roleForm.value.icon,
      color: roleForm.value.color,
      isSystem: false,
      usersCount: 0,
      permissions: roleForm.value.permissions
    }
    roles.value.push(newRole)
    showToastMessage('نقش جدید با موفقیت اضافه شد')
  }
  
  showRoleModal.value = false
}

// حذف نقش
const deleteRole = (role) => {
  if (confirm(`آیا از حذف نقش "${role.name}" اطمینان دارید؟`)) {
    roles.value = roles.value.filter(r => r.id !== role.id)
    showToastMessage('نقش با موفقیت حذف شد')
  }
}*/

// مشاهده دسترسی‌های نقش
const viewRolePermissions = (role) => {
  selectedRole.value = role
  showPermissionsModal.value = true
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
