<template>
  <div class="space-y-6 pb-24 md:pb-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">مدیریت کاربران</h1>
        <p class="text-gray-500 mt-1">مدیریت کاربران عادی و مدیران سیستم</p>
      </div>
      <button @click="exportToExcel" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
        <i class="ti ti-file-spreadsheet text-green-600"></i>
        خروجی اکسل
      </button>
    </div>

    <!-- Tabs -->
    <div class="bg-white rounded-xl border border-gray-200 p-1.5">
      <div class="flex flex-wrap gap-1">
        <button 
          @click="activeTab = 'regular'"
          class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="activeTab === 'regular' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'"
        >
          <i class="ti ti-users"></i>
          <span>کاربران عادی</span>
          <span 
            class="px-1.5 py-0.5 rounded-full text-xs"
            :class="activeTab === 'regular' ? 'bg-white/30' : 'bg-gray-200'"
          >
            {{ regularUsers?.length }}
          </span>
        </button>
        <button 
          @click="activeTab = 'admins'"
          class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="activeTab === 'admins' ? 'bg-purple-500 text-white' : 'text-gray-600 hover:bg-gray-100'"
        >
          <i class="ti ti-shield-check"></i>
          <span>مدیران</span>
          <span 
            class="px-1.5 py-0.5 rounded-full text-xs"
            :class="activeTab === 'admins' ? 'bg-white/30' : 'bg-gray-200'"
          >
            {{ adminUsers.length }}
          </span>
        </button>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="bg-white rounded-xl border border-gray-200 p-4">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1 relative">
          <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="جستجو بر اساس نام، ایمیل یا شماره موبایل..."
            class="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div class="flex gap-2">
          <AppSelect
            v-model="statusFilter"
            :options="statusFilterOptions"
            placeholder="همه وضعیت‌ها"
            icon="ti ti-filter"
          />
          <button 
            v-if="activeTab === 'admins'"
            @click="openAddAdminModal"
            class="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <i class="ti ti-plus"></i>
            افزودن مدیر
          </button>
        </div>
      </div>
    </div>

    <!-- کاربران عادی -->
    <div v-if="activeTab === 'regular'" class="space-y-4">
      <!-- جدول کاربران -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="text-right px-4 py-3 text-sm font-medium text-gray-600">کاربر</th>
                <th class="text-right px-4 py-3 text-sm font-medium text-gray-600">شماره موبایل</th>
                <th class="text-right px-4 py-3 text-sm font-medium text-gray-600">تاریخ عضویت</th>
                <th class="text-right px-4 py-3 text-sm font-medium text-gray-600">سفارشات</th>
                <th class="text-right px-4 py-3 text-sm font-medium text-gray-600">وضعیت</th>
                <th class="text-right px-4 py-3 text-sm font-medium text-gray-600">عملیات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="user in filteredRegularUsers" :key="user.id" class="hover:bg-gray-50">
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">

                      <img
                          v-show="user?.avatar && user.avatar !== 'null' && user.avatar.trim() !== ''"
                          :src="user.avatar"
                          class="w-full h-full rounded-full object-cover"
                      />

                      <span
                          v-if="!user?.avatar || user.avatar === 'null' || user.avatar.trim() === ''"
                          class="text-blue-600 font-bold"
                      >
                      {{ user.name ? user.name.charAt(0) : '?' }}
                    </span>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">{{ user.name }}</p>
                      <p class="text-xs text-gray-500">{{ user.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 font-mono text-sm text-gray-700">{{ user.phone }}</td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ new Date(user.joinDate).toLocaleDateString('fa-IR') }}</td>
                <td class="px-4 py-3">
                  <span class="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">{{ user.ordersCount }} سفارش</span>
                </td>
                <td class="px-4 py-3">
                  <span 
                    class="px-2 py-1 rounded-full text-xs font-medium"
                    :class="{
                      'bg-green-100 text-green-700': user.status === 'active',
                      'bg-gray-100 text-gray-600': user.status === 'inactive',
                      'bg-red-100 text-red-700': user.status === 'blocked'
                    }"
                  >
                    {{ statusLabels[user.status] }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <button @click="viewUser(user)" class="p-2 hover:bg-gray-100 rounded-lg" title="مشاهده">
                      <i class="ti ti-eye text-gray-500"></i>
                    </button>
                    <button @click="toggleUserStatus(user)" class="p-2 hover:bg-gray-100 rounded-lg" :title="user.status === 'blocked' ? 'رفع مسدودی' : 'مسدود کردن'">
                      <i :class="user.status === 'blocked' ? 'ti ti-lock-open text-green-500' : 'ti ti-lock text-red-500'"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-if="filteredRegularUsers?.length === 0" class="p-12 text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <i class="ti ti-users-minus text-gray-400 text-2xl"></i>
          </div>
          <h3 class="font-bold text-gray-900 mb-2">کاربری یافت نشد</h3>
          <p class="text-gray-500">کاربری با این مشخصات وجود ندارد</p>
        </div>
      </div>
    </div>

    <!-- مدیران -->
    <div v-if="activeTab === 'admins'" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="admin in filteredAdminUsers" 
          :key="admin.id" 
          class="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                <img
                    v-show="admin?.avatar && admin.avatar !== 'null' && admin.avatar.trim() !== ''"
                    :src="admin.avatar"
                    class="w-full h-full rounded-full object-cover"
                />

                <span
                    v-if="!admin?.avatar || admin.avatar === 'null' || admin.avatar.trim() === ''"
                    class="text-blue-600 font-bold"
                >
                      {{ admin.name ? admin.name.charAt(0) : '?' }}
                    </span>
              </div>
              <div>
                <h3 class="font-bold text-gray-900">{{ admin.name }}</h3>
                <p class="text-sm text-gray-500">{{ admin.email }}</p>
              </div>
            </div>
            <div class="flex items-center gap-1">
              <button @click="editAdmin(admin)" class="p-2 hover:bg-gray-100 rounded-lg">
                <i class="ti ti-edit text-gray-500"></i>
              </button>
              <button 
                v-if="admin.id !== 1" 
                @click="deleteAdmin(admin)" 
                class="p-2 hover:bg-red-50 rounded-lg"
              >
                <i class="ti ti-trash text-red-500"></i>
              </button>
            </div>
          </div>

          <div class="space-y-3 mb-4">
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <i class="ti ti-phone"></i>
              <span class="font-mono">{{ admin.phone }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <i class="ti ti-calendar"></i>
              <span>عضویت: {{ new Date(admin.joinDate).toLocaleDateString('fa-IR') }}</span>
            </div>
          </div>

          <div class="pt-4 border-t border-gray-100">
            <p class="text-xs text-gray-500 mb-2">نقش‌ها:</p>
            <div class="flex flex-wrap gap-1">
              <span 
                v-for="role in admin.roles" 
                :key="role.id"
                class="px-2 py-1 text-xs rounded-full"
                :style="{ backgroundColor: role.color + '20', color: role.color }"
              >
                {{ role.name }}
              </span>
            </div>
          </div>

          <div class="mt-4 flex items-center justify-between">
            <span 
              class="px-2 py-1 rounded-full text-xs font-medium"
              :class="{
                'bg-green-100 text-green-700': admin.status === 'active',
                'bg-gray-100 text-gray-600': admin.status === 'inactive'
              }"
            >
              {{ statusLabels[admin.status] }}
            </span>
            <button 
              @click="openAssignRoleModal(admin)"
              class="text-sm text-purple-600 hover:underline flex items-center gap-1"
            >
              <i class="ti ti-shield-plus text-xs"></i>
              مدیریت نقش
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredAdminUsers.length === 0" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
          <i class="ti ti-shield-off text-purple-500 text-2xl"></i>
        </div>
        <h3 class="font-bold text-gray-900 mb-2">مدیری یافت نشد</h3>
        <p class="text-gray-500">مدیری با این مشخصات وجود ندارد</p>
      </div>
    </div>

    <!-- مودال مشاهده کاربر -->
    <div v-if="showUserModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="showUserModal = false">
      <div class="bg-white rounded-2xl w-full max-w-lg overflow-hidden">
        <div class="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 class="font-bold text-gray-900 text-lg">اطلاعات کاربر</h3>
          <button @click="showUserModal = false" class="p-2 hover:bg-gray-100 rounded-lg">
            <i class="ti ti-x text-gray-500"></i>
          </button>
        </div>
        <div class="p-5">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <img
                  v-show="selectedUser?.avatar && selectedUser.avatar !== 'null' && selectedUser.avatar.trim() !== ''"
                  :src="selectedUser.avatar"
                  class="w-full h-full rounded-full object-cover"
              />

              <span
                  v-if="!selectedUser?.avatar || selectedUser.avatar === 'null' || selectedUser.avatar.trim() === ''"
                  class="text-blue-600 font-bold"
              >
                      {{ selectedUser.name ? selectedUser.name.charAt(0) : '?' }}
                    </span>
            </div>
            <div>
              <h4 class="font-bold text-gray-900 text-lg">{{ selectedUser?.name }}</h4>
              <p class="text-gray-500">{{ selectedUser?.email }}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="p-3 bg-gray-50 rounded-xl">
              <p class="text-xs text-gray-500 mb-1">شماره موبایل</p>
              <p class="font-medium text-gray-900 font-mono">{{ selectedUser?.phone }}</p>
            </div>
            <div class="p-3 bg-gray-50 rounded-xl">
              <p class="text-xs text-gray-500 mb-1">تاریخ عضویت</p>
              <p class="font-medium text-gray-900">{{ new Date(selectedUser?.joinDate).toLocaleDateString('fa-IR') }}</p>
            </div>
            <div class="p-3 bg-gray-50 rounded-xl">
              <p class="text-xs text-gray-500 mb-1">تعداد سفارشات</p>
              <p class="font-medium text-gray-900">{{ selectedUser?.ordersCount }} سفارش</p>
            </div>
            <div class="p-3 bg-gray-50 rounded-xl">
              <p class="text-xs text-gray-500 mb-1">وضعیت</p>
              <span 
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="{
                  'bg-green-100 text-green-700': selectedUser?.status === 'active',
                  'bg-gray-100 text-gray-600': selectedUser?.status === 'inactive',
                  'bg-red-100 text-red-700': selectedUser?.status === 'blocked'
                }"
              >
                {{ statusLabels[selectedUser?.status] }}
              </span>
            </div>
          </div>

          <div class="mt-6 p-4 bg-blue-50 rounded-xl">
            <h5 class="font-medium text-blue-900 mb-2">آخرین فعالیت‌ها</h5>
            <ul class="space-y-2 text-sm text-blue-700">
              <li class="flex items-center gap-2">
                <i class="ti ti-point-filled text-xs"></i>
                آخرین ورود: {{ selectedUser?.lastLogin || 'اطلاعاتی موجود نیست' }}
              </li>
              <li class="flex items-center gap-2">
                <i class="ti ti-point-filled text-xs"></i>
                آخرین سفارش: {{ new Date(selectedUser?.lastOrder).toLocaleDateString('fa-IR') || 'اطلاعاتی موجود نیست' }}
              </li>
            </ul>
          </div>
        </div>
        <div class="p-4 bg-gray-50 flex items-center justify-end gap-3">
          <button @click="showUserModal = false" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
            بستن
          </button>
          <button 
            @click="toggleUserStatus(selectedUser); showUserModal = false"
            :class="selectedUser?.status === 'blocked' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'"
            class="px-4 py-2 text-white rounded-lg flex items-center gap-2"
          >
            <i :class="selectedUser?.status === 'blocked' ? 'ti ti-lock-open' : 'ti ti-lock'"></i>
            {{ selectedUser?.status === 'blocked' ? 'رفع مسدودی' : 'مسدود کردن' }}
          </button>
        </div>
      </div>
    </div>

    <!-- مودال افزودن/ویرایش مدیر -->
    <div v-if="showAdminModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="showAdminModal = false">
      <div class="bg-white rounded-2xl w-full max-w-lg overflow-hidden">
        <div class="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 class="font-bold text-gray-900 text-lg">{{ editingAdmin ? 'ویرایش مدیر' : 'افزودن مدیر جدید' }}</h3>
          <button @click="showAdminModal = false" class="p-2 hover:bg-gray-100 rounded-lg">
            <i class="ti ti-x text-gray-500"></i>
          </button>
        </div>
        <div class="p-5 space-y-4">
          <div>
            <label class="block mb-2 font-medium text-gray-900">نام و نام خانوادگی <span class="text-red-500">*</span></label>
            <input 
              v-model="adminForm.name"
              type="text"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="نام کامل"
            />
          </div>
          <div>
            <label class="block mb-2 font-medium text-gray-900">ایمیل <span class="text-red-500">*</span></label>
            <input 
              v-model="adminForm.email"
              type="email"
              dir="ltr"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label class="block mb-2 font-medium text-gray-900">شماره موبایل <span class="text-red-500">*</span></label>
            <input 
              v-model="adminForm.phone"
              type="tel"
              dir="ltr"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="09123456789"
            />
          </div>
          <div v-if="!editingAdmin">
            <label class="block mb-2 font-medium text-gray-900">رمز عبور <span class="text-red-500">*</span></label>
            <input 
              v-model="adminForm.password"
              type="password"
              dir="ltr"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="********"
            />
          </div>
          <div>
            <label class="block mb-2 font-medium text-gray-900">نقش‌ها</label>
            <div class="flex flex-wrap gap-2">
              <label 
                v-for="role in allRoles" 
                :key="role.id"
                class="flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors"
                :class="adminForm.roleIds.includes(role.id) ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'"
              >
                <input 
                  type="checkbox" 
                  :value="role.id" 
                  v-model="adminForm.roleIds"
                  class="hidden"
                />
                <div 
                  class="w-3 h-3 rounded-full"
                  :style="{ backgroundColor: role.color }"
                ></div>
                <span class="text-sm">{{ role.name }}</span>
              </label>
            </div>
          </div>
        </div>
        <div class="p-4 bg-gray-50 flex items-center justify-end gap-3">
          <button @click="showAdminModal = false" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
            انصراف
          </button>
          <button 
            @click="saveAdmin"
            :disabled="!adminForm.name || !adminForm.email || !adminForm.phone"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 disabled:opacity-50"
          >
            <i class="ti ti-check"></i>
            {{ editingAdmin ? 'ذخیره تغییرات' : 'افزودن مدیر' }}
          </button>
        </div>
      </div>
    </div>

    <!-- مودال تخصیص نقش -->
    <div v-if="showAssignRoleModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="showAssignRoleModal = false">
      <div class="bg-white rounded-2xl w-full max-w-md overflow-hidden">
        <div class="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-gray-900 text-lg">مدیریت نقش‌ها</h3>
            <p class="text-sm text-gray-500">{{ selectedAdmin?.name }}</p>
          </div>
          <button @click="showAssignRoleModal = false" class="p-2 hover:bg-gray-100 rounded-lg">
            <i class="ti ti-x text-gray-500"></i>
          </button>
        </div>
        <div class="p-5">
          <p class="text-sm text-gray-600 mb-4">نقش‌های مورد نظر را انتخاب کنید:</p>
          <div class="space-y-2">
            <label 
              v-for="role in allRoles" 
              :key="role.id"
              class="flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-colors"
              :class="assignedRoleIds.includes(role.id) ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'"
            >
              <div class="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  :value="role.id" 
                  v-model="assignedRoleIds"
                  class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <div 
                  class="w-4 h-4 rounded-full"
                  :style="{ backgroundColor: role.color }"
                ></div>
                <span class="font-medium text-gray-900">{{ role.name }}</span>
              </div>
              <span class="text-xs text-gray-500">{{ role.permissions?.length || 0 }} دسترسی</span>
            </label>
          </div>
        </div>
        <div class="p-4 bg-gray-50 flex items-center justify-end gap-3">
          <button @click="showAssignRoleModal = false" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
            انصراف
          </button>
          <button 
            @click="saveAssignedRoles"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <i class="ti ti-check"></i>
            ذخیره
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
import { ref, computed ,onMounted} from 'vue'
import AppSelect from '@/components/AppSelect.vue'
import { useUsersStore} from "@/stores/admin/users.js";

const usersStore = useUsersStore();

// دسترسی به داده‌ها از استور
const regularUsers = computed(() => usersStore.regularUsers);
const adminUsers = computed(() => usersStore.adminUsers);
const allRoles = computed(() => usersStore.allRoles);

// دریافت لیست‌ها هنگام لود شدن کامپوننت
onMounted(async () => {
  await usersStore.fetchRegularUsers();
  await usersStore.fetchAdminUsers();
  await usersStore.fetchRoles();
});
// تغییر وضعیت کاربر
const toggleUserStatus = async (user) => {
  const success = await usersStore.toggleUserStatus(user.id);
  if (success) {
    const msg = user.status === 'blocked' ?'کاربر مسدود شد':'کاربر با موفقیت فعال شد';
    showToastMessage(msg, user.status === 'blocked' ? 'error' : 'success');
    // وضعیت در استور آپدیت شده است، اما برای نمایش سریع در UI می‌توانیم اینجا هم تغییر دهیم
    // یا کل لیست را دوباره بگیریم: usersStore.fetchRegularUsers();
  } else {
    showToastMessage(usersStore.error || 'عملیات با خطا مواجه شد', 'error');
  }
}

// ذخیره مدیر
const saveAdmin = async () => {
  const payload = {
    name: adminForm.value.name,
    email: adminForm.value.email,
    phone: adminForm.value.phone,
    password: adminForm.value.password,
    roleIds: adminForm.value.roleIds
  };

  let success = false;

  if (editingAdmin.value) {
    // ویرایش (رمز عبور فقط اگر پر شده باشد ارسال شود)
    if (!payload.password) delete payload.password;
    success = await usersStore.updateAdmin(editingAdmin.value.id, payload);
    if (success) showToastMessage('مدیر با موفقیت ویرایش شد');
  } else {
    // افزودن
    success = await usersStore.createAdmin(payload);
    if (success) showToastMessage('مدیر جدید با موفقیت اضافه شد');
  }

  if (success) {
    showAdminModal.value = false;
  } else {
    showToastMessage(usersStore.error || 'عملیات با خطا مواجه شد', 'error');
  }
}

// حذف مدیر
const deleteAdmin = async (admin) => {
  if (confirm(`آیا از حذف ${admin.name} اطمینان دارید؟`)) {
    const success = await usersStore.deleteAdmin(admin.id);
    if (success) {
      showToastMessage('مدیر با موفقیت حذف شد');
    } else {
      showToastMessage(usersStore.error || 'خطا در حذف مدیر', 'error');
    }
  }
}

// ذخیره نقش‌های تخصیص داده شده
const saveAssignedRoles = async () => {
  const success = await usersStore.assignRolesToAdmin(selectedAdmin.value.id, assignedRoleIds.value);
  if (success) {
    showAssignRoleModal.value = false;
    showToastMessage('نقش‌ها با موفقیت به‌روزرسانی شد');
  } else {
    showToastMessage(usersStore.error || 'خطا در بروزرسانی نقش‌ها', 'error');
  }
}


const activeTab = ref('regular')
const searchQuery = ref('')
const statusFilter = ref('')

const statusFilterOptions = [
  { value: '', label: 'همه وضعیت‌ها' },
  { value: 'active', label: 'فعال' },
  { value: 'inactive', label: 'غیرفعال' },
  { value: 'blocked', label: 'مسدود' }
]
const showUserModal = ref(false)
const showAdminModal = ref(false)
const showAssignRoleModal = ref(false)
const selectedUser = ref(null)
const selectedAdmin = ref(null)
const editingAdmin = ref(null)
const assignedRoleIds = ref([])
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

const statusLabels = {
  active: 'فعال',
  inactive: 'غیرفعال',
  blocked: 'مسدود'
}

// فرم مدیر
const adminForm = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  roleIds: []
})

