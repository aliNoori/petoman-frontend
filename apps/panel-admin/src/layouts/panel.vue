<template>
  <div class="min-h-screen bg-gray-50">
    <div class="flex min-h-screen">
      <!-- Sidebar -->
      <div class="flex-none w-64 bg-white border-l border-gray-200 min-h-screen">
        <div class="flex flex-col h-full">
          <!-- Header -->
          <div class="flex items-center px-4 py-6 border-b border-gray-200">
            <div class="text-lg font-semibold text-gray-900">پنل مدیریت</div>
          </div>

          <!-- Navigation -->
          <div class="flex-1 px-3 py-4 space-y-1">
            <router-link
              to="/users"
              class="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
            >
              <i class="ti ti-users h-5 w-5 ml-3"></i>
              کاربران
            </router-link>

            <router-link
              to="/users/orders"
              class="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
            >
              <i class="ti ti-shopping-cart h-5 w-5 ml-3"></i>
              سفارشات
            </router-link>

            <router-link
              to="/users/tracking"
              class="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
            >
              <i class="ti ti-package h-5 w-5 ml-3"></i>
              پیگیری سفارش
            </router-link>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1">
        <main class="py-6 px-8">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>