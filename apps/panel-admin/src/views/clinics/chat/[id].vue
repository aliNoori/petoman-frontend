<template>
  <div class="flex flex-col h-full bg-white overflow-hidden">
    <!-- هدر چت -->
    <div class="shrink-0 bg-white border-b border-gray-200 px-3 py-2 sm:px-4 sm:py-3 z-10">
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- دکمه منو در موبایل -->
        <button @click="toggleSidebar" class="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors -ml-1">
          <i class="ti ti-menu-2 text-xl text-gray-600"></i>
        </button>

        <!-- دکمه برگشت در دسکتاپ -->
        <button @click="goBack" class="hidden lg:flex p-2 hover:bg-gray-100 rounded-lg transition-colors -ml-1">
          <i class="ti ti-arrow-right text-xl text-gray-600"></i>
        </button>

        <!-- آواتار بیمار -->
        <div class="relative shrink-0">
          <img :src="resolveUrl(chatInfo.customerAvatar)" :alt="chatInfo.customerName"
               class="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl object-cover border border-gray-100">
          <span :class="[
            'absolute -bottom-0.5 -left-0.5 w-3 h-3 lg:w-4 lg:h-4 rounded-full border-2 border-white',
            chatInfo.customerOnline ? 'bg-green-500' : 'bg-gray-300'
          ]"></span>
        </div>

        <!-- اطلاعات کاربر -->
        <div class="flex-1 min-w-0 pr-1">
          <div class="flex items-center gap-2">
            <h3 class="font-bold text-gray-900 text-sm sm:text-base truncate">{{ chatInfo.customerName }}</h3>
            <span v-if="isTyping" class="text-xs text-sky-600 hidden sm:inline animate-pulse">در حال تایپ...</span>
          </div>
          <p class="text-[10px] sm:text-xs lg:text-sm text-gray-500 truncate">
            {{ chatInfo.petType }} - {{ chatInfo.petName }}
          </p>
        </div>

        <!-- دکمه‌های سمت چپ هدر -->
        <div class="flex items-center gap-1 lg:gap-2 shrink-0">
          <!-- وضعیت اتصال -->
          <div class="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-50 border border-gray-100">
            <span class="w-2 h-2 rounded-full" :class="isConnected ? 'bg-green-500' : 'bg-red-500'"></span>
            <span class="text-[10px] text-gray-600">{{ isConnected ? 'متصل' : 'قطع' }}</span>
          </div>

          <!-- وضعیت چت -->
          <div v-if="chatInfo.status === 'pending'"
               class="hidden sm:flex items-center gap-1 px-2 lg:px-3 py-1 rounded-lg bg-orange-100 text-orange-700 border border-orange-200">
            <i class="ti ti-clock text-xs lg:text-sm"></i>
            <span class="text-[10px] lg:text-xs font-medium">در انتظار تایید</span>
          </div>
          <div v-else-if="chatInfo.status === 'active'"
               class="hidden sm:flex items-center gap-1 px-2 lg:px-3 py-1 rounded-lg bg-green-100 text-green-700 border border-green-200">
            <i class="ti ti-message text-xs lg:text-sm"></i>
            <span class="text-[10px] lg:text-xs font-medium">فعال</span>
          </div>
          <div v-else-if="chatInfo.status === 'closed'"
               class="hidden sm:flex items-center gap-1 px-2 lg:px-3 py-1 rounded-lg bg-gray-200 text-gray-600 border border-gray-300">
            <i class="ti ti-lock text-xs lg:text-sm"></i>
            <span class="text-[10px] lg:text-xs font-medium">بسته شده</span>
          </div>

          <!-- منوی بیشتر -->
          <div class="relative">
            <button @click="showMenu = !showMenu"
                    class="p-2 hover:bg-gray-100 rounded-lg transition-colors -mr-1">
              <i class="ti ti-dots-vertical text-gray-600"></i>
            </button>

            <!-- منوی کشویی ریسپانسیو -->
            <Transition name="dropdown">
              <div v-if="showMenu"
                   class="fixed inset-x-4 bottom-20 top-auto z-50 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden sm:absolute sm:left-0 sm:top-full sm:mt-2 sm:w-56 sm:inset-auto sm:bottom-auto sm:shadow-lg">

                <div class="p-1 space-y-1">
                  <button @click="viewPatientProfile"
                          class="w-full flex items-center gap-3 px-3 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <i class="ti ti-user w-5 text-center"></i>
                    پروفایل بیمار
                  </button>
                  <button @click="viewPetProfile"
                          class="w-full flex items-center gap-3 px-3 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <i class="ti ti-paw w-5 text-center"></i>
                    پرونده حیوان
                  </button>

                  <div class="h-px bg-gray-100 my-1"></div>

                  <button v-if="chatInfo.status === 'pending'" @click="acceptChat"
                          class="w-full flex items-center gap-3 px-3 py-3 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <i class="ti ti-check w-5 text-center"></i>
                    تایید و شروع گفتگو
                  </button>
                  <button v-if="chatInfo.status === 'active'" @click="showCloseModal = true"
                          class="w-full flex items-center gap-3 px-3 py-3 text-sm text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
                    <i class="ti ti-check w-5 text-center"></i>
                    بستن گفتگو
                  </button>
                  <button @click="showBlockModal = true"
                          class="w-full flex items-center gap-3 px-3 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <i class="ti ti-ban w-5 text-center"></i>
                    مسدود کردن
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>

    <!-- بنر در انتظار تایید -->
    <div v-if="chatInfo.status === 'pending'" class="bg-orange-50 border-b border-orange-200 px-3 py-2 sm:px-4 sm:py-3">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <i class="ti ti-clock-hour-4 text-orange-600"></i>
          <span class="text-xs sm:text-sm text-orange-700">این گفتگو در انتظار تایید شماست</span>
        </div>
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <button @click="rejectChat"
                  class="flex-1 sm:flex-none px-3 py-1.5 text-xs sm:text-sm text-orange-700 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200">
            رد
          </button>
          <button @click="acceptChat"
                  class="flex-1 sm:flex-none px-4 py-1.5 text-xs sm:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm">
            <i class="ti ti-check ml-1"></i>
            تایید
          </button>
        </div>
      </div>
    </div>

    <!-- لیست پیام‌ها -->
    <div ref="messagesContainer"
         class="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gradient-to-b from-gray-50 to-gray-100"
         @scroll="handleScroll">

      <!-- لودینگ -->
      <div v-if="loadingOlder" class="flex justify-center py-4">
        <div class="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- بنر امنیت -->
      <div class="text-center py-2 sm:py-4">
        <div
            class="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm text-xs sm:text-sm text-gray-500 border border-gray-200">
          <i class="ti ti-lock text-green-600"></i>
          <span>این گفتگو رمزگذاری شده است</span>
        </div>
      </div>

      <TransitionGroup name="message">
        <div v-for="message in messages" :key="message.id" class="flex"
             :class="[message.sender === 'doctor' ? 'justify-start' : '', message.sender === 'customer' ? 'justify-end' : '', message.sender === 'system' ? 'justify-center' : '']">

          <!-- پیام سیستمی -->
          <div v-if="message.sender === 'system'" class="w-full sm:max-w-[90%] lg:max-w-[70%]">
            <div class="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-2xl px-4 py-3 shadow-sm">
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
                  <i class="ti ti-info-circle text-sky-600 text-lg sm:text-xl"></i>
                </div>
                <div>
                  <p class="text-xs sm:text-sm text-sky-800 leading-relaxed">{{ message.text }}</p>
                  <span class="text-[10px] text-sky-400 mt-1 block">{{ message.time }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- پیام دکتر -->
          <div v-else-if="message.sender === 'doctor'" class="max-w-[85%] sm:max-w-[75%] lg:max-w-[70%] group">
            <div class="bg-sky-600 text-white rounded-2xl rounded-br-sm px-3 py-2 sm:px-4 sm:py-3 shadow-sm">
              <!-- متن -->
              <p v-if="message.type === 'text'" class="text-xs sm:text-sm leading-relaxed break-words">{{
                  message.text
                }}</p>

              <!-- تصویر -->
              <div v-else-if="message.type === 'image'" class="relative rounded-lg overflow-hidden">
                <img :src="resolveUrl(message.imageUrl)"
                     class="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90"/>
                <button
                    class="absolute top-2 left-2 p-1.5 bg-black/50 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <i class="ti ti-download text-sm"></i>
                </button>
              </div>

              <!-- فایل -->
              <div v-else-if="message.type === 'file'" class="flex items-center gap-3 bg-white/10 rounded-lg p-2">
                <i class="ti ti-file text-2xl"></i>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium truncate">{{ message.fileName }}</p>
                  <p class="text-xs text-sky-200">{{ message.fileSize }}</p>
                </div>
                <button class="p-2 hover:bg-white/10 rounded-lg">
                  <i class="ti ti-download"></i>
                </button>
              </div>

              <!-- نسخه -->
              <div v-else-if="message.type === 'prescription'" class="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <div class="flex items-center gap-2 mb-3 border-b border-white/20 pb-2">
                  <i class="ti ti-prescription text-lg text-emerald-300"></i>
                  <span class="text-sm font-bold text-white">نسخه تجویزی</span>
                </div>
                <div v-if="message.prescription && message.prescription.medications" class="space-y-3">
                  <div v-for="(med, index) in message.prescription.medications" :key="index"
                       class="bg-white/5 rounded-lg p-2 border border-white/10">
                    <div class="flex items-center gap-2 mb-1">
                      <i class="ti ti-pill text-xs text-emerald-400"></i>
                      <span class="text-sm font-bold text-white">{{ med.name }}</span>
                    </div>
                    <div class="grid grid-cols-2 gap-2 text-xs text-sky-100">
                      <div class="flex items-center gap-1">
                        <span class="opacity-70">دوز:</span> <span>{{ med.dosage }}</span>
                      </div>
                      <div class="flex items-center gap-1">
                        <span class="opacity-70">مدت:</span> <span>{{ med.duration }}</span>
                      </div>
                    </div>
                    <div v-if="med.instructions" class="mt-2 pt-2 border-t border-white/10 text-xs text-sky-200 italic">
                      <i class="ti ti-info-circle mr-1"></i> {{ med.instructions }}
                    </div>
                  </div>
                </div>
                <div v-if="message.prescription && message.prescription.notes"
                     class="mt-3 pt-3 border-t border-white/20">
                  <div class="flex items-start gap-2">
                    <i class="ti ti-note text-xs text-yellow-300 mt-0.5"></i>
                    <div>
                      <span class="text-xs font-bold text-yellow-200 block mb-1">توصیه‌ها:</span>
                      <p class="text-xs text-sky-100 leading-relaxed">{{ message.prescription.notes }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-1 mt-1 px-1">
              <span class="text-[10px] sm:text-xs text-gray-400">{{ message.time }}</span>
              <i v-if="message.status === 'sent'" class="ti ti-check text-gray-400 text-xs"></i>
              <i v-else-if="message.status === 'delivered'" class="ti ti-checks text-gray-400 text-xs"></i>
              <i v-else-if="message.status === 'read' || message.status === 'seen'"
                 class="ti ti-checks text-sky-500 text-xs"></i>
            </div>
          </div>

          <!-- پیام مشتری -->
          <div v-else class="max-w-[85%] sm:max-w-[75%] lg:max-w-[70%] group">
            <div class="bg-white text-gray-900 rounded-2xl rounded-bl-sm px-3 py-2 sm:px-4 sm:py-3 shadow-sm">
              <p v-if="message.type === 'text'" class="text-xs sm:text-sm leading-relaxed break-words">{{
                  message.text
                }}</p>
              <div v-else-if="message.type === 'image'" class="relative">
                <img :src="resolveUrl(message.imageUrl)"
                     class="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90"
                     @click="openImagePreview(message.imageUrl)"/>
              </div>
              <div v-else-if="message.type === 'file'" class="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                <i class="ti ti-file text-2xl text-gray-600"></i>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium truncate">{{ message.fileName }}</p>
                  <p class="text-xs text-gray-500">{{ message.fileSize }}</p>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-1 mt-1 px-1 justify-end">
              <span class="text-[10px] sm:text-xs text-gray-400">{{ message.time }}</span>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <!-- تایپ کردن -->
      <div v-if="isTyping" class="flex justify-end">
        <div class="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
          <div class="flex items-center gap-1">
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- وضعیت بسته بودن چت -->
    <div v-if="chatInfo.status === 'closed'" class="bg-gray-100 border-t border-gray-200 px-4 py-6">
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-right">
        <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
          <i class="ti ti-lock text-gray-500 text-xl"></i>
        </div>
        <div>
          <p class="text-sm text-gray-700 font-medium">این گفتگو پایان یافته است</p>
          <p class="text-xs text-gray-500 mt-1">{{ chatInfo.closedAt }} - امکان ارسال پیام وجود ندارد</p>
        </div>
      </div>
    </div>

    <!-- ورودی پیام -->
    <div v-else-if="chatInfo.status === 'active'" class="bg-white border-t border-gray-200 p-2 sm:p-4 shrink-0">
      <!-- پیش‌نمایش فایل -->
      <div v-if="attachedFile"
           class="mb-3 p-2 sm:p-3 bg-gray-50 rounded-xl flex items-center gap-3 border border-gray-200">
        <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-sky-100 flex items-center justify-center shrink-0">
          <i :class="['ti text-xl sm:text-2xl text-sky-600', attachedFile.type.startsWith('image/') ? 'ti-photo' : 'ti-file']"></i>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs sm:text-sm font-medium text-gray-900 truncate">{{ attachedFile.name }}</p>
          <p class="text-[10px] sm:text-xs text-gray-500">{{ formatFileSize(attachedFile.size) }}</p>
        </div>
        <button @click="attachedFile = null" class="p-1.5 sm:p-2 hover:bg-gray-200 rounded-lg text-gray-500 shrink-0">
          <i class="ti ti-x"></i>
        </button>
      </div>

      <div class="flex items-end gap-2 sm:gap-3">
        <!-- دکمه پیوست -->
        <div class="relative shrink-0">
          <input type="file" ref="fileInput" @change="handleFileSelect" class="hidden" accept="image/*,.pdf,.doc,.docx">
          <button @click="$refs.fileInput.click()"
                  class="p-2.5 sm:p-3 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors">
            <i class="ti ti-paperclip text-xl"></i>
          </button>
        </div>

        <!-- دکمه نسخه (فقط دسکتاپ/تبلت بزرگ) -->
        <button @click="showPrescriptionModal = true"
                class="hidden sm:flex p-2.5 sm:p-3 hover:bg-gray-100 rounded-xl text-emerald-600 transition-colors shrink-0 items-center gap-2">
          <i class="ti ti-prescription text-xl"></i>
          <span class="text-xs font-medium hidden lg:inline">نسخه</span>
        </button>
        <!-- دکمه نسخه موبایل (آیکون ساده) -->
        <button @click="showPrescriptionModal = true"
                class="sm:hidden p-2.5 hover:bg-gray-100 rounded-xl text-emerald-600 transition-colors shrink-0">
          <i class="ti ti-prescription text-xl"></i>
        </button>

        <!-- ورودی متن -->
        <div class="flex-1 relative">
          <input v-model="newMessage" type="text" placeholder="پیام خود را بنویسید..."
                 class="w-full px-4 py-2.5 sm:py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                 @keyup.enter="sendMessage" @input="handleTyping"/>
        </div>

        <!-- دکمه ارسال -->
        <button @click="sendMessage"
                class="p-2.5 sm:p-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-md shadow-sky-200">
          <i class="ti ti-send text-xl"></i>
        </button>
      </div>
    </div>

    <!-- مودال بستن گفتگو -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showCloseModal"
             class="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
             @click.self="showCloseModal = false">
          <div
              class="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md h-[90vh] sm:h-auto max-h-[90vh] overflow-y-auto p-5 sm:p-6 flex flex-col">
            <div class="flex items-center justify-between mb-4 shrink-0">
              <h3 class="text-lg sm:text-xl font-bold text-gray-900">بستن گفتگو</h3>
              <button @click="showCloseModal = false" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <i class="ti ti-x text-gray-500"></i>
              </button>
            </div>

            <div class="flex-1 overflow-y-auto space-y-4 mb-6">
              <!-- امتیاز -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-3">
                  <i class="ti ti-star ml-1"></i> امتیاز به مشتری
                </label>
                <div class="flex items-center justify-center gap-2 sm:gap-3 bg-gray-50 rounded-lg p-4">
                  <button v-for="star in 5" :key="star" @click="customerRating = star"
                          class="transition-all transform hover:scale-110">
                    <i :class="[
                      'ti text-3xl sm:text-4xl transition-colors',
                      star <= customerRating ? 'ti-star-filled text-yellow-400' : 'ti-star text-gray-300'
                    ]"></i>
                  </button>
                </div>
                <p class="text-center text-xs sm:text-sm text-gray-500 mt-2">{{ ratingText }}</p>
              </div>

              <!-- نظرات -->
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">نظر درباره مشتری (اختیاری)</label>
                  <textarea v-model="customerReview"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none text-sm"
                            rows="2" placeholder="رفتار مشتری..."></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">یادداشت درمان</label>
                  <textarea v-model="closeNote"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none text-sm"
                            rows="3" placeholder="نتیجه گفتگو..."></textarea>
                </div>
              </div>
            </div>

            <div class="flex gap-3 shrink-0">
              <button @click="closeChat" :disabled="closingChat"
                      class="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-medium disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base">
                <i class="ti ti-check ml-2"></i>
                {{ closingChat ? 'در حال بستن...' : 'بستن گفتگو' }}
              </button>
              <button @click="showCloseModal = false"
                      class="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium text-sm sm:text-base">
                انصراف
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- مودال مسدود کردن -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showBlockModal"
             class="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
             @click.self="showBlockModal = false">
          <div
              class="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md h-[90vh] sm:h-auto max-h-[90vh] overflow-y-auto p-5 sm:p-6 flex flex-col">
            <div class="flex items-center justify-between mb-4 shrink-0">
              <h3 class="text-lg sm:text-xl font-bold text-gray-900">مسدود کردن کاربر</h3>
              <button @click="showBlockModal = false" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <i class="ti ti-x text-gray-500"></i>
              </button>
            </div>

            <div class="flex-1 overflow-y-auto space-y-4 mb-6">
              <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-2">
                <div class="flex items-center mb-2">
                  <i class="ti ti-alert-triangle text-red-600 text-xl ml-2"></i>
                  <p class="font-semibold text-red-900">هشدار</p>
                </div>
                <p class="text-xs sm:text-sm text-red-800">
                  این کاربر دیگر نمی‌تواند با شما ارتباط برقرار کند یا نوبت بگیرد.
                </p>
              </div>

              <div class="bg-gray-50 rounded-lg p-3 mb-2">
                <p class="text-xs sm:text-sm text-gray-700">
                  <strong>کاربر:</strong> {{ chatInfo.customerName }}<br>
                  <strong>حیوان:</strong> {{ chatInfo.petType }} - {{ chatInfo.petName }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  دلیل مسدود کردن <span class="text-red-500">*</span>
                </label>
                <textarea v-model="blockReason"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none text-sm"
                          rows="3" placeholder="دلیل مسدود کردن..."></textarea>
              </div>
            </div>

            <div class="flex gap-3 shrink-0">
              <button @click="blockUser" :disabled="!blockReason.trim() || blockingUser"
                      class="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-medium disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base">
                <i class="ti ti-ban ml-2"></i>
                {{ blockingUser ? 'در حال مسدود کردن...' : 'مسدود کردن' }}
              </button>
              <button @click="showBlockModal = false"
                      class="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium text-sm sm:text-base">
                انصراف
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- مودال نسخه -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showPrescriptionModal"
             class="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
             @click.self="showPrescriptionModal = false">
          <div
              class="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg h-[95vh] sm:h-auto max-h-[90vh] overflow-y-auto p-4 sm:p-6 flex flex-col">
            <div class="flex items-center justify-between mb-4 shrink-0">
              <h3 class="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                <i class="ti ti-prescription text-emerald-600"></i>
                تجویز نسخه
              </h3>
              <button @click="showPrescriptionModal = false" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <i class="ti ti-x text-gray-500"></i>
              </button>
            </div>

            <div class="flex-1 overflow-y-auto space-y-4 mb-6 pr-1">
              <div v-for="(med, index) in prescription.medications" :key="index"
                   class="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div class="flex items-start gap-2">
                  <div class="flex-1 space-y-2">
                    <!-- انتخاب دارو -->
                    <div class="relative w-full">
                      <div @click="med.isOpen = !med.isOpen"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer flex items-center gap-2 hover:border-emerald-500 transition-colors"
                           :class="{'border-emerald-500 ring-1 ring-emerald-500': med.isOpen}">
                        <img v-if="med.selectedMedicine && med.selectedMedicine.image" :src="med.selectedMedicine.image"
                             class="w-6 h-6 rounded object-cover border border-gray-200" alt="drug">
                        <i v-else class="ti ti-search text-gray-400"></i>
                        <span class="flex-1 truncate"
                              :class="!med.selectedMedicine ? 'text-gray-400' : 'text-gray-800 font-medium'">
                          {{ med.selectedMedicine ? med.selectedMedicine.name : 'جستجو و انتخاب دارو...' }}
                        </span>
                        <i class="ti" :class="med.isOpen ? 'ti-chevron-up' : 'ti-chevron-down'"></i>
                      </div>

                      <!-- لیست جستجو -->
                      <div v-if="med.isOpen"
                           class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-hidden flex flex-col">
                        <div class="p-2 border-b border-gray-100 bg-gray-50">
                          <div class="relative">
                            <i class="ti ti-search absolute right-3 top-2.5 text-gray-400"></i>
                            <input v-model="med.searchQuery" @click.stop type="text"
                                   placeholder="نام یا کد دارو..."
                                   class="w-full pr-8 pl-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-emerald-500">
                          </div>
                        </div>
                        <ul class="overflow-y-auto max-h-48 p-1 space-y-1">
                          <li v-for="item in filteredMedicines(med.searchQuery)" :key="item.id"
                              @click.stop="selectMedicine(index, item)"
                              class="flex items-center gap-3 p-2 hover:bg-emerald-50 rounded-md cursor-pointer transition-colors group">
                            <img :src="item.image"
                                 class="w-8 h-8 rounded-md object-cover border border-gray-200 bg-gray-100" alt="">
                            <div class="flex-1 min-w-0">
                              <p class="text-sm font-medium text-gray-800 truncate">{{ item.name }}</p>
                              <p class="text-xs text-gray-500">کد: {{ item.code }}</p>
                            </div>
                            <i class="ti ti-check text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                          </li>
                          <li v-if="filteredMedicines(med.searchQuery).length === 0"
                              class="p-4 text-center text-sm text-gray-500">
                            دارویی یافت نشد
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                      <input v-model="med.dosage" placeholder="دوز مصرفی"
                             class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                      <input v-model="med.duration" placeholder="مدت مصرف"
                             class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                    </div>
                    <input v-model="med.instructions" placeholder="توضیحات مصرف"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                  </div>
                  <button @click="removeMedication(index)"
                          class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors h-fit" title="حذف">
                    <i class="ti ti-trash"></i>
                  </button>
                </div>
              </div>

              <button @click="addMedication"
                      class="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-emerald-500 hover:text-emerald-600 transition-colors">
                <i class="ti ti-plus ml-1"></i> افزودن دارو
              </button>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">توضیحات کلی</label>
                <textarea v-model="prescription.notes"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none text-sm"
                          rows="3" placeholder="توصیه‌های کلی..."></textarea>
              </div>
            </div>

            <div class="flex gap-3 shrink-0">
              <button @click="sendPrescription"
                      :disabled="prescription.medications.length === 0"
                      class="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all font-medium disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base">
                <i class="ti ti-send ml-2"></i> ارسال نسخه
              </button>
              <button @click="showPrescriptionModal = false"
                      class="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium text-sm sm:text-base">
                انصراف
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- پیش‌نمایش تصویر -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="imagePreview" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
             @click="imagePreview = null">
          <img :src="resolveUrl(imagePreview)" class="max-w-full max-h-full object-contain rounded-lg shadow-2xl">
          <button @click="imagePreview = null"
                  class="absolute top-4 left-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors">
            <i class="ti ti-x text-2xl"></i>
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted, nextTick, inject, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useSocketStore} from "@/stores/socket.js";
import {useAuthStore} from "@/stores/auth.js";
import {useConsultationStore} from "@/stores/vet-clinic/consultation.js";
import {useMessageStore} from "@/stores/message.js";
import {storeToRefs} from 'pinia';
import {useAppointmentStore} from "@/stores/vet-clinic/appointment.js";
import {useUrlHelper} from "@/composables/useUrlHelper.js";

const appointmentStore = useAppointmentStore()
const {resolveUrl} = useUrlHelper();

const medicines = computed(() => appointmentStore.globalMedicines)
// تابع فیلتر کردن داروها (برای هر آیتم به صورت مجزا کار می‌کند)
const filteredMedicines = (query) => {
  if (!query) return medicines.value; // اگر جستجو خالی بود همه را نشان بده

  const lowerQuery = query.toLowerCase();
  return medicines.value.filter(med =>
      med.name.toLowerCase().includes(lowerQuery) ||
      med.code.toLowerCase().includes(lowerQuery)
  );
};

// تابع انتخاب دارو
const selectMedicine = (index, selectedMed) => {
  // بستن لیست
  prescription.value.medications[index].isOpen = false;
  // پاک کردن جستجو
  prescription.value.medications[index].searchQuery = '';
  // ذخیره داروی انتخاب شده
  prescription.value.medications[index].selectedMedicine = selectedMed;

  // پر کردن خودکار فیلدها (اختیاری)
  prescription.value.medications[index].name = selectedMed.name;
  if (selectedMed.dosage) {
    prescription.value.medications[index].dosage = selectedMed.dosage;
  }
};

const messageStore = useMessageStore()
const consultationStore = useConsultationStore()
const route = useRoute()
const router = useRouter()
const socketStore = useSocketStore()
const authStore = useAuthStore()
// دسترسی به تابع toggle سایدبار از لایوت
const toggleMobileSidebar = inject('toggleMobileSidebar', () => {
})
const toggleSidebar = () => {
  toggleMobileSidebar()
}

// Refs
const messagesContainer = ref(null)
const fileInput = ref(null)

// State
const isConnected = computed(() => socketStore.isConnected)
const loadingOlder = ref(false)
const showMenu = ref(false)
const newMessage = ref('')
const attachedFile = ref(null)
const imagePreview = ref(null)
let socket = null
let typingTimeout = null

// Modal states
const showCloseModal = ref(false)
const showBlockModal = ref(false)
const showPrescriptionModal = ref(false)
const closeNote = ref('')
const blockReason = ref('')
const closingChat = ref(false)
const blockingUser = ref(false)
const customerRating = ref(0)
const customerReview = ref('')

// نسخه
const prescription = ref({
  medications: [{
    name: '', dosage: '', duration: '', instructions: '',
    isOpen: false,      // وضعیت باز بودن لیست کشویی
    searchQuery: '',   // متن جستجوی کاربر
    selectedMedicine: null
  }],
  notes: ''
})

// اطلاعات چت
/*const chatInfo = ref({
  id: parseInt(route.params.id),
  customerName: 'علی احمدی',
  customerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ali',
  customerOnline: true,
  petName: 'ملوس',
  petType: 'گربه',
  petBreed: 'پرشین',
  status: 'active', // pending, active, closed
  closedAt: null
})*/
const consultation = computed(() =>
    consultationStore.consultations.find(c => String(c.id) === String(route.params.id))
);
const chats = computed(() => {
  // اگر استور هنوز خالی است، آرایه خالی برگردان
  if (!consultationStore.consultations || consultationStore.consultations.length === 0) {
    return [];
  }

  return consultationStore.consultations.map(item => {
    // ۱. استخراج نام کاربر
    const fullName = [item.user?.firstName, item.user?.lastName]
        .filter(Boolean)
        .join(' ');

    // ۲. نگاشت نوع حیوان به فارسی
    const petTypeMap = {
      'CAT': 'گربه',
      'DOG': 'سگ',
      'BIRD': 'پرنده'
    };
    const petTypeFa = petTypeMap[item.pet?.type] || item.pet?.type || 'حیوان';

    // ۳. تولید آواتار (اگر کاربر عکس ندارد)
    const avatar = item.user?.avatar
        ? item.user.avatar
        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.id}`;

    // ۴. تبدیل وضعیت سرور به وضعیت UI (در صورت نیاز)
    // اینجا فرض می‌کنیم status ها یکی هستند، اما اگر نیاز به تغییر دارید اینجا اعمال کنید
    // مثلا: const uiStatus = item.status === 'request_sent' ? 'pending' : item.status;

    return {
      id: item.id,
      userId: item.user.id,
      customerName: fullName || 'کاربر',
      customerAvatar: avatar,
      customerOnline: item.user?.isOnline || false,
      petName: item.pet?.name || 'نامشخص',
      petType: petTypeFa,
      petBreed: item.pet?.breed || '-',
      status: item.status, // request_sent, active, closed
      closedAt: new Data(item.updatedAt).toLocaleDateString('fa-IR'), // یا فیلد مربوط به تاریخ بسته شدن
      unreadCount: item.unreadCount || 0, // تعداد پیام‌های خوانده نشده
      specialty: item.specialty || 'عمومی' // تخصص دکتر
    };
  });
});
// اطلاعات چت (نگاشت داده واقعی به فرمت قالب)
const chatInfo = computed(() => {
  const data = consultation.value;

  // اگر داده‌ای لود نشده باشد، مقادیر پیش‌فرض را برمی‌گرداند تا قالب خراب نشود
  if (!data) {
    return {
      id: null,
      customerName: 'در حال بارگذاری...',
      customerAvatar: '',
      customerOnline: false,
      petName: '-',
      petType: '-',
      petBreed: '-',
      status: 'pending',
      closedAt: null
    };
  }

  // ترکیب نام و نام خانوادگی کاربر
  const fullName = [data.user?.firstName, data.user?.lastName]
      .filter(Boolean) // حذف مقادیر خالی
      .join(' ');

  // نگاشت نوع حیوان به فارسی (اختیاری)
  const petTypeMap = {
    'CAT': 'گربه',
    'DOG': 'سگ',
    'BIRD': 'پرنده'
  };
  const petTypeFa = petTypeMap[data.pet?.type] || data.pet?.type || 'حیوان';

  return {
    id: data.id,
    userId: data.user.id,
    consultationId: data.id,
    customerName: fullName || 'کاربر', // استفاده از نام واقعی
    customerAvatar: data.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.id}`, // آواتار واقعی یا پیش‌فرض
    customerOnline: data.user?.isOnline || false, // وضعیت آنلاین بودن
    petName: data.pet?.name || 'نامشخص', // نام حیوان
    petType: petTypeFa, // نوع حیوان
    petBreed: data.pet?.breed || '-', // نژاد
    status: data.status, // وضعیت مشاوره (request_sent, active, ...)
    closedAt: new Date(data.updatedAt).toLocaleDateString('fa-IR'), // یا هر فیلدی که تاریخ بسته شدن دارد
  };
});

// دریافت پیام‌ها با بررسی وجود مشاوره

// Mock data برای لود اطلاعات چت بر اساس آیدی
/*const mockChats = {
  1: {
    id: 1,
    customerName: 'علی احمدی',
    customerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ali',
    customerOnline: true,
    petName: 'ملوس',
    petType: 'گربه',
    petBreed: 'پرشین',
    status: 'active',
    closedAt: null
  },
  2: {
    id: 2,
    customerName: 'سارا محمدی',
    customerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sara',
    customerOnline: false,
    petName: 'توپی',
    petType: 'سگ',
    petBreed: 'پودل',
    status: 'active',
    closedAt: null
  },
  3: {
    id: 3,
    customerName: 'فاطمه حسینی',
    customerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fatemeh',
    customerOnline: false,
    petName: 'پشمالو',
    petType: 'گربه',
    petBreed: 'اسکاتیش',
    status: 'closed',
    closedAt: '۱۴۰۳/۰۹/۱۵'
  },
  4: {
    id: 4,
    customerName: 'رضا نوری',
    customerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reza',
    customerOnline: false,
    petName: 'مکس',
    petType: 'سگ',
    petBreed: 'ژرمن شپرد',
    status: 'closed',
    closedAt: '۱۴۰۳/۰۹/۱۴'
  },
  5: {
    id: 5,
    customerName: 'زهرا کریمی',
    customerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zahra',
    customerOnline: true,
    petName: 'ببعی',
    petType: 'خرگوش',
    petBreed: 'هلندی لوپ',
    status: 'pending',
    closedAt: null
  }
}*/

/*// لود اطلاعات چت
const loadChatInfo = () => {
  const id = parseInt(route.params.id)
  if (mockChats[id]) {
    chatInfo.value = { ...mockChats[id] }
  }

}*/
const messages = ref([])// computed(() => messageStore.messages);//

// ۲. تابع کمکی اصلاح شده برای تعیین فرستنده
const getSenderRole = (msg, currentUserId) => {
  // اولویت با type است (پیام سیستم)
  if (msg.type === 'system') return 'system'

  // اگر سیستم نبود، بررسی senderId
  if (!msg.senderId) return 'customer' // پیش‌فرض اگر senderId نبود

  if (msg.senderId === 'SYSTEM') return 'system'

  // اگر فرستنده کاربر جاری (دکتر) بود
  if (msg.senderId === currentUserId) return 'doctor'

  // در غیر این صورت مشتری است
  return 'customer'
}

// ۳. تابعی برای لود کردن پیام‌های اولیه از استور و تبدیل آن‌ها
const loadInitialMessages = () => {
  if (!consultation.value?.messages?.length) {
    messages.value = []
    return
  }

  const currentUserId = authStore.user?.id

  // 1. مرتب‌سازی پیام‌ها از قدیم به جدید
  const sortedMessages = [...consultation.value.messages].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  )

  // 2. تبدیل به فرمت UI
  messages.value = sortedMessages.map(msg => {
    const role = getSenderRole(msg, currentUserId)

    // 3. تعیین نوع محتوا
    let contentType = 'text'

    if (role === 'system') {
      contentType = 'system'
    } else if (msg.file?.type) {
      contentType = msg.file.type.startsWith('image/')
          ? 'image'
          : 'file'
    } else if (msg.type === 'prescription') {
      contentType = 'prescription'
    }

    return {
      id: msg.id,
      sender: role, // 'doctor', 'customer', 'system'
      type: contentType,
      text: msg.text || '',
      time: msg.time
          || new Date(msg.createdAt).toLocaleTimeString('fa-IR', {
            hour: '2-digit',
            minute: '2-digit'
          }),

      status: msg.seenAt
          ? 'read'
          : (msg.isDelivered ? 'delivered' : 'sent'),

      isMe: role === 'doctor',

      file: msg.file || null,
      prescription: msg.prescription || null
    }
  })

  // 4. پیدا کردن آخرین پیام خوانده‌نشده
  const lastDoctorMsg = [...messages.value]
      .slice()
      .reverse()
      .find(m => !m.isMe && m.status !== 'read')

  if (lastDoctorMsg) {
    socketStore.markAsRead({
      messageId: lastDoctorMsg.id,
      readBy: currentUserId
    })
  }

  // 5. اسکرول اتوماتیک به پایین (خیلی مهم برای UX چت)
  nextTick(() => {
    const el = document.querySelector('.chat-container')
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  })
}