/*// نقش‌ها
const allRoles = ref([
  { id: 1, name: 'مدیر کل', color: '#8b5cf6', permissions: ['all'] },
  { id: 2, name: 'مدیر محتوا', color: '#3b82f6', permissions: ['content.view', 'content.edit'] },
  { id: 3, name: 'مدیر مالی', color: '#10b981', permissions: ['finance.view', 'finance.edit'] },
  { id: 4, name: 'پشتیبانی', color: '#f59e0b', permissions: ['support.view', 'support.reply'] },
  { id: 5, name: 'مدیر سفارشات', color: '#ef4444', permissions: ['orders.view', 'orders.edit'] },
])*/


// مدیران
/*const adminUsers = ref([
  { 
    id: 1, 
    name: 'مدیر سیستم', 
    email: 'admin@petoman.com', 
    phone: '09121234567', 
    joinDate: '۱۴۰۱/۰۱/۰۱', 
    status: 'active',
    roles: [{ id: 1, name: 'مدیر کل', color: '#8b5cf6' }]
  },
  { 
    id: 2, 
    name: 'رضا کریمی', 
    email: 'reza@petoman.com', 
    phone: '09132345678', 
    joinDate: '۱۴۰۲/۰۳/۱۵', 
    status: 'active',
    roles: [
      { id: 2, name: 'مدیر محتوا', color: '#3b82f6' },
      { id: 4, name: 'پشتیبانی', color: '#f59e0b' }
    ]
  },
  { 
    id: 3, 
    name: 'فاطمه نوری', 
    email: 'fateme@petoman.com', 
    phone: '09143456789', 
    joinDate: '۱۴۰۲/۰۵/۲۰', 
    status: 'active',
    roles: [{ id: 3, name: 'مدیر مالی', color: '#10b981' }]
  },
])*/

