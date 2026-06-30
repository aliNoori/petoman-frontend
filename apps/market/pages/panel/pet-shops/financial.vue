<template>
  <div class="space-y-6 pb-20 lg:pb-6">
    <!-- Toast Notification -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-300"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="toast.show"
        :class="[
          'fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-80',
          toast.type === 'success' ? 'bg-blue-400 text-white' :
          toast.type === 'error' ? 'bg-red-600 text-white' :
          'bg-blue-600 text-white'
        ]"
      >
        <i :class="[
          'text-2xl',
          toast.type === 'success' ? 'ti ti-circle-check' :
          toast.type === 'error' ? 'ti ti-circle-x' :
          'ti ti-info-circle'
        ]"></i>
        <span class="text-sm font-medium">{{ toast.message }}</span>
      </div>
    </Transition>

    <!-- Header با آمار کلی -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- موجودی کل -->
      <div class="bg-gradient-to-br from-sky-500 to-sky-400 rounded-xl p-6 text-white">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <i class="ti ti-wallet text-2xl"></i>
          </div>
          <div class="text-left">
            <p class="text-sm opacity-90">موجودی کل</p>
            <p class="text-2xl font-bold font-english">{{ formatNumber(totalBalance) }}</p>
            <p class="text-xs opacity-75">تومان</p>
          </div>
        </div>
        <div class="flex items-center justify-between pt-4 border-t border-white/20">
          <span class="text-xs opacity-90">آخرین بروزرسانی</span>
          <span class="text-xs font-medium">امروز 14:30</span>
        </div>
      </div>

      <!-- قابل برداشت -->
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <i class="ti ti-cash text-2xl text-blue-600"></i>
          </div>
          <div class="text-left">
            <p class="text-sm text-gray-600">قابل برداشت</p>
            <p class="text-2xl font-bold text-gray-900 font-english">{{ formatNumber(withdrawable) }}</p>
            <p class="text-xs text-gray-500">تومان</p>
          </div>
        </div>
        <button 
          @click="showWithdrawModal = true"
          :disabled="withdrawable <= 0"
          class="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <i class="ti ti-plus ml-1"></i>
          درخواست تسویه
        </button>
      </div>

      <!-- کارمزد پلتفرم -->
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
            <i class="ti ti-percentage text-2xl text-purple-600"></i>
          </div>
          <div class="text-left">
            <p class="text-sm text-gray-600">کارمزد پلتفرم</p>
            <p class="text-2xl font-bold text-gray-900 font-english">{{ formatNumber(platformFee) }}</p>
            <p class="text-xs text-gray-500">تومان</p>
          </div>
        </div>
        <div class="flex items-center justify-between pt-4 border-t border-gray-200">
          <span class="text-xs text-gray-600">نرخ کارمزد</span>
          <span class="text-xs font-medium text-purple-600 font-english">{{ feePercentage }}%</span>
        </div>
      </div>

      <!-- در حال تسویه -->
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
            <i class="ti ti-clock text-2xl text-amber-600"></i>
          </div>
          <div class="text-left">
            <p class="text-sm text-gray-600">در حال تسویه</p>
            <p class="text-2xl font-bold text-gray-900 font-english">{{ formatNumber(pending) }}</p>
            <p class="text-xs text-gray-500">تومان</p>
          </div>
        </div>
        <div class="flex items-center justify-between pt-4 border-t border-gray-200">
          <span class="text-xs text-gray-600">تعداد درخواست</span>
          <span class="text-xs font-medium text-amber-600">{{ pendingCount }} مورد</span>
        </div>
      </div>
    </div>

    <!-- تب‌ها -->
    <div class="bg-white rounded-xl border border-gray-200">
      <div class="border-b border-gray-200">
        <div class="flex gap-2 p-2 overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2',
              activeTab === tab.id ? 'bg-blue-50 text-blue-400' : 'text-gray-600 hover:bg-gray-50'
            ]"
          >
            <i :class="tab.icon"></i>
            {{ tab.label }}
            <span v-if="tab.badge" class="px-2 py-0.5 rounded-full bg-blue-400 text-white text-xs">{{ tab.badge }}</span>
          </button>
        </div>
      </div>

      <!-- محتوای تب تراکنش‌ها -->
      <div v-if="activeTab === 'transactions'" class="p-6">
        <!-- فیلترها -->
        <div class="flex flex-col sm:flex-row gap-3 mb-6">
          <div class="flex-1 relative">
            <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="جستجو در تراکنش‌ها..."
              class="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-blue-500"
            />
          </div>
          <div class="w-40">
            <ClientOnly>
            <UiUSelectMenu
              v-model="filterType"
              :options="filterTypeOptions"
              placeholder="فیلتر تراکنش"
            />
            </ClientOnly>
          </div>
        </div>

        <!-- لیست تراکنش‌ها -->
        <div class="space-y-3">
          <div
            v-for="transaction in filteredTransactions"
            :key="transaction.id"
            class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div :class="[
              'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
              transaction.type === 'income' ? 'bg-blue-100' : 'bg-red-100'
            ]">
              <i :class="[
                'text-xl',
                transaction.type === 'income' ? 'ti ti-arrow-down-left text-blue-400' : 'ti ti-percentage text-red-600'
              ]"></i>
            </div>
            
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 mb-1">{{ transaction.title }}</p>
              <p class="text-xs text-gray-600">{{ transaction.description }}</p>
              <div class="flex items-center gap-3 mt-2">
                <span class="text-xs text-gray-500">{{ transaction.date }}</span>
                <span class="text-xs text-gray-500">{{ transaction.time }}</span>
                <span class="text-xs text-gray-500 font-english">{{ transaction.trackingCode }}</span>
              </div>
            </div>
            
            <div class="text-left">
              <p :class="[
                'text-lg font-bold font-english mb-1',
                transaction.type === 'income' ? 'text-blue-400' : 'text-red-600'
              ]">
                {{ transaction.type === 'income' ? '+' : '-' }} {{ formatNumber(transaction.amount) }}
              </p>
              <p class="text-xs text-gray-500">تومان</p>
            </div>
          </div>

          <div v-if="filteredTransactions.length === 0" class="text-center py-12">
            <i class="ti ti-inbox text-5xl text-gray-300 mb-3"></i>
            <p class="text-gray-500">تراکنشی یافت نشد</p>
          </div>
        </div>
      </div>

      <!-- محتوای تب درخواست‌های تسویه -->
      <div v-if="activeTab === 'withdrawals'" class="p-6">
        <div class="space-y-3">
          <div
            v-for="withdrawal in withdrawalRequests"
            :key="withdrawal.id"
            class="p-4 bg-gray-50 rounded-lg"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <i class="ti ti-file-invoice text-xl text-blue-600"></i>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">درخواست تسویه #{{ withdrawal.id }}</p>
                  <p class="text-xs text-gray-600 mt-1">{{ withdrawal.date }} - {{ withdrawal.time }}</p>
                </div>
              </div>
              <span :class="[
                'px-3 py-1 rounded-full text-xs font-medium',
                withdrawal.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                withdrawal.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                withdrawal.status === 'completed' ? 'bg-blue-100 text-blue-500' :
                'bg-red-100 text-red-700'
              ]">
                {{ getWithdrawalStatusLabel(withdrawal.status) }}
              </span>
            </div>
            
            <div class="grid grid-cols-2 gap-4 p-3 bg-white rounded-lg mb-3">
              <div>
                <p class="text-xs text-gray-600 mb-1">مبلغ درخواستی</p>
                <p class="text-base font-bold text-gray-900 font-english">{{ formatNumber(withdrawal.amount) }} تومان</p>
              </div>
              <div>
                <p class="text-xs text-gray-600 mb-1">شماره حساب</p>
                <p class="text-sm font-medium text-gray-900 font-english">{{ withdrawal.accountNumber }}</p>
              </div>
            </div>

            <div v-if="withdrawal.note" class="p-3 bg-blue-50 rounded-lg text-xs text-gray-700">
              <i class="ti ti-info-circle text-blue-600 ml-1"></i>
              {{ withdrawal.note }}
            </div>
          </div>

          <div v-if="withdrawalRequests.length === 0" class="text-center py-12">
            <i class="ti ti-file-x text-5xl text-gray-300 mb-3"></i>
            <p class="text-gray-500">درخواست تسویه‌ای ثبت نشده است</p>
          </div>
        </div>
      </div>

      <!-- محتوای تب اطلاعات بانکی -->
      <div v-if="activeTab === 'bankInfo'" class="p-4 sm:p-6">
        <!-- اطلاعیه -->
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
          <div class="flex items-start gap-2 sm:gap-3">
            <i class="ti ti-info-circle text-blue-600 text-lg sm:text-xl flex-shrink-0 mt-0.5"></i>
            <div class="flex-1">
              <p class="text-xs sm:text-sm font-medium text-blue-900 mb-1">اطلاعات بانکی شما</p>
              <p class="text-xs text-blue-700">اطلاعات بانکی ثبت شده برای تسویه حساب استفاده می‌شود. لطفاً اطلاعات صحیح و کامل وارد کنید.</p>
            </div>
          </div>
        </div>

        <!-- فرم اطلاعات بانکی -->
        <div class="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6">
          <!-- اطلاعات ثبت شده (غیرقابل تغییر) -->
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
            <p class="text-xs font-medium text-gray-500 mb-3">اطلاعات احراز هویت شده (غیرقابل تغییر)</p>
            
            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-500 mb-1.5">
                <i class="ti ti-user text-gray-400 ml-1"></i>
                نام صاحب حساب
              </label>
              <div class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium">
                {{ bankInfo.accountName }}
              </div>
            </div>

            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-500 mb-1.5">
                <i class="ti ti-id text-gray-400 ml-1"></i>
                کد ملی
              </label>
              <div class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-english font-medium">
                {{ bankInfo.nationalCode }}
              </div>
            </div>
          </div>

          <div class="border-t pt-4">
            <div class="flex items-center justify-between mb-4">
              <p class="text-xs font-medium text-gray-500">کارت‌های بانکی</p>
              <span class="text-xs text-gray-500">{{ bankInfo.cards.length }} کارت</span>
            </div>
            
            <!-- دراپ‌داون کارت‌ها -->
            <div v-if="bankInfo.cards.length > 0" class="mb-4 relative">
              <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <i class="ti ti-credit-card text-gray-400 ml-1"></i>
                کارت پیش‌فرض
              </label>
              <button
                @click="showCardsDropdown = !showCardsDropdown"
                class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-blue-500 bg-white flex items-center justify-between"
              >
                <span>{{ getSelectedCardLabel() }}</span>
                <i :class="['ti ti-chevron-down transition-transform', showCardsDropdown ? 'rotate-180' : '']"></i>
              </button>
              
              <Transition name="dropdown">
                <ul v-if="showCardsDropdown" class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <li
                    v-for="card in bankInfo.cards"
                    :key="card.id"
                    @click="selectCard(card.id)"
                    :class="[
                      'px-3 sm:px-4 py-2.5 cursor-pointer hover:bg-blue-50 transition-colors flex items-center justify-between',
                      card.isDefault ? 'bg-blue-50' : ''
                    ]"
                  >
                    <span class="text-sm">{{ card.bankName }} - {{ card.cardNumber }}</span>
                    <i v-if="card.isDefault" class="ti ti-check text-blue-400"></i>
                  </li>
                </ul>
              </Transition>
            </div>

            <!-- فرم افزودن کارت جدید -->
            <div class="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-4 space-y-4">
              <div class="flex items-center gap-2 text-gray-700">
                <i class="ti ti-plus-circle"></i>
                <p class="text-sm font-medium">افزودن کارت جدید</p>
              </div>

            <!-- تب انتخاب ورودی -->
            <div class="flex gap-2 mb-4">
              <button
                @click="newCard.inputType = 'card'"
                :class="[
                  'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  newCard.inputType === 'card' ? 'bg-blue-400 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
              >
                <i class="ti ti-credit-card ml-1"></i>
                شماره کارت
              </button>
              <button
                @click="newCard.inputType = 'iban'"
                :class="[
                  'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  newCard.inputType === 'iban' ? 'bg-blue-400 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
              >
                <i class="ti ti-building ml-1"></i>
                شماره شبا
              </button>
            </div>

            <div v-if="newCard.inputType === 'card'">
              <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <i class="ti ti-credit-card text-gray-400 ml-1"></i>
                شماره کارت
                <span class="text-red-500">*</span>
              </label>
              <input
                v-model="newCard.cardNumber"
                type="text"
                placeholder="0000-0000-0000-0000"
                maxlength="19"
                @input="formatNewCardNumber"
                :disabled="newCard.verifying"
                class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-blue-500 font-english disabled:bg-gray-100"
              />
              <p class="text-xs text-amber-600 mt-1.5 flex items-start gap-1">
                <i class="ti ti-alert-circle mt-0.5 flex-shrink-0"></i>
                <span>کارت باید به نام {{ bankInfo.accountName }} باشد</span>
              </p>
            </div>

            <div v-if="newCard.inputType === 'iban'">
              <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <i class="ti ti-building text-gray-400 ml-1"></i>
                شماره شبا
                <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-english text-sm">IR</span>
                <input
                  v-model="newCard.iban"
                  type="text"
                  placeholder="000000000000000000000000"
                  maxlength="26"
                  :disabled="newCard.verifying"
                  class="w-full pr-9 sm:pr-10 pl-3 sm:pl-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-blue-500 font-english disabled:bg-gray-100"
                />
              </div>
              <p class="text-xs text-gray-500 mt-1">شماره شبا را بدون IR وارد کنید</p>
            </div>

            <!-- خطای استعلام -->
            <div v-if="newCard.error" class="bg-red-50 border border-red-200 rounded-lg p-3">
              <div class="flex items-start gap-2">
                <i class="ti ti-alert-circle text-red-600 flex-shrink-0 mt-0.5"></i>
                <p class="text-sm text-red-900">{{ newCard.error }}</p>
              </div>
            </div>

            <!-- در حال استعلام -->
            <div v-if="newCard.verifying" class="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div class="flex items-center gap-3">
                <div class="animate-spin">
                  <i class="ti ti-loader text-amber-600 text-xl"></i>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-amber-900">در حال استعلام از بانک...</p>
                  <p class="text-xs text-amber-700 mt-0.5">لطفاً منتظر بمانید</p>
                </div>
              </div>
            </div>

            <!-- دکمه‌های عملیات -->
            <div class="flex gap-2 pt-2">
              <button
                @click="addCard"
                :disabled="!canAddCard || newCard.verifying"
                class="flex-1 px-4 py-2.5 bg-blue-400 text-white rounded-lg font-medium hover:bg-blue-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                <i class="ti ti-plus"></i>
                افزودن کارت
              </button>

              <button
                @click="resetNewCard"
                class="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors text-sm"
              >
                <i class="ti ti-x"></i>
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- مودال درخواست تسویه -->
    <Transition name="fade">
      <div v-if="showWithdrawModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showWithdrawModal = false">
        <div class="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-bold text-gray-900">درخواست تسویه حساب</h3>
              <button @click="showWithdrawModal = false" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <i class="ti ti-x text-xl text-gray-600"></i>
              </button>
            </div>
          </div>

          <div class="p-6 space-y-4">
            <!-- موجودی قابل برداشت -->
            <div class="bg-blue-50 border border-emerald-200 rounded-xl p-4">
              <p class="text-sm text-gray-600 mb-2">موجودی قابل برداشت</p>
              <p class="text-2xl font-bold text-blue-400 font-english">{{ formatNumber(withdrawable) }} تومان</p>
            </div>

            <!-- مبلغ درخواستی -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">مبلغ درخواستی (تومان)</label>
              <input
                v-model="withdrawAmount"
                type="text"
                @input="formatWithdrawAmount"
                placeholder="0"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-blue-500 font-english text-lg"
              />
              <p class="text-xs text-gray-500 mt-2">
                حداقل مبلغ: {{ formatNumber(minWithdraw) }} تومان
              </p>
            </div>

            <!-- انتخاب کارت بانکی -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <i class="ti ti-credit-card text-gray-400 ml-1"></i>
                انتخاب کارت مقصد
                <span class="text-red-500">*</span>
              </label>
              
              <div v-if="bankInfo.cards.length === 0" class="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                <i class="ti ti-alert-circle text-amber-600 text-2xl mb-2"></i>
                <p class="text-sm text-amber-900 font-medium mb-1">هیچ کارت بانکی ثبت نشده است</p>
                <p class="text-xs text-amber-700 mb-3">ابتدا از بخش "اطلاعات بانکی" یک کارت اضافه کنید</p>
                <button
                  @click="showWithdrawModal = false; activeTab = 'bankInfo'"
                  class="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
                >
                  <i class="ti ti-plus ml-1"></i>
                  افزودن کارت بانکی
                </button>
              </div>

              <div v-else class="space-y-2">
                <label
                  v-for="card in bankInfo.cards"
                  :key="card.id"
                  class="flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50"
                  :class="withdrawForm.selectedCardId === card.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'"
                >
                  <input
                    type="radio"
                    :value="card.id"
                    v-model="withdrawForm.selectedCardId"
                    class="mt-1"
                  />
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <i class="ti ti-building-bank text-gray-600"></i>
                      <p class="font-medium text-sm text-gray-900">{{ card.bankName }}</p>
                      <span v-if="card.isDefault" class="text-xs bg-blue-100 text-blue-500 px-2 py-0.5 rounded-full">پیش‌فرض</span>
                    </div>
                    <p class="text-xs text-gray-600 font-english mb-0.5">{{ card.cardNumber }}</p>
                    <p class="text-xs text-gray-500 font-english">IR{{ card.iban }}</p>
                  </div>
                </label>
              </div>
            </div>

            <!-- توضیحات -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">توضیحات (اختیاری)</label>
              <textarea
                v-model="withdrawForm.note"
                rows="3"
                placeholder="توضیحات اضافی..."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-blue-500 resize-none"
              ></textarea>
            </div>

            <!-- اطلاع‌رسانی -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-gray-700">
              <i class="ti ti-info-circle text-blue-600 ml-1"></i>
              درخواست شما پس از بررسی توسط تیم مالی، حداکثر طی 48 ساعت کاری پردازش خواهد شد.
            </div>
          </div>

          <div class="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
            <button
              @click="showWithdrawModal = false"
              class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              انصراف
            </button>
            <button
              @click="submitWithdrawRequest"
              :disabled="!canSubmitWithdraw"
              class="flex-1 px-4 py-3 bg-blue-400 text-white rounded-lg font-medium hover:bg-blue-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              ثبت درخواست
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'pet-shop'
})