// می‌تونه ارسال کنه
const canSend = computed(() => {
  return newMessage.value.trim() || attachedFile.value
})

// متن امتیاز
const ratingText = computed(() => {
  const texts = ['', 'ضعیف', 'قابل قبول', 'خوب', 'خیلی خوب', 'عالی']
  return texts[customerRating.value] || ''
})

// برگشت
const goBack = () => {
  router.push('/clinics/chat')
}

// اسکرول به پایین
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// مدیریت اسکرول
const handleScroll = () => {
  if (messagesContainer.value && messagesContainer.value.scrollTop === 0 && !loadingOlder.value) {
    loadOlderMessages()
  }
}

// لود پیام‌های قدیمی‌تر
const loadOlderMessages = async () => {
  loadingOlder.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  loadingOlder.value = false
}

// انتخاب فایل
const handleFileSelect = (e) => {
  const file = e.target.files[0]
  if (file) {
    attachedFile.value = file
  }
}

// فرمت سایز فایل
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// اضافه کردن: دسترسی واکنش‌گرا به لیست کاربران تایپ‌کننده
const {typingUsers} = storeToRefs(socketStore);
// برای تست: این واچر را اضافه کنید و کنسول را چک کنید
watch(typingUsers, (newVal) => {
  console.log("🔥 Typing Users Changed in Component:", newVal);
}, {deep: true});
// محاسبه وضعیت تایپ کردن مشتری (فقط اگر مشتری تایپ کند)
const isTyping = computed(() => {
  // ۱. اگر آرایه خالی است، false برگردان
  if (!typingUsers || typingUsers.value.length === 0) {
    return false;
  }

  // ۲. شناسه کاربر جاری (دکتر) را بگیر
  const myId = authStore.user?.id;

  // ۳. در آرایه بگرد دنبال کسی که خود دکتر نیست و در حال تایپ است
  // نکته: اگر myId undefined باشد، شرط u.userId !== undefined بررسی می‌شود
  const customerTyping = typingUsers.value.find(u => {
    const isNotMe = myId ? u.userId !== myId : true; // اگر آیدی نداریم، همه را غریبه فرض کن
    return isNotMe && u.isTyping === true;
  });

  // ۴. اگر پیدا شد، true برگردان
  return !!customerTyping;
});

// تایپ کردن
const handleTyping = () => {
  // استفاده از متدهای استور به جای emit مستقیم
  socketStore.startTyping({
    userId: authStore.user?.id,
    userName: authStore.user?.firstName || 'دکتر'
  });

  // پاک کردن تایمر قبلی
  if (typingTimeout) {
    clearTimeout(typingTimeout);
  }

  // تنظیم تایمر برای توقف تایپ بعد از ۲ ثانیه
  typingTimeout = setTimeout(() => {
    socketStore.stopTyping({
      userId: authStore.user?.id,
      userName: authStore.user?.firstName || 'دکتر'
    });
  }, 2000);
};

const sendMessage = async () => {
  if (!canSend.value) return

  // آماده سازی داده برای ارسال به سوکت
  const payload = {
    messageText: newMessage.value,
    senderId: authStore.user?.id,
    senderName: authStore.user?.name,
    type: 'text',
    prescription: undefined,
    file: null
  }

  if (attachedFile.value) {
    try {
      // آپلود فایل و دریافت URL
      const fileUrl = await messageStore.uploadFile(attachedFile.value);

      // ارسال فایل از طریق سوکت
      socketStore.sendFile({
        file: {
          url: fileUrl,
          name: attachedFile.value.name,
          type: attachedFile.value.type,
          size: attachedFile.value.size
        },
        senderId: authStore.user?.id,
        senderName: authStore.user?.firstName
      });
    } catch (error) {
      console.error('خطا در آپلود فایل:', error);
      return; // در صورت خطا، ادامه نده
    }
  } else {
    // ارسال پیام متنی
    socketStore.sendMessage(payload);
  }

  // پاک کردن ورودی
  newMessage.value = ''
  attachedFile.value = null
  scrollToBottom()
}

// پیش‌نمایش تصویر
const openImagePreview = (url) => {
  imagePreview.value = url
}

/*// تایید چت
const acceptChat = async () => {
  // API call
  await new Promise(resolve => setTimeout(resolve, 500))
  chatInfo.value.status = 'active'
  showMenu.value = false

  // پیام سیستمی
  messages.value.push({
    id: Date.now(),
    sender: 'system',
    type: 'info',
    text: 'گفتگو توسط دکتر تایید شد. اکنون می‌توانید پیام ارسال کنید.',
    time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
  })
  scrollToBottom()

  if (socket) {
    socket.emit('chat_accepted', { chatId: chatInfo.value.id })
  }
}*/
const acceptChat = async () => {

  chatInfo.value.status = 'active'
  chatInfo.value.requestStatus = 'confirmed'
  showMenu.value = false

  if (chatInfo.value) {
    await socketStore.approveConsultation({
      consultationId: chatInfo.value.consultationId, // این باید در دیتابیس شما موجود باشد
      doctorName: authStore.user?.firstName
    })
  }

  // یا می‌توانید یک emit اختصاصی در استور داشته باشید:
  // socketStore.socket.emit('chat-status-changed', { consultationId: ..., status: 'active' })
}

// رد کردن چت
const rejectChat = async () => {
  if (!confirm('آیا مطمئن هستید که می‌خواهید این درخواست را رد کنید؟')) return

  await new Promise(resolve => setTimeout(resolve, 500))
  await router.push('/clinics/chat')

  if (socket) {
    socket.emit('chat_rejected', {chatId: chatInfo.value.id})
  }
}

// بستن گفتگو
const closeChat = async () => {

  if (closingChat.value) return

  closingChat.value = true
  chatInfo.value.status = 'closed'
  chatInfo.value.closedAt = new Date().toLocaleDateString('fa-IR')
  if (socketStore) {
    await socketStore.closeChat({
      chatId: chatInfo.value.id,
      rating: customerRating.value,
      review: customerReview.value,
      note: closeNote.value
    })
  }

  showCloseModal.value = false
  closeNote.value = ''
  customerRating.value = 0
  customerReview.value = ''
  closingChat.value = false
}

// مسدود کردن کاربر
const blockUser = async () => {

  if (!blockReason.value.trim() || blockingUser.value) return

  blockingUser.value = true
  if (socketStore) {
    await socketStore.blockUser({
      userIdToBlocked: chatInfo.value.userId,
      blockReason: blockReason.value

    })
  }

  showBlockModal.value = false
  blockReason.value = ''
  blockingUser.value = false

  alert('کاربر با موفقیت مسدود شد')
  await router.push('/clinics/chat')

  if (socket) {
    socket.emit('block_user', {chatId: chatInfo.value.id, reason: blockReason.value})
  }
}

// مشاهده پروفایل بیمار
const viewPatientProfile = () => {
  showMenu.value = false
  // TODO
}