// فیلتر کاربران عادی
const filteredRegularUsers = computed(() => {
  let filtered = regularUsers.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(u => 
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.phone.includes(query)
    )
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(u => u.status === statusFilter.value)
  }
  
  return filtered
})

// فیلتر مدیران
const filteredAdminUsers = computed(() => {
  let filtered = adminUsers.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(u => 
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.phone.includes(query)
    )
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(u => u.status === statusFilter.value)
  }
  
  return filtered
})

// نمایش Toast
const showToastMessage = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// مشاهده کاربر
const viewUser = (user) => {
  selectedUser.value = user
  showUserModal.value = true
}
/*
// تغییر وضعیت کاربر
const toggleUserStatus = (user) => {
  if (user.status === 'blocked') {
    user.status = 'active'
    showToastMessage('کاربر با موفقیت فعال شد')
  } else {
    user.status = 'blocked'
    showToastMessage('کاربر مسدود شد', 'error')
  }
}*/

// باز کردن مودال افزودن مدیر
const openAddAdminModal = () => {
  editingAdmin.value = null
  adminForm.value = {
    name: '',
    email: '',
    phone: '',
    password: '',
    roleIds: []
  }
  showAdminModal.value = true
}

// ویرایش مدیر
const editAdmin = (admin) => {
  editingAdmin.value = admin
  adminForm.value = {
    name: admin.name,
    email: admin.email,
    phone: admin.phone,
    password: '',
    roleIds: admin.roles.map(r => r.id)
  }
  showAdminModal.value = true
}

