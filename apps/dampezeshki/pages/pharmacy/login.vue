<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-green-600 rounded-xl flex items-center justify-center">
          <i class="ti ti-building-store text-2xl text-white"></i>
        </div>
        <h2 class="mt-6 text-3xl font-bold text-gray-900">ورود داروساز</h2>
        <p class="mt-2 text-sm text-gray-600">پنل مدیریت داروخانه</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="login" class="mt-8 space-y-6">
        <div class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">
              نام کاربری یا شماره پروانه
            </label>
            <input 
              id="username"
              v-model="form.username" 
              type="text" 
              required
              class="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10"
              placeholder="نام کاربری یا شماره پروانه داروسازی"
            >
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              رمز عبور
            </label>
            <input 
              id="password"
              v-model="form.password" 
              type="password" 
              required
              class="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10"
              placeholder="رمز عبور"
            >
          </div>
        </div>

        <!-- Remember & Forgot -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input 
              id="remember-me" 
              v-model="form.remember"
              type="checkbox" 
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            >
            <label for="remember-me" class="mr-2 block text-sm text-gray-900">
              مرا به خاطر بسپار
            </label>
          </div>
          <div class="text-sm">
            <NuxtLink to="/pharmacy/forgot-password" class="font-medium text-green-600 hover:text-green-500">
              فراموشی رمز عبور
            </NuxtLink>
          </div>
        </div>

        <!-- Submit Button -->
        <div>
          <button 
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center">
              <i class="ti ti-loader-2 animate-spin text-lg ml-2"></i>
              در حال ورود...
            </span>
            <span v-else class="flex items-center">
              <i class="ti ti-login text-lg ml-2"></i>
              ورود به پنل داروخانه
            </span>
          </button>
        </div>

        <!-- Register Link -->
        <div class="text-center">
          <p class="text-sm text-gray-600">
            داروخانه ندارید؟
            <NuxtLink to="/pharmacy/register" class="font-medium text-green-600 hover:text-green-500">
              ثبت نام داروخانه
            </NuxtLink>
          </p>
        </div>

        <!-- Back to Home -->
        <div class="text-center pt-4 border-t border-gray-200">
          <NuxtLink to="/" class="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center">
            <i class="ti ti-arrow-right text-sm ml-1"></i>
            بازگشت به صفحه اصلی
          </NuxtLink>
        </div>
      </form>

      <!-- Demo Login -->
      <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 class="text-sm font-medium text-blue-900 mb-2">ورود آزمایشی:</h3>
        <button 
          @click="demoLogin"
          class="w-full text-xs bg-blue-100 text-blue-800 px-3 py-2 rounded hover:bg-blue-200 transition-colors"
        >
          ورود با اکانت آزمایشی (داروخانه سلامت)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

// Form data
const form = ref({
  username: '',
  password: '',
  remember: false
})

const loading = ref(false)

// Login method
const login = async () => {
  loading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // For demo purposes, any credentials work
    if (form.value.username && form.value.password) {
      // Store pharmacy session
      const pharmacyUser = {
        id: 1,
        name: 'دکتر احمد رضایی',
        pharmacy: 'داروخانه سلامت',
        license: '12345',
        type: 'pharmacist'
      }
      
      // Store pharmacy session and redirect to pharmacy panel
      localStorage.setItem('pharmacy_authenticated', 'true')
      localStorage.setItem('pharmacyUser', JSON.stringify(pharmacyUser))
      
      // Redirect to pharmacy panel using Nuxt router
      await navigateTo('/panel/pharmacies')
    } else {
      alert('لطفاً تمام فیلدها را پر کنید')
    }
  } catch (error) {
    alert('خطا در ورود. لطفاً دوباره تلاش کنید.')
  } finally {
    loading.value = false
  }
}

// Demo login
const demoLogin = async () => {
  form.value.username = 'pharmacy_demo'
  form.value.password = 'demo123'
  await login()
}
</script>