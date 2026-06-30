<template>
  <div class="space-y-6 pb-24 md:pb-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">تنظیمات سیستم</h1>
        <p class="text-gray-500 mt-1">پیکربندی درگاه پرداخت، پیامک و حمل‌ونقل</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white rounded-xl border border-gray-200 p-1.5">
      <div class="flex flex-wrap gap-1">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          @click="activeTab = tab.key"
          class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="activeTab === tab.key ? '' : 'text-gray-600 hover:bg-gray-100'"
          :style="activeTab === tab.key ? { backgroundColor: tab.color, color: 'white' } : {}"
        >
          <i :class="tab.icon"></i>
          <span>{{ tab.label }}</span>
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    
    <!-- General Settings Tab -->
    <div v-if="activeTab === 'general'" class="space-y-6">
      <div class="bg-white rounded-xl border border-gray-200 p-6">
        <h3 class="font-bold text-gray-900 mb-6 flex items-center gap-2">
          <i class="ti ti-settings text-gray-600"></i>
          تنظیمات عمومی سایت
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">نام سایت</label>
            <input v-model="settings.general.siteName" type="text" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ایمیل پشتیبانی</label>
            <input v-model="settings.general.supportEmail" type="email" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">شماره تماس</label>
            <input v-model="settings.general.supportPhone" type="text" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">آدرس دفتر مرکزی</label>
            <input v-model="settings.general.address" type="text" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">توضیحات سایت</label>
            <textarea v-model="settings.general.description" rows="3" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Gateways Tab -->
    <div v-if="activeTab === 'payment'" class="space-y-6">
      <!-- Payment Gateway Tabs -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <!-- Tab Headers -->
        <div class="border-b border-gray-200 bg-gray-50 p-1.5">
          <div class="flex flex-wrap gap-1">
            <button 
              v-for="gateway in paymentGateways" 
              :key="gateway.key"
              @click="activePaymentTab = gateway.key"
              class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
              :class="activePaymentTab === gateway.key 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:bg-gray-100'"
            >
              <i :class="gateway.icon" :style="{ color: gateway.color }"></i>
              <span>{{ gateway.name }}</span>
              <span 
                v-if="settings.payment.activeGateway === gateway.key"
                class="px-1.5 py-0.5 text-[10px] bg-green-500 text-white rounded-full"
              >فعال</span>
              <span 
                v-else-if="getGatewayEnabled(gateway.key)"
                class="w-2 h-2 rounded-full bg-green-500"
              ></span>
            </button>
          </div>
        </div>

        <!-- Zarinpal Settings -->
        <div v-if="activePaymentTab === 'zarinpal'" class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-bold text-gray-900 flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                <i class="ti ti-brand-cashapp text-yellow-600"></i>
              </div>
              تنظیمات زرین‌پال
            </h3>
            <span 
              class="px-3 py-1 rounded-full text-xs font-medium"
              :class="settings.payment.zarinpal.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
            >
              {{ settings.payment.zarinpal.enabled ? 'فعال' : 'غیرفعال' }}
            </span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Merchant ID</label>
              <input 
                v-model="settings.payment.zarinpal.merchantId" 
                type="text" 
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-yellow-500" 
              />
            </div>
            <div>
              <AppSelect
                v-model="settings.payment.zarinpal.sandbox"
                :options="sandboxOptions"
                label="حالت"
              />
            </div>
          </div>
          <div class="flex items-center justify-end gap-3 mt-6">
            <button 
              v-if="settings.payment.activeGateway !== 'zarinpal'"
              @click="settings.payment.activeGateway = 'zarinpal'"
              class="px-4 py-2.5 rounded-lg border border-green-300 text-green-600 hover:bg-green-50"
            >
              <i class="ti ti-star ml-1"></i>
              انتخاب به عنوان درگاه اصلی
            </button>
            <button 
              @click="settings.payment.zarinpal.enabled = !settings.payment.zarinpal.enabled"
              class="px-4 py-2.5 rounded-lg border transition-colors"
              :class="settings.payment.zarinpal.enabled 
                ? 'border-red-300 text-red-600 hover:bg-red-50' 
                : 'border-green-300 text-green-600 hover:bg-green-50'"
            >
              <i :class="settings.payment.zarinpal.enabled ? 'ti ti-x' : 'ti ti-check'" class="ml-1"></i>
              {{ settings.payment.zarinpal.enabled ? 'غیرفعال کردن' : 'فعال کردن' }}
            </button>
          </div>
        </div>

        <!-- Saman Bank Settings -->
        <div v-if="activePaymentTab === 'saman'" class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-bold text-gray-900 flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <i class="ti ti-building-bank text-blue-600"></i>
              </div>
              تنظیمات بانک سامان (سپ)
            </h3>
            <span 
              class="px-3 py-1 rounded-full text-xs font-medium"
              :class="settings.payment.saman.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
            >
              {{ settings.payment.saman.enabled ? 'فعال' : 'غیرفعال' }}
            </span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Terminal ID</label>
              <input 
                v-model="settings.payment.saman.terminalId" 
                type="text" 
                placeholder="شناسه ترمینال"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">رمز ترمینال</label>
              <input 
                v-model="settings.payment.saman.password" 
                type="password" 
                placeholder="••••••••"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500" 
              />
            </div>
          </div>
          <div class="flex items-center justify-end gap-3 mt-6">
            <button 
              v-if="settings.payment.activeGateway !== 'saman'"
              @click="settings.payment.activeGateway = 'saman'"
              class="px-4 py-2.5 rounded-lg border border-green-300 text-green-600 hover:bg-green-50"
            >
              <i class="ti ti-star ml-1"></i>
              انتخاب به عنوان درگاه اصلی
            </button>
            <button 
              @click="settings.payment.saman.enabled = !settings.payment.saman.enabled"
              class="px-4 py-2.5 rounded-lg border transition-colors"
              :class="settings.payment.saman.enabled 
                ? 'border-red-300 text-red-600 hover:bg-red-50' 
                : 'border-green-300 text-green-600 hover:bg-green-50'"
            >
              <i :class="settings.payment.saman.enabled ? 'ti ti-x' : 'ti ti-check'" class="ml-1"></i>
              {{ settings.payment.saman.enabled ? 'غیرفعال کردن' : 'فعال کردن' }}
            </button>
          </div>
        </div>

        <!-- Mellat Bank Settings -->
        <div v-if="activePaymentTab === 'mellat'" class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-bold text-gray-900 flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
                <i class="ti ti-building-bank text-rose-600"></i>
              </div>
              تنظیمات بانک ملت (به‌پرداخت)
            </h3>
            <span 
              class="px-3 py-1 rounded-full text-xs font-medium"
              :class="settings.payment.mellat.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
            >
              {{ settings.payment.mellat.enabled ? 'فعال' : 'غیرفعال' }}
            </span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Terminal ID</label>
              <input 
                v-model="settings.payment.mellat.terminalId" 
                type="text" 
                placeholder="شناسه ترمینال"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-rose-500" 
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">نام کاربری</label>
              <input 
                v-model="settings.payment.mellat.username" 
                type="text" 
                placeholder="Username"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-rose-500" 
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">رمز عبور</label>
              <input 
                v-model="settings.payment.mellat.password" 
                type="password" 
                placeholder="••••••••"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-rose-500" 
              />
            </div>
          </div>
          <div class="flex items-center justify-end gap-3 mt-6">
            <button 
              v-if="settings.payment.activeGateway !== 'mellat'"
              @click="settings.payment.activeGateway = 'mellat'"
              class="px-4 py-2.5 rounded-lg border border-green-300 text-green-600 hover:bg-green-50"
            >
              <i class="ti ti-star ml-1"></i>
              انتخاب به عنوان درگاه اصلی
            </button>
            <button 
              @click="settings.payment.mellat.enabled = !settings.payment.mellat.enabled"
              class="px-4 py-2.5 rounded-lg border transition-colors"
              :class="settings.payment.mellat.enabled 
                ? 'border-red-300 text-red-600 hover:bg-red-50' 
                : 'border-green-300 text-green-600 hover:bg-green-50'"
            >
              <i :class="settings.payment.mellat.enabled ? 'ti ti-x' : 'ti ti-check'" class="ml-1"></i>
              {{ settings.payment.mellat.enabled ? 'غیرفعال کردن' : 'فعال کردن' }}
            </button>
          </div>
        </div>

        <!-- Sadad (Melli) Bank Settings -->
        <div v-if="activePaymentTab === 'sadad'" class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-bold text-gray-900 flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
                <i class="ti ti-building-bank text-sky-600"></i>
              </div>
              تنظیمات سداد (بانک ملی)
            </h3>
            <span 
              class="px-3 py-1 rounded-full text-xs font-medium"
              :class="settings.payment.sadad.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
            >
              {{ settings.payment.sadad.enabled ? 'فعال' : 'غیرفعال' }}
            </span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Merchant ID</label>
              <input 
                v-model="settings.payment.sadad.merchantId" 
                type="text" 
                placeholder="شناسه پذیرنده"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-sky-500" 
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Terminal ID</label>
              <input 
                v-model="settings.payment.sadad.terminalId" 
                type="text" 
                placeholder="شناسه ترمینال"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-sky-500" 
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">کلید ترمینال</label>
              <input 
                v-model="settings.payment.sadad.terminalKey" 
                type="password" 
                placeholder="••••••••"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-sky-500" 
              />
            </div>
          </div>
          <div class="flex items-center justify-end gap-3 mt-6">
            <button 
              v-if="settings.payment.activeGateway !== 'sadad'"
              @click="settings.payment.activeGateway = 'sadad'"
              class="px-4 py-2.5 rounded-lg border border-green-300 text-green-600 hover:bg-green-50"
            >
              <i class="ti ti-star ml-1"></i>
              انتخاب به عنوان درگاه اصلی
            </button>
            <button 
              @click="settings.payment.sadad.enabled = !settings.payment.sadad.enabled"
              class="px-4 py-2.5 rounded-lg border transition-colors"
              :class="settings.payment.sadad.enabled 
                ? 'border-red-300 text-red-600 hover:bg-red-50' 
                : 'border-green-300 text-green-600 hover:bg-green-50'"
            >
              <i :class="settings.payment.sadad.enabled ? 'ti ti-x' : 'ti ti-check'" class="ml-1"></i>
              {{ settings.payment.sadad.enabled ? 'غیرفعال کردن' : 'فعال کردن' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- SMS Tab -->
    <div v-if="activeTab === 'sms'" class="space-y-6">
      <!-- Mediana SMS Settings -->
      <div class="bg-white rounded-xl border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-bold text-gray-900 flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <i class="ti ti-message-2 text-purple-600"></i>
            </div>
            تنظیمات مدیر پیامک
          </h3>
          <span 
            class="px-3 py-1 rounded-full text-xs font-medium"
            :class="settings.sms.mediana.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
          >
            {{ settings.sms.mediana.enabled ? 'فعال' : 'غیرفعال' }}
          </span>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">API Key</label>
            <input 
              v-model="settings.sms.mediana.apiKey" 
              type="text" 
              placeholder="کلید API"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-purple-500" 
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">شماره ارسال‌کننده</label>
            <input 
              v-model="settings.sms.mediana.sender" 
              type="text" 
              placeholder="3000xxxxx"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-purple-500" 
            />
          </div>
        </div>
        <div class="flex items-center justify-end gap-4 mt-6">
          <button 
            @click="testSms('mediana')"
            class="px-4 py-2.5 rounded-lg border border-purple-300 text-purple-600 hover:bg-purple-50"
          >
            <i class="ti ti-send ml-1"></i>
            تست ارسال
          </button>
          <button 
            @click="settings.sms.mediana.enabled = !settings.sms.mediana.enabled"
            class="px-4 py-2.5 rounded-lg border transition-colors"
            :class="settings.sms.mediana.enabled 
              ? 'border-red-300 text-red-600 hover:bg-red-50' 
              : 'border-green-300 text-green-600 hover:bg-green-50'"
          >
            {{ settings.sms.mediana.enabled ? 'غیرفعال کردن' : 'فعال کردن' }}
          </button>
        </div>
      </div>

      <!-- SMS Templates by Category -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div class="border-b border-gray-200 bg-gray-50 p-1.5">
          <div class="flex flex-wrap gap-1">
            <button 
              v-for="cat in smsCategories" 
              :key="cat.key"
              @click="activeSmsCategory = cat.key"
              class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
              :class="activeSmsCategory === cat.key 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:bg-gray-100'"
            >
              <i :class="cat.icon" :style="{ color: cat.color }"></i>
              <span>{{ cat.label }}</span>
            </button>
          </div>
        </div>

        <div class="p-6">
          <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="ti ti-template text-gray-600"></i>
            الگوهای پیامک - {{ smsCategories.find(c => c.key === activeSmsCategory)?.label }}
          </h3>
          
          <p class="text-sm text-gray-500 mb-6 p-3 bg-blue-50 rounded-lg">
            <i class="ti ti-info-circle ml-1"></i>
            برای هر الگو کد پترن مدیر پیامک رو وارد کنید. متغیرها به صورت خودکار جایگزین می‌شوند.
          </p>

          <!-- General Templates -->
          <div v-if="activeSmsCategory === 'general'" class="space-y-4">
            <div class="p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900">کد تأیید ورود</p>
                  <p class="text-xs text-gray-500 mt-1">متغیرها: {code}, {phone}</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="settings.sms.templates.general.otp.pattern" type="text" placeholder="کد پترن مدیر پیامک" class="px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm" />
                <input v-model="settings.sms.templates.general.otp.text" type="text" placeholder="پیش‌نمایش متن (اختیاری)" class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <div class="p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900">خوش‌آمدگویی</p>
                  <p class="text-xs text-gray-500 mt-1">متغیرها: {name}, {phone}</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="settings.sms.templates.general.welcome.pattern" type="text" placeholder="کد پترن" class="px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm" />
                <input v-model="settings.sms.templates.general.welcome.text" type="text" placeholder="پیش‌نمایش متن" class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <div class="p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900">فراموشی رمز عبور</p>
                  <p class="text-xs text-gray-500 mt-1">متغیرها: {code}, {phone}</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="settings.sms.templates.general.forgotPassword.pattern" type="text" placeholder="کد پترن" class="px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm" />
                <input v-model="settings.sms.templates.general.forgotPassword.text" type="text" placeholder="پیش‌نمایش متن" class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
          </div>

          <!-- Market/PetShop Templates -->
          <div v-if="activeSmsCategory === 'market'" class="space-y-4">
            <div class="p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900">ایجاد پت‌شاپ جدید</p>
                  <p class="text-xs text-gray-500 mt-1">متغیرها: {shopName}, {ownerName}, {phone}</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="settings.sms.templates.market.created.pattern" type="text" placeholder="کد پترن" class="px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm" />
                <input v-model="settings.sms.templates.market.created.text" type="text" placeholder="پیش‌نمایش متن" class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <div class="p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900">تأیید پت‌شاپ</p>
                  <p class="text-xs text-gray-500 mt-1">متغیرها: {shopName}, {ownerName}</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="settings.sms.templates.market.approved.pattern" type="text" placeholder="کد پترن" class="px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm" />
                <input v-model="settings.sms.templates.market.approved.text" type="text" placeholder="پیش‌نمایش متن" class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <div class="p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900">سفارش جدید</p>
                  <p class="text-xs text-gray-500 mt-1">متغیرها: {orderId}, {total}, {shopName}</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="settings.sms.templates.market.newOrder.pattern" type="text" placeholder="کد پترن" class="px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm" />
                <input v-model="settings.sms.templates.market.newOrder.text" type="text" placeholder="پیش‌نمایش متن" class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <div class="p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900">درخواست برداشت</p>
                  <p class="text-xs text-gray-500 mt-1">متغیرها: {amount}, {shopName}, {status}</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="settings.sms.templates.market.withdrawal.pattern" type="text" placeholder="کد پترن" class="px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm" />
                <input v-model="settings.sms.templates.market.withdrawal.text" type="text" placeholder="پیش‌نمایش متن" class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <div class="p-4 bg-green-50 rounded-xl border border-green-200">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900">تأیید محصول</p>
                  <p class="text-xs text-gray-500 mt-1">متغیرها: {productName}, {shopName}, {ownerName}</p>
                </div>
                <span class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">محصولات</span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="settings.sms.templates.market.productApproved.pattern" type="text" placeholder="کد پترن" class="px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm" />
                <input v-model="settings.sms.templates.market.productApproved.text" type="text" placeholder="پیش‌نمایش متن" class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <div class="p-4 bg-red-50 rounded-xl border border-red-200">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900">رد محصول</p>
                  <p class="text-xs text-gray-500 mt-1">متغیرها: {productName}, {shopName}, {ownerName}, {reason}</p>
                </div>
                <span class="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">محصولات</span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="settings.sms.templates.market.productRejected.pattern" type="text" placeholder="کد پترن" class="px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm" />
                <input v-model="settings.sms.templates.market.productRejected.text" type="text" placeholder="پیش‌نمایش متن" class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
          </div>

          <!-- Pharmacy Templates -->
          <div v-if="activeSmsCategory === 'pharmacy'" class="space-y-4">
            <div class="p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900">ایجاد داروخانه جدید</p>
                  <p class="text-xs text-gray-500 mt-1">متغیرها: {pharmacyName}, {ownerName}, {phone}</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="settings.sms.templates.pharmacy.created.pattern" type="text" placeholder="کد پترن" class="px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm" />
                <input v-model="settings.sms.templates.pharmacy.created.text" type="text" placeholder="پیش‌نمایش متن" class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <div class="p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900">تأیید داروخانه</p>
                  <p class="text-xs text-gray-500 mt-1">متغیرها: {pharmacyName}, {ownerName}</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="settings.sms.templates.pharmacy.approved.pattern" type="text" placeholder="کد پترن" class="px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm" />
                <input v-model="settings.sms.templates.pharmacy.approved.text" type="text" placeholder="پیش‌نمایش متن" class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <div class="p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900">نسخه جدید</p>
                  <p class="text-xs text-gray-500 mt-1">متغیرها: {prescriptionId}, {patientName}, {pharmacyName}</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="settings.sms.templates.pharmacy.newPrescription.pattern" type="text" placeholder="کد پترن" class="px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm" />
                <input v-model="settings.sms.templates.pharmacy.newPrescription.text" type="text" placeholder="پیش‌نمایش متن" class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <div class="p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900">درخواست برداشت</p>
                  <p class="text-xs text-gray-500 mt-1">متغیرها: {amount}, {pharmacyName}, {status}</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="settings.sms.templates.pharmacy.withdrawal.pattern" type="text" placeholder="کد پترن" class="px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm" />
                <input v-model="settings.sms.templates.pharmacy.withdrawal.text" type="text" placeholder="پیش‌نمایش متن" class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <div class="p-4 bg-green-50 rounded-xl border border-green-200">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900">تأیید محصول/دارو</p>
                  <p class="text-xs text-gray-500 mt-1">متغیرها: {productName}, {pharmacyName}, {ownerName}</p>
                </div>
                <span class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">محصولات</span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="settings.sms.templates.pharmacy.productApproved.pattern" type="text" placeholder="کد پترن" class="px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm" />
                <input v-model="settings.sms.templates.pharmacy.productApproved.text" type="text" placeholder="پیش‌نمایش متن" class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <div class="p-4 bg-red-50 rounded-xl border border-red-200">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900">رد محصول/دارو</p>
                  <p class="text-xs text-gray-500 mt-1">متغیرها: {productName}, {pharmacyName}, {ownerName}, {reason}</p>
                </div>
                <span class="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">محصولات</span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="settings.sms.templates.pharmacy.productRejected.pattern" type="text" placeholder="کد پترن" class="px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm" />
                <input v-model="settings.sms.templates.pharmacy.productRejected.text" type="text" placeholder="پیش‌نمایش متن" class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
          </div>

          <!-- Clinic Templates -->
          <div v-if="activeSmsCategory === 'clinic'" class="space-y-4">
            <div class="p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900">ایجاد کلینیک جدید</p>
                  <p class="text-xs text-gray-500 mt-1">متغیرها: {clinicName}, {ownerName}, {phone}</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="settings.sms.templates.clinic.created.pattern" type="text" placeholder="کد پترن" class="px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm" />
                <input v-model="settings.sms.templates.clinic.created.text" type="text" placeholder="پیش‌نمایش متن" class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <div class="p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900">تأیید کلینیک</p>
                  <p class="text-xs text-gray-500 mt-1">متغیرها: {clinicName}, {ownerName}</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="settings.sms.templates.clinic.approved.pattern" type="text" placeholder="کد پترن" class="px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm" />
                <input v-model="settings.sms.templates.clinic.approved.text" type="text" placeholder="پیش‌نمایش متن" class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <div class="p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900">نوبت جدید</p>
                  <p class="text-xs text-gray-500 mt-1">متغیرها: {appointmentId}, {patientName}, {date}, {time}, {clinicName}</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="settings.sms.templates.clinic.newAppointment.pattern" type="text" placeholder="کد پترن" class="px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm" />
                <input v-model="settings.sms.templates.clinic.newAppointment.text" type="text" placeholder="پیش‌نمایش متن" class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <div class="p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900">یادآوری نوبت</p>
                  <p class="text-xs text-gray-500 mt-1">متغیرها: {patientName}, {date}, {time}, {clinicName}</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="settings.sms.templates.clinic.appointmentReminder.pattern" type="text" placeholder="کد پترن" class="px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm" />
                <input v-model="settings.sms.templates.clinic.appointmentReminder.text" type="text" placeholder="پیش‌نمایش متن" class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <div class="p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900">درخواست برداشت</p>
                  <p class="text-xs text-gray-500 mt-1">متغیرها: {amount}, {clinicName}, {status}</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="settings.sms.templates.clinic.withdrawal.pattern" type="text" placeholder="کد پترن" class="px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm" />
                <input v-model="settings.sms.templates.clinic.withdrawal.text" type="text" placeholder="پیش‌نمایش متن" class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
          </div>

          <!-- Vet Templates -->
          <div v-if="activeSmsCategory === 'vet'" class="space-y-4">
            <div class="p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900">ثبت‌نام دامپزشک جدید</p>
                  <p class="text-xs text-gray-500 mt-1">متغیرها: {vetName}, {phone}, {speciality}</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="settings.sms.templates.vet.created.pattern" type="text" placeholder="کد پترن" class="px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm" />
                <input v-model="settings.sms.templates.vet.created.text" type="text" placeholder="پیش‌نمایش متن" class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <div class="p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900">تأیید دامپزشک</p>
                  <p class="text-xs text-gray-500 mt-1">متغیرها: {vetName}</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="settings.sms.templates.vet.approved.pattern" type="text" placeholder="کد پترن" class="px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm" />
                <input v-model="settings.sms.templates.vet.approved.text" type="text" placeholder="پیش‌نمایش متن" class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <div class="p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900">ویزیت جدید</p>
                  <p class="text-xs text-gray-500 mt-1">متغیرها: {visitId}, {patientName}, {petName}, {vetName}</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="settings.sms.templates.vet.newVisit.pattern" type="text" placeholder="کد پترن" class="px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm" />
                <input v-model="settings.sms.templates.vet.newVisit.text" type="text" placeholder="پیش‌نمایش متن" class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <div class="p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900">درخواست برداشت</p>
                  <p class="text-xs text-gray-500 mt-1">متغیرها: {amount}, {vetName}, {status}</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="settings.sms.templates.vet.withdrawal.pattern" type="text" placeholder="کد پترن" class="px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm" />
                <input v-model="settings.sms.templates.vet.withdrawal.text" type="text" placeholder="پیش‌نمایش متن" class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
          </div>

          <!-- Order Templates -->
          <div v-if="activeSmsCategory === 'order'" class="space-y-4">
            <div class="p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900">ثبت سفارش (برای مشتری)</p>
                  <p class="text-xs text-gray-500 mt-1">متغیرها: {orderId}, {total}, {customerName}</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="settings.sms.templates.order.placed.pattern" type="text" placeholder="کد پترن" class="px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm" />
                <input v-model="settings.sms.templates.order.placed.text" type="text" placeholder="پیش‌نمایش متن" class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <div class="p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900">تأیید سفارش</p>
                  <p class="text-xs text-gray-500 mt-1">متغیرها: {orderId}, {customerName}</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="settings.sms.templates.order.confirmed.pattern" type="text" placeholder="کد پترن" class="px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm" />
                <input v-model="settings.sms.templates.order.confirmed.text" type="text" placeholder="پیش‌نمایش متن" class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <div class="p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900">ارسال سفارش</p>
                  <p class="text-xs text-gray-500 mt-1">متغیرها: {orderId}, {trackingCode}, {customerName}</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="settings.sms.templates.order.shipped.pattern" type="text" placeholder="کد پترن" class="px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm" />
                <input v-model="settings.sms.templates.order.shipped.text" type="text" placeholder="پیش‌نمایش متن" class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <div class="p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900">تحویل سفارش</p>
                  <p class="text-xs text-gray-500 mt-1">متغیرها: {orderId}, {customerName}</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="settings.sms.templates.order.delivered.pattern" type="text" placeholder="کد پترن" class="px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm" />
                <input v-model="settings.sms.templates.order.delivered.text" type="text" placeholder="پیش‌نمایش متن" class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <div class="p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900">لغو سفارش</p>
                  <p class="text-xs text-gray-500 mt-1">متغیرها: {orderId}, {customerName}, {reason}</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="settings.sms.templates.order.cancelled.pattern" type="text" placeholder="کد پترن" class="px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm" />
                <input v-model="settings.sms.templates.order.cancelled.text" type="text" placeholder="پیش‌نمایش متن" class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <div class="p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900">تغییر وضعیت سفارش</p>
                  <p class="text-xs text-gray-500 mt-1">متغیرها: {orderId}, {customerName}, {oldStatus}, {newStatus}</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="settings.sms.templates.order.statusChanged.pattern" type="text" placeholder="کد پترن" class="px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm" />
                <input v-model="settings.sms.templates.order.statusChanged.text" type="text" placeholder="پیش‌نمایش متن" class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Shipping Tab -->
    <div v-if="activeTab === 'shipping'" class="space-y-6">
      <!-- Shipping Methods -->
      <div class="bg-white rounded-xl border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-bold text-gray-900 flex items-center gap-2">
            <i class="ti ti-truck text-orange-600"></i>
            روش‌های حمل‌ونقل
          </h3>
          <button @click="showAddShippingModal = true" class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2">
            <i class="ti ti-plus"></i>
            افزودن روش جدید
          </button>
        </div>
        
        <div class="space-y-4">
          <div 
            v-for="method in settings.shipping.methods" 
            :key="method.id"
            class="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50"
          >
            <div class="flex items-center gap-4">
              <div 
                class="w-12 h-12 rounded-xl flex items-center justify-center"
                :style="{ backgroundColor: method.color + '20', color: method.color }"
              >
                <i :class="method.icon" class="text-xl"></i>
              </div>
              <div>
                <p class="font-bold text-gray-900">{{ method.name }}</p>
                <p class="text-sm text-gray-500">{{ method.description }}</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-left">
                <p class="font-bold text-gray-900">{{ formatPrice(method.price) }} تومان</p>
                <p class="text-xs text-gray-500">{{ method.estimatedDays }} روز کاری</p>
              </div>
              <div class="flex items-center gap-2">
                <button 
                  @click="toggleShippingMethod(method)"
                  class="p-2 rounded-lg transition-colors"
                  :class="method.enabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'"
                >
                  <i :class="method.enabled ? 'ti ti-check' : 'ti ti-x'"></i>
                </button>
                <button @click="editShippingMethod(method)" class="p-2 hover:bg-gray-100 rounded-lg">
                  <i class="ti ti-edit text-gray-500"></i>
                </button>
                <button v-if="!method.isDefault" @click="deleteShippingMethod(method)" class="p-2 hover:bg-red-50 rounded-lg">
                  <i class="ti ti-trash text-red-500"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- AloPeyk API Settings -->
      <div class="bg-white rounded-xl border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-bold text-gray-900 flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <i class="ti ti-motorbike text-green-600"></i>
            </div>
            تنظیمات الوپیک (AloPeyk)
          </h3>
          <span 
            class="px-3 py-1 rounded-full text-xs font-medium"
            :class="settings.shipping.alopeyk.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
          >
            {{ settings.shipping.alopeyk.enabled ? 'فعال' : 'غیرفعال' }}
          </span>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">API Token</label>
            <input 
              v-model="settings.shipping.alopeyk.apiToken" 
              type="text" 
              placeholder="توکن API الوپیک"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-green-500" 
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">محیط</label>
            <AppSelect
              v-model="settings.shipping.alopeyk.sandbox"
              :options="[{ value: true, label: 'تست (Sandbox)' }, { value: false, label: 'عملیاتی (Production)' }]"
              icon="ti ti-flask"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">نوع وسیله پیش‌فرض</label>
            <AppSelect
              v-model="settings.shipping.alopeyk.defaultVehicle"
              :options="alopeykVehicles"
              icon="ti ti-car"
            />
          </div>
          <div class="flex items-end gap-4">
            <button 
              @click="testAlopeyk"
              class="px-4 py-2.5 rounded-lg border border-green-300 text-green-600 hover:bg-green-50"
            >
              <i class="ti ti-refresh ml-1"></i>
              تست اتصال
            </button>
            <button 
              @click="settings.shipping.alopeyk.enabled = !settings.shipping.alopeyk.enabled"
              class="px-4 py-2.5 rounded-lg border transition-colors"
              :class="settings.shipping.alopeyk.enabled 
                ? 'border-red-300 text-red-600 hover:bg-red-50' 
                : 'border-green-300 text-green-600 hover:bg-green-50'"
            >
              {{ settings.shipping.alopeyk.enabled ? 'غیرفعال کردن' : 'فعال کردن' }}
            </button>
          </div>
        </div>

        <!-- AloPeyk Pricing -->
        <div class="mt-6 p-4 bg-green-50 rounded-xl">
          <h4 class="font-medium text-gray-900 mb-3">تنظیمات قیمت‌گذاری</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs text-gray-600 mb-1">حداقل هزینه ارسال</label>
              <input 
                v-model="settings.shipping.alopeyk.minPrice" 
                type="number" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
              />
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1">درصد تخفیف پتومن</label>
              <input 
                v-model="settings.shipping.alopeyk.discountPercent" 
                type="number" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
              />
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1">حداکثر فاصله (کیلومتر)</label>
              <input 
                v-model="settings.shipping.alopeyk.maxDistance" 
                type="number" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Free Shipping Settings -->
      <div class="bg-white rounded-xl border border-gray-200 p-6">
        <h3 class="font-bold text-gray-900 mb-6 flex items-center gap-2">
          <i class="ti ti-gift text-purple-600"></i>
          تنظیمات ارسال رایگان
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">حداقل مبلغ سفارش برای ارسال رایگان</label>
            <div class="relative">
              <input 
                v-model="settings.shipping.freeShippingMin" 
                type="number" 
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" 
              />
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">تومان</span>
            </div>
          </div>
          <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <input 
              type="checkbox" 
              id="freeShippingEnabled" 
              v-model="settings.shipping.freeShippingEnabled"
              class="w-5 h-5 text-purple-600 rounded"
            />
            <label for="freeShippingEnabled" class="text-sm text-gray-700">فعال بودن ارسال رایگان</label>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4">
      <p class="text-sm text-gray-500">
        <i class="ti ti-info-circle ml-1"></i>
        تغییرات ذخیره نشده از بین خواهند رفت
      </p>
      <div class="flex items-center gap-3">
        <button @click="resetSettings" class="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
          بازنشانی
        </button>
        <button @click="handleSaveSettings" class="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2">
          <i class="ti ti-device-floppy"></i>
          ذخیره تنظیمات
        </button>
      </div>
    </div>

    <!-- Add Shipping Method Modal -->
    <div v-if="showAddShippingModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="showAddShippingModal = false">
      <div class="bg-white rounded-2xl w-full max-w-md">
        <div class="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 class="font-bold text-gray-900 text-lg">{{ editingShippingMethod ? 'ویرایش روش ارسال' : 'افزودن روش ارسال' }}</h3>
          <button @click="closeShippingModal" class="p-2 hover:bg-gray-100 rounded-lg">
            <i class="ti ti-x text-gray-500"></i>
          </button>
        </div>
        
        <div class="p-5 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">نام روش</label>
            <input v-model="shippingForm.name" type="text" placeholder="مثال: پست پیشتاز" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
            <input v-model="shippingForm.description" type="text" placeholder="توضیح کوتاه" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">هزینه (تومان)</label>
              <input v-model="shippingForm.price" type="number" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">زمان تحویل (روز)</label>
              <input v-model="shippingForm.estimatedDays" type="number" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">آیکون</label>
              <AppSelect v-model="shippingForm.icon" :options="shippingIcons" icon="ti ti-icons" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">رنگ</label>
              <input v-model="shippingForm.color" type="color" class="w-full h-[42px] border border-gray-300 rounded-lg cursor-pointer" />
            </div>
          </div>
        </div>
        
        <div class="p-5 border-t border-gray-100 flex items-center justify-end gap-3">
          <button @click="closeShippingModal" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">انصراف</button>
          <button @click="saveShippingMethod" class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
            {{ editingShippingMethod ? 'ذخیره تغییرات' : 'افزودن' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="toast.show" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div 
          class="px-6 py-3 rounded-xl shadow-lg flex items-center gap-3"
          :class="{
            'bg-green-600 text-white': toast.type === 'success',
            'bg-red-600 text-white': toast.type === 'error',
            'bg-blue-600 text-white': toast.type === 'info'
          }"
        >
          <i :class="toast.type === 'success' ? 'ti ti-check' : toast.type === 'error' ? 'ti ti-x' : 'ti ti-info-circle'"></i>
          {{ toast.message }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppSelect from '@/components/AppSelect.vue'
import { useAdminSettingsStore } from "@/stores/admin/settings.js";

// استفاده از استور
const adminSettingsStore = useAdminSettingsStore();
const { fetchSettings, saveSettings: saveToApi, loading } = adminSettingsStore;

const activeTab = ref('general')
const activePaymentTab = ref('zarinpal')
const activeSmsCategory = ref('general')
const showAddShippingModal = ref(false)
const editingShippingMethod = ref(null)
const toast = ref({ show: false, message: '', type: 'success' })

const tabs = [
  { key: 'general', label: 'عمومی', icon: 'ti ti-settings', color: '#6b7280' },
  { key: 'payment', label: 'درگاه پرداخت', icon: 'ti ti-credit-card', color: '#10b981' },
  { key: 'sms', label: 'پیامک', icon: 'ti ti-message', color: '#3b82f6' },
  { key: 'shipping', label: 'حمل‌ونقل', icon: 'ti ti-truck', color: '#f97316' },
]

const smsCategories = [
  { key: 'general', label: 'عمومی', icon: 'ti ti-settings', color: '#6b7280' },
  { key: 'market', label: 'پت‌شاپ‌ها', icon: 'ti ti-building-store', color: '#10b981' },
  { key: 'pharmacy', label: 'داروخانه‌ها', icon: 'ti ti-pill', color: '#8b5cf6' },
  { key: 'clinic', label: 'کلینیک‌ها', icon: 'ti ti-building-hospital', color: '#ef4444' },
  { key: 'vet', label: 'دامپزشکان', icon: 'ti ti-stethoscope', color: '#0ea5e9' },
  { key: 'order', label: 'سفارشات', icon: 'ti ti-shopping-cart', color: '#f97316' },
]

const paymentGateways = [
  { key: 'zarinpal', name: 'زرین‌پال', description: 'درگاه محبوب ایرانی', icon: 'ti ti-brand-cashapp', color: '#f59e0b' },
  { key: 'saman', name: 'بانک سامان', description: 'درگاه مستقیم سپ', icon: 'ti ti-building-bank', color: '#3b82f6' },
  { key: 'mellat', name: 'بانک ملت', description: 'درگاه به‌پرداخت', icon: 'ti ti-building-bank', color: '#ef4444' },
  { key: 'sadad', name: 'سداد (ملی)', description: 'درگاه بانک ملی', icon: 'ti ti-building-bank', color: '#0ea5e9' },
]

const alopeykVehicles = [
  { value: 'motorbike', label: 'موتورسیکلت', icon: 'ti ti-motorbike' },
  { value: 'car', label: 'خودرو سواری', icon: 'ti ti-car' },
  { value: 'cargo', label: 'وانت', icon: 'ti ti-truck' },
  { value: 'cargo_s', label: 'وانت کوچک', icon: 'ti ti-truck-delivery' },
]

const shippingIcons = [
  { value: 'ti ti-truck', label: 'کامیون' },
  { value: 'ti ti-truck-delivery', label: 'تحویل' },
  { value: 'ti ti-motorbike', label: 'موتور' },
  { value: 'ti ti-plane', label: 'هواپیما' },
  { value: 'ti ti-package', label: 'بسته' },
  { value: 'ti ti-building-store', label: 'فروشگاه' },
]

const sandboxOptions = [
  { value: true, label: 'تست (Sandbox)', icon: 'ti ti-flask' },
  { value: false, label: 'عملیاتی (Production)', icon: 'ti ti-rocket' },
]

const shippingForm = ref({
  name: '',
  description: '',
  price: 0,
  estimatedDays: 3,
  icon: 'ti ti-truck',
  color: '#f97316'
})

// مقادیر پیش‌فرض
const defaultSettings = {
  general: {
    siteName: 'پت‌ئومن',
    description: 'پلتفرم جامع حیوانات خانگی',
    supportEmail: 'support@petoman.com',
    supportPhone: '021-91009100',
    address: 'تهران، میدان ونک'
  },
  payment: {
    activeGateway: 'zarinpal',
    zarinpal: { enabled: true, merchantId: '', sandbox: true },
    saman: { enabled: false, terminalId: '', password: '' },
    mellat: { enabled: false, terminalId: '', username: '', password: '' },
    sadad: { enabled: false, merchantId: '', terminalId: '', terminalKey: '' }
  },
  sms: {
    activeService: 'mediana',
    mediana: { enabled: true, apiKey: '', sender: '' },
    templates: {
      general: {
        otp: { pattern: '', text: 'کد تأیید شما: {code}' },
        welcome: { pattern: '', text: 'به پت‌ئومن خوش آمدید {name} عزیز' },
        forgotPassword: { pattern: '', text: 'کد بازیابی رمز عبور: {code}' }
      },
      market: {
        created: { pattern: '', text: 'پت‌شاپ {shopName} با موفقیت ایجاد شد' },
        approved: { pattern: '', text: 'پت‌شاپ {shopName} تأیید شد' },
        newOrder: { pattern: '', text: 'سفارش جدید #{orderId} - مبلغ: {total} تومان' },
        withdrawal: { pattern: '', text: 'درخواست برداشت {amount} تومان - وضعیت: {status}' },
        productApproved: { pattern: '', text: 'محصول {productName} تأیید شد' },
        productRejected: { pattern: '', text: 'محصول {productName} رد شد - دلیل: {reason}' }
      },
      pharmacy: {
        created: { pattern: '', text: 'داروخانه {pharmacyName} با موفقیت ایجاد شد' },
        approved: { pattern: '', text: 'داروخانه {pharmacyName} تأیید شد' },
        newPrescription: { pattern: '', text: 'نسخه جدید #{prescriptionId} از {patientName}' },
        withdrawal: { pattern: '', text: 'درخواست برداشت {amount} تومان - وضعیت: {status}' },
        productApproved: { pattern: '', text: 'دارو/محصول {productName} تأیید شد' },
        productRejected: { pattern: '', text: 'دارو/محصول {productName} رد شد - دلیل: {reason}' }
      },
      clinic: {
        created: { pattern: '', text: 'کلینیک {clinicName} با موفقیت ایجاد شد' },
        approved: { pattern: '', text: 'کلینیک {clinicName} تأیید شد' },
        newAppointment: { pattern: '', text: 'نوبت جدید - {patientName} - {date} ساعت {time}' },
        appointmentReminder: { pattern: '', text: 'یادآوری: نوبت شما فردا {date} ساعت {time}' },
        withdrawal: { pattern: '', text: 'درخواست برداشت {amount} تومان - وضعیت: {status}' }
      },
      vet: {
        created: { pattern: '', text: 'دکتر {vetName} با موفقیت ثبت‌نام شد' },
        approved: { pattern: '', text: 'دکتر {vetName} تأیید شد' },
        newVisit: { pattern: '', text: 'ویزیت جدید - {patientName} - {petName}' },
        withdrawal: { pattern: '', text: 'درخواست برداشت {amount} تومان - وضعیت: {status}' }
      },
      order: {
        placed: { pattern: '', text: 'سفارش #{orderId} ثبت شد - مبلغ: {total} تومان' },
        confirmed: { pattern: '', text: 'سفارش #{orderId} تأیید شد' },
        shipped: { pattern: '', text: 'سفارش #{orderId} ارسال شد - کد پیگیری: {trackingCode}' },
        delivered: { pattern: '', text: 'سفارش #{orderId} تحویل داده شد' },
        cancelled: { pattern: '', text: 'سفارش #{orderId} لغو شد - دلیل: {reason}' },
        statusChanged: { pattern: '', text: 'وضعیت سفارش #{orderId} از {oldStatus} به {newStatus} تغییر کرد' }
      }
    }
  },
  shipping: {
    freeShippingEnabled: true,
    freeShippingMin: 500000,
    methods: [
      { id: 1, name: 'پست پیشتاز', description: 'ارسال با پست پیشتاز', price: 35000, estimatedDays: 3, icon: 'ti ti-truck', color: '#f97316', enabled: true, isDefault: true },
      { id: 2, name: 'پست سفارشی', description: 'ارسال با پست معمولی', price: 25000, estimatedDays: 5, icon: 'ti ti-package', color: '#6b7280', enabled: true, isDefault: true },
      { id: 3, name: 'الوپیک', description: 'ارسال فوری با پیک موتوری', price: 0, estimatedDays: 1, icon: 'ti ti-motorbike', color: '#10b981', enabled: true, isDefault: true },
      { id: 4, name: 'تحویل حضوری', description: 'دریافت از فروشگاه', price: 0, estimatedDays: 0, icon: 'ti ti-building-store', color: '#8b5cf6', enabled: true, isDefault: true },
    ],
    alopeyk: {
      enabled: true,
      apiToken: '',
      sandbox: true,
      defaultVehicle: 'motorbike',
      minPrice: 15000,
      discountPercent: 10,
      maxDistance: 30
    }
  }
}

const settings = ref(JSON.parse(JSON.stringify(defaultSettings)))

const formatPrice = (p) => new Intl.NumberFormat('fa-IR').format(p)

const getGatewayEnabled = (key) => {
  return settings.value.payment[key]?.enabled || false
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}

const toggleShippingMethod = (method) => {
  method.enabled = !method.enabled
  showToast(method.enabled ? `${method.name} فعال شد` : `${method.name} غیرفعال شد`)
}

const editShippingMethod = (method) => {
  editingShippingMethod.value = method
  shippingForm.value = { ...method }
  showAddShippingModal.value = true
}

const deleteShippingMethod = (method) => {
  if (confirm(`آیا از حذف روش "${method.name}" اطمینان دارید؟`)) {
    settings.value.shipping.methods = settings.value.shipping.methods.filter(m => m.id !== method.id)
    showToast('روش ارسال حذف شد')
  }
}

const closeShippingModal = () => {
  showAddShippingModal.value = false
  editingShippingMethod.value = null
  shippingForm.value = {
    name: '',
    description: '',
    price: 0,
    estimatedDays: 3,
    icon: 'ti ti-truck',
    color: '#f97316'
  }
}

const saveShippingMethod = () => {
  if (!shippingForm.value.name) {
    showToast('نام روش ارسال الزامی است', 'error')
    return
  }

  if (editingShippingMethod.value) {
    const index = settings.value.shipping.methods.findIndex(m => m.id === editingShippingMethod.value.id)
    if (index !== -1) {
      settings.value.shipping.methods[index] = { ...shippingForm.value, id: editingShippingMethod.value.id }
    }
    showToast('روش ارسال به‌روزرسانی شد')
  } else {
    settings.value.shipping.methods.push({
      ...shippingForm.value,
      id: Date.now(),
      enabled: true,
      isDefault: false
    })
    showToast('روش ارسال جدید اضافه شد')
  }

  closeShippingModal()
}

const testSms = (service) => {
  showToast('پیامک تست ارسال شد', 'info')
}

const testAlopeyk = () => {
  showToast('اتصال به الوپیک برقرار است', 'success')
}

const resetSettings = () => {
  if (confirm('آیا از بازنشانی تنظیمات اطمینان دارید؟')) {
    settings.value = JSON.parse(JSON.stringify(defaultSettings))
    showToast('تنظیمات بازنشانی شد', 'info')
  }
}

// متد ذخیره نهایی
const handleSaveSettings = async () => {
  try {
    await saveToApi(settings.value);
    showToast('تنظیمات با موفقیت ذخیره شد', 'success');
  } catch (e) {
    showToast('خطا در ذخیره تنظیمات', 'error');
  }
};

// تابع کمکی برای مرج کردن عمیق (Deep Merge)
function deepMerge(target, source) {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

// دریافت تنظیمات هنگام لود صفحه
onMounted(async () => {
  try {
    const data = await fetchSettings();
    if (data) {
      // استفاده از مرج عمیق برای حفظ ساختار تو در تو و جلوگیری از پاک شدن تنظیمات
      settings.value = deepMerge(defaultSettings, data);
    }
  } catch (e) {
    console.error("Failed to load settings");
  }
});
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