// مشاهده پرونده حیوان
const viewPetProfile = () => {
  showMenu.value = false
  // TODO
}

// مدیریت نسخه
const addMedication = () => {
  prescription.value.medications.push({
    name: '', dosage: '', duration: '', instructions: '',
    isOpen: false,
    searchQuery: '',
    selectedMedicine: null
  })
}

const removeMedication = (index) => {
  if (prescription.value.medications.length > 1) {
    prescription.value.medications.splice(index, 1)
  }
}

const sendPrescription = () => {
  const messageData = {
    sender: 'doctor',
    type: 'prescription',
    status: 'sent',
    prescription: {...prescription.value}
  }

  //messages.value.push(messageData)
  scrollToBottom()

  showPrescriptionModal.value = false
  prescription.value = {
    medications: [{name: '', dosage: '', duration: '', instructions: ''}],
    notes: ''
  }

  if (socketStore) {
    socketStore.sendPrescription({
      text: '',
      prescription: messageData.prescription,
      senderId: authStore.user?.id,
      senderName: authStore.user?.name
    })
  }
}


// بستن کلیک بیرون منو
const handleClickOutside = (e) => {
  if (!e.target.closest('.relative')) {
    showMenu.value = false
  }
}

onMounted(async () => {
  await authStore.fetchUser()
  await appointmentStore.fetchGlobalMedicines()
  await consultationStore.fetchConsultations()
  // ۱. اتصال به سوکت سرور
  if (localStorage.getItem('auth_token')) {
    socketStore.connect(localStorage.getItem('auth_token'))
  }

  //joinSocketRoom() // اتصال به سوکت
  loadInitialMessages()
  loadChatInfo()

  scrollToBottom()

  if (consultation.value?.id) {
    socketStore.setConsultationId(consultation.value.id);
  }

  document.addEventListener('click', handleClickOutside)
})