const activeTab = ref('transactions')
const showWithdrawModal = ref(false)
const searchQuery = ref('')
const filterType = ref('all')

// Filter Options
const filterTypeOptions = [
  { value: 'all', label: 'همه تراکنش‌ها', icon: 'ti ti-list' },
  { value: 'income', label: 'واریزی‌ها', icon: 'ti ti-arrow-down-left' },
  { value: 'fee', label: 'کارمزدها', icon: 'ti ti-percentage' },
]
const selectedCardForView = ref(null)
const showCardsDropdown = ref(false)

const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

const withdrawForm = ref({
  selectedCardId: null,
  note: ''
})

const bankInfo = ref({
  accountName: 'پت مارکت مرکزی پتومن',
  nationalCode: '0123456789',
  cards: [
    {
      id: 1,
      cardNumber: '6037-9971-2345-6789',
      iban: '120170000000012345678901',
      bankName: 'بانک ملی ایران',
      isDefault: true,
      verified: true
    }
  ]
})

const newCard = ref({
  inputType: 'card',
  cardNumber: '',
  iban: '',
  detectedBank: '',
  verifying: false,
  error: ''
})

const withdrawAmount = ref('')
const minWithdraw = 100000

const totalBalance = ref(5750000)
const withdrawable = ref(3500000)
const pending = ref(2250000)
const pendingCount = ref(2)
const platformFee = ref(575000)
const feePercentage = ref(10)