/*// ذخیره مدیر
const saveAdmin = () => {
  const selectedRoles = allRoles.value.filter(r => adminForm.value.roleIds.includes(r.id))
  
  if (editingAdmin.value) {
    // ویرایش
    const index = adminUsers.value.findIndex(a => a.id === editingAdmin.value.id)
    if (index !== -1) {
      adminUsers.value[index] = {
        ...adminUsers.value[index],
        name: adminForm.value.name,
        email: adminForm.value.email,
        phone: adminForm.value.phone,
        roles: selectedRoles
      }
    }
    showToastMessage('مدیر با موفقیت ویرایش شد')
  } else {
    // افزودن
    const newAdmin = {
      id: Date.now(),
      name: adminForm.value.name,
      email: adminForm.value.email,
      phone: adminForm.value.phone,
      joinDate: '۱۴۰۲/۰۹/۱۵',
      status: 'active',
      roles: selectedRoles
    }
    adminUsers.value.push(newAdmin)
    showToastMessage('مدیر جدید با موفقیت اضافه شد')
  }
  
  showAdminModal.value = false
}

// حذف مدیر
const deleteAdmin = (admin) => {
  if (confirm(`آیا از حذف ${admin.name} اطمینان دارید؟`)) {
    adminUsers.value = adminUsers.value.filter(a => a.id !== admin.id)
    showToastMessage('مدیر با موفقیت حذف شد')
  }
}*/

// باز کردن مودال تخصیص نقش
const openAssignRoleModal = (admin) => {
  selectedAdmin.value = admin
  assignedRoleIds.value = admin.roles.map(r => r.id)
  showAssignRoleModal.value = true
}

// ذخیره نقش‌های تخصیص داده شده
/*const saveAssignedRoles = () => {
  const selectedRoles = allRoles.value.filter(r => assignedRoleIds.value.includes(r.id))
  
  const index = adminUsers.value.findIndex(a => a.id === selectedAdmin.value.id)
  if (index !== -1) {
    adminUsers.value[index].roles = selectedRoles
  }
  
  showAssignRoleModal.value = false
  showToastMessage('نقش‌ها با موفقیت به‌روزرسانی شد')
}*/

// Export to Excel
const exportToExcel = () => {
  let data = []
  let filename = ''
  
  if (activeTab.value === 'regular') {
    filename = 'کاربران-عادی'
    data = regularUsers.value.map(user => ({
      'نام': user.name,
      'شماره موبایل': user.phone,
      'تاریخ عضویت': user.joinDate,
      'تعداد سفارشات': user.orders,
      'مجموع خرید (تومان)': user.totalPurchase,
      'وضعیت': user.status === 'active' ? 'فعال' : 'غیرفعال'
    }))
  } else {
    filename = 'مدیران-سیستم'
    data = adminUsers.value.map(admin => ({
      'نام': admin.name,
      'ایمیل': admin.email,
      'شماره موبایل': admin.phone,
      'نقش‌ها': admin.roles.map(r => r.name).join(' - '),
      'آخرین ورود': admin.lastLogin,
      'وضعیت': admin.status === 'active' ? 'فعال' : 'غیرفعال'
    }))
  }
  
  if (data.length === 0) {
    alert('داده‌ای برای خروجی وجود ندارد')
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