watch(() => socketStore.messages, (newMessages) => {

  // --- تغییرات جدید: بررسی و آپدیت وضعیت خوانده شدن پیام‌ها ---
  newMessages.forEach(socketMsg => {
    // اگر پیام از طرف سوکت آمد و وضعیت آن read است
    if (socketMsg.status === 'read') {
      // پیام متناظر را در استور پیام‌های کامپوننت پیدا کن
      const existingMsg = messages.value.find(m => m.id === socketMsg.id);

      if (existingMsg) {
        // وضعیت و زمان خوانده شدن را آپدیت کن
        existingMsg.status = 'read';
        existingMsg.readTime = socketMsg.readTime; // فرض بر اینکه سرور readTime را می‌فرستد
      }
    }
  });
  const lastMsg = newMessages[newMessages.length - 1];

  if (lastMsg && !messages.value.find(m => m.id === lastMsg.id)) {

    // بررسی اینکه آیا فرستنده خود کاربر است یا خیر
    const isMe = lastMsg.senderId === authStore.user?.id;

    // if (!isMe) {
    /*socketStore.markAsRead({
      messageId: lastMsg.id,
      readBy: authStore.user?.id
    });*/
    // }

    // ۱. تعیین فرستنده (Sender)
    let sender = 'customer';
    if (lastMsg.type === 'system') {
      sender = 'system';
    } else if (lastMsg.senderId === authStore.user?.id) {
      sender = 'doctor';
    }

    // ۲. تعیین نوع محتوا (Type)
    let type = 'text';
    if (lastMsg.type === 'system') {
      type = 'system';
    } else if (lastMsg.type === 'prescription') {
      type = 'prescription';
    } else if (lastMsg.file) {
      type = lastMsg.file.type.startsWith('image/') ? 'image' : 'file';
    }

    // ۳. ساخت آبجکت نهایی با فرمت استاندارد
    const uiMessage = {
      id: lastMsg.id,
      sender: sender,           // 'doctor' | 'customer' | 'system'
      type: type,               // 'text' | 'image' | 'file' | 'prescription' | 'system'
      text: lastMsg.text || '',
      time: lastMsg.time,
      status: lastMsg.status,   // برای پیام‌های سیستمی معمولا undefined است
      isMe: isMe,
      // فیلدهای شرطی (فقط اگر وجود داشته باشند اضافه می‌شوند)
      ...(lastMsg.file && {file: lastMsg.file, imageUrl: lastMsg.file.url}),
      ...(lastMsg.prescription && {prescription: lastMsg.prescription})
    };


    messages.value.push(uiMessage);
    scrollToBottom();
  }
}, {deep: true});