const tabs = [
  { id: 'transactions', label: 'تراکنش‌ها', icon: 'ti ti-list' },
  { id: 'withdrawals', label: 'درخواست‌های تسویه', icon: 'ti ti-file-invoice', badge: pendingCount.value },
  { id: 'bankInfo', label: 'اطلاعات بانکی', icon: 'ti ti-building-bank' }
]

const transactions = ref([
  {
    id: 1,
    type: 'income',
    title: 'واریز از پلتفرم پتومن',
    description: 'تسویه سفارشات هفته سوم',
    amount: 2500000,
    date: '1403/07/29',
    time: '14:30',
    trackingCode: 'PTF1403072901'
  },
  {
    id: 2,
    type: 'income',
    title: 'واریز از پلتفرم پتومن',
    description: 'تسویه سفارشات هفته دوم',
    amount: 3200000,
    date: '1403/07/26',
    time: '12:15',
    trackingCode: 'PTF1403072602'
  },
  {
    id: 3,
    type: 'fee',
    title: 'کسر کارمزد پلتفرم',
    description: 'کارمزد 10% از درآمد هفته دوم',
    amount: 320000,
    date: '1403/07/26',
    time: '12:20',
    trackingCode: 'FEE1403072603'
  }
])

const withdrawalRequests = ref([
  {
    id: 1001,
    amount: 2000000,
    accountNumber: 'IR750170000000123456789012',
    status: 'processing',
    date: '1403/07/29',
    time: '10:00',
    note: 'در حال بررسی توسط واحد مالی'
  },
  {
    id: 1002,
    amount: 250000,
    accountNumber: 'IR750170000000123456789012',
    status: 'pending',
    date: '1403/07/28',
    time: '14:30',
    note: 'در صف پردازش'
  }
])

const filteredTransactions = computed(() => {
  let result = transactions.value

  if (filterType.value !== 'all') {
    result = result.filter(t => t.type === filterType.value)
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.trackingCode.toLowerCase().includes(q)
    )
  }

  return result
})

const canSubmitWithdraw = computed(() => {
  const amount = parseNumber(withdrawAmount.value)
  return amount >= minWithdraw &&
    amount <= withdrawable.value &&
    withdrawForm.value.selectedCardId !== null
})

const canAddCard = computed(() => {
  if (newCard.value.inputType === 'card') {
    return newCard.value.cardNumber.replace(/-/g, '').length === 16 &&
      !newCard.value.verifying
  } else {
    return newCard.value.iban.length === 26 &&
      !newCard.value.verifying
  }
})

const formatNumber = (num) => {
  return new Intl.NumberFormat('fa-IR').format(num)
}

const parseNumber = (str) => {
  return parseInt(str.replace(/,/g, '')) || 0
}

const formatWithdrawAmount = (e) => {
  let value = e.target.value.replace(/,/g, '')
  if (value && !isNaN(value)) {
    withdrawAmount.value = formatNumber(parseInt(value))
  }
}

const getWithdrawalStatusLabel = (status) => {
  const labels = {
    'pending': 'در انتظار',
    'processing': 'در حال پردازش',
    'completed': 'تکمیل شده',
    'rejected': 'رد شده'
  }
  return labels[status] || status
}

const showToast = (message, type = 'success') => {
  toast.value.show = true
  toast.value.message = message
  toast.value.type = type
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

const formatNewCardNumber = (e) => {
  let value = e.target.value.replace(/\D/g, '')
  if (value.length > 16) value = value.substring(0, 16)
  
  const formatted = value.match(/.{1,4}/g)?.join('-') || value
  newCard.value.cardNumber = formatted
  newCard.value.error = ''
  
  if (value.length >= 6) {
    detectBankFromCard(value.substring(0, 6))
  } else {
    newCard.value.detectedBank = ''
  }
}

const detectBankFromCard = async (bin) => {
  const bankBINs = {
    '603799': 'بانک ملی ایران',
    '627961': 'بانک صنعت و معدن',
    '627353': 'بانک تجارت',
    '639607': 'بانک صنعت و معدن',
    '627412': 'بانک اقتصاد نوین',
    '622106': 'بانک پارسیان',
    '639347': 'بانک پاسارگاد',
    '627488': 'بانک کارآفرین',
    '621986': 'بانک سامان',
    '639346': 'بانک سینا'
  }
  
  newCard.value.detectedBank = bankBINs[bin] || ''
}

const addCard = async () => {
  newCard.value.error = ''
  newCard.value.verifying = true
  
  // شبیه‌سازی استعلام از بانک
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  newCard.value.verifying = false
  
  // چک کردن تکراری بودن
  const cardExists = bankInfo.value.cards.some(card => 
    card.cardNumber === newCard.value.cardNumber || 
    card.iban === newCard.value.iban
  )
  
  if (cardExists) {
    newCard.value.error = 'این کارت یا شبا قبلاً ثبت شده است'
    return
  }
  
  // اگر شماره کارت وارد نشده، از شبا استفاده کن
  const finalCardNumber = newCard.value.cardNumber || 'IR' + newCard.value.iban.substring(0, 6) + '...'
  const finalBankName = newCard.value.detectedBank || 'بانک'
  
  const newCardData = {
    id: Date.now(),
    cardNumber: finalCardNumber,
    iban: newCard.value.iban,
    bankName: finalBankName,
    isDefault: bankInfo.value.cards.length === 0,
    verified: true
  }
  
  bankInfo.value.cards.push(newCardData)
  showToast('کارت ذخیره شد', 'success')
  
  // تنظیم کارت جدید به عنوان انتخاب شده در دراپ‌داون
  if (bankInfo.value.cards.length === 1) {
    selectedCardForView.value = newCardData.id
  }
  
  resetNewCard()
}

const resetNewCard = () => {
  newCard.value = {
    inputType: 'card',
    cardNumber: '',
    iban: '',
    detectedBank: '',
    verifying: false,
    error: ''
  }
}

const setDefaultCard = (cardId) => {
  bankInfo.value.cards.forEach(card => {
    card.isDefault = card.id === cardId
  })
  selectedCardForView.value = cardId
  showToast('کارت پیش‌فرض تغییر کرد', 'success')
}

const selectCard = (cardId) => {
  setDefaultCard(cardId)
  showCardsDropdown.value = false
}

const getSelectedCardLabel = () => {
  const card = bankInfo.value.cards.find(c => c.isDefault)
  return card ? `${card.bankName} - ${card.cardNumber}` : 'انتخاب کارت'
}

const removeCard = (cardId) => {
  if (bankInfo.value.cards.length === 1) {
    showToast('حداقل یک کارت باید وجود داشته باشد', 'error')
    return
  }
  
  const index = bankInfo.value.cards.findIndex(c => c.id === cardId)
  const wasDefault = bankInfo.value.cards[index].isDefault
  
  bankInfo.value.cards.splice(index, 1)
  
  if (wasDefault && bankInfo.value.cards.length > 0) {
    bankInfo.value.cards[0].isDefault = true
    selectedCardForView.value = bankInfo.value.cards[0].id
  }
  
  showToast('کارت حذف شد', 'info')
}

// مقداردهی اولیه کارت پیش‌فرض
onMounted(() => {
  const defaultCard = bankInfo.value.cards.find(c => c.isDefault)
  if (defaultCard) {
    selectedCardForView.value = defaultCard.id
  }
})

const submitWithdrawRequest = () => {
  const amount = parseNumber(withdrawAmount.value)
  
  if (amount < minWithdraw) {
    showToast('مبلغ درخواستی کمتر از حداقل مجاز است', 'error')
    return
  }
  
  if (amount > withdrawable.value) {
    showToast('مبلغ درخواستی بیشتر از موجودی قابل برداشت است', 'error')
    return
  }

  if (!withdrawForm.value.selectedCardId) {
    showToast('لطفاً یک کارت بانکی انتخاب کنید', 'error')
    return
  }

  const selectedCard = bankInfo.value.cards.find(c => c.id === withdrawForm.value.selectedCardId)
  
  if (!selectedCard) {
    showToast('کارت انتخابی یافت نشد', 'error')
    return
  }

  const newRequest = {
    id: 1000 + withdrawalRequests.value.length + 1,
    amount: amount,
    accountNumber: `IR${selectedCard.iban}`,
    cardNumber: selectedCard.cardNumber,
    bankName: selectedCard.bankName,
    status: 'pending',
    date: '1403/07/29',
    time: '15:00',
    note: withdrawForm.value.note || 'در صف پردازش'
  }

  withdrawalRequests.value.unshift(newRequest)
  pending.value += amount
  withdrawable.value -= amount
  pendingCount.value++

  
  showToast('درخواست تسویه ثبت شد', 'success')
  showWithdrawModal.value = false
  
  withdrawAmount.value = ''
  withdrawForm.value = {
    selectedCardId: null,
    note: ''
  }
  
  activeTab.value = 'withdrawals'
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>