// تابعی برای اتصال به اتاق سوکت (اصلاح شده با منطق Leave قبل از Join)
const joinSocketRoom = async () => {
  // اگر اطلاعات مشاوره لود نشده باشد، کاری نکن
  if (!chatInfo.value || !chatInfo.value.consultationId) {
    return;
  }

  // اگر قبلاً در یک اتاق دیگر بودیم، ابتدا از آن خارج شو
  if (socketStore.currentConsultationId && socketStore.currentConsultationId !== chatInfo.value.consultationId) {
    console.log(`🚪 در حال خروج از اتاق قبلی: ${socketStore.currentConsultationId}`);
    socketStore.leaveConsultation(authStore.user?.id);
  }

  // حالا به اتاق جدید وصل شو
  if (socketStore.isConnected) {
    console.log(`🚀 در حال ورود به اتاق: ${chatInfo.value.consultationId}`);
    await socketStore.joinConsultation({
      userId: authStore.user?.id,
      consultationId: chatInfo.value.consultationId,
      userName: authStore.user?.firstName
    });
    await socketStore.markConsultationRead({consultationId: chatInfo.value.consultationId, userId: authStore.user?.id})
  } else {
    console.warn("⚠️ سوکت متصل نیست، تلاش برای اتصال...");
    // اگر سوکت قطع است، می‌توانید تلاش کنید دوباره وصل شوید (اختیاری)
    if (localStorage.getItem('auth_token')) {
      socketStore.connect(localStorage.getItem('auth_token'));
    }
  }
}

// واچ برای اتصال به اتاق سوکت وقتی اطلاعات چت لود شد
watch(() => chatInfo.value, (newChatInfo) => {
  if (newChatInfo && newChatInfo.consultationId) {
    joinSocketRoom()
  }
}, {immediate: true})

// ویرایش loadChatInfo برای اضافه کردن consultationId
const loadChatInfo = () => {

  const id = parseInt(String(route.params.id))
  if (chats) {
    chatInfo.value = {...chats[id]}
  }

}


// واچ برای تغییر route
watch(() => route.params.id, async (newId) => {
  if (newId) {
    await consultationStore.fetchConsultations()
    loadInitialMessages()
    loadChatInfo()
    scrollToBottom()
  }
})

onUnmounted(() => {
  if (socket) {
    socket.disconnect()
  }
  document.removeEventListener('click', handleClickOutside)
  clearTimeout(typingTimeout)
})

watch(() => chatInfo.value.consultationId, (newId) => {
  if (!newId) return;

  // ✅ استفاده از Action به جای تغییر مستقیم state
  socketStore.setConsultationId(newId);
}, {immediate: true});

// اگر سوکت وصل شد ولی در اتاق نبودیم، وارد شویم
watch(() => socketStore.isConnected, (connected) => {
  if (connected && chatInfo.value.consultationId) {
    // ✅ استفاده از Action
    socketStore.setConsultationId(chatInfo.value.consultationId);
  }
});
</script>

<style scoped>
.message-enter-active {
  transition: all 0.3s ease;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9);
}
</style>
