<template>
  <div class="h-screen bg-gray-50 flex font-vazir" dir="rtl">
    <!-- Chat area -->
    <div class="flex-1 flex flex-col relative">
      <!-- Info button -->
      <div class="absolute top-4 left-4 z-10">
        <button @click="showInfo = true"
                class="p-2 rounded-lg bg-white shadow-md hover:shadow-lg border hover:bg-gray-50 transition-all"
                title="جزئیات و راهنما">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </button>
      </div>

      <div v-if="!selectedChat" class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </div>
          <h3 class="text-xl text-gray-500 mb-2">گفتگویی انتخاب نشده</h3>
          <p class="text-gray-400">یکی از چت‌ها را انتخاب کنید</p>
        </div>
      </div>

      <div v-else class="flex-1 flex flex-col h-full overflow-hidden">
        <!-- Chat header -->
        <div class="bg-white border-b p-4">
          <div class="flex items-center">
            <NuxtLink :to="'/chat'" class="md:hidden p-2 ml-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19l7-7-7-7"></path>
              </svg>
            </NuxtLink>
            <div class="relative">
              <img :src="resolveUrl(selectedChat.avatar)" class="w-10 h-10 rounded-full ml-3">
              <div :class="[
                selectedChat.isOnline ? 'bg-green-400 online-pulse' : 'bg-gray-400',
                'absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white'
              ]"></div>
            </div>
            <div class="flex-1">
              <div class="flex items-center">
                <h1 class="font-bold">{{ selectedChat.name }}</h1>
                <svg v-if="selectedChat.name.includes('دکتر')" class="w-4 h-4 text-blue-500 mr-1 flex-shrink-0"
                     fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"/>
                </svg>
              </div>
              <p class="text-sm">
                <span :class="selectedChat.isOnline ? 'text-green-500' : 'text-gray-400'">
                  {{ selectedChat.isOnline ? 'آنلاین' : 'آفلاین' }}
                </span>
              </p>
            </div>
            <div class="hidden md:flex space-x-2 space-x-reverse">
              <button class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Messages -->
        <div class="flex-1 bg-gray-50 p-4 overflow-y-auto" ref="messagesContainer">
          <!-- Waiting for doctor approval message -->
          <div v-if="selectedChat.status === 'request-sent' || selectedChat.status === 'pending'" class="mb-6">
            <div class="bg-yellow-100 border border-yellow-300 rounded-lg p-4 text-center">
              <div class="flex items-center justify-center mb-2">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600 ml-2"></div>
                <i class="ti ti-clock w-6 h-6 text-yellow-600"></i>
              </div>
              <h3 class="font-bold text-yellow-800 mb-1" style="font-family: 'Shabnam', sans-serif;">
                منتظر تأیید {{ selectedChat.name }}
              </h3>
              <p class="text-yellow-700 text-sm" style="font-family: 'Shabnam', sans-serif;">
                درخواست گفتگو شما به دکتر ارسال شده است. پس از تأیید دکتر، امکان گفتگو فراهم خواهد شد.
              </p>
            </div>
          </div>

          <div class="space-y-4 pb-4">
            <TransitionGroup name="message" tag="div">
              <div v-for="msg in currentMessages" :key="msg.id">
                <!-- System Message -->
                <div v-if="msg.type === 'system'" class="flex justify-center my-2">
                  <div class="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full shadow-sm">
                    <span>{{ msg.text }}</span>
                    <span class="text-[10px] text-gray-500 mr-1">{{ msg.time }}</span>
                  </div>
                </div>

                <!-- Normal Message -->
                <div v-else
                     :class="msg.isMe ? 'flex justify-end' : 'flex justify-start'"
                     class="message-item">
                  <div :class="msg.isMe ? 'bg-blue-500 text-white max-w-xs' : 'bg-white max-w-xs'"
                       class="mb-2 px-4 py-2 rounded-lg shadow-sm relative hover:shadow-md transition-shadow">
                    <!-- File attachment display -->
                    <div v-if="msg.file" class="mb-2">
                      <div v-if="msg.file.type.startsWith('image/')" class="mb-2 relative group">
                        <img :src="resolveUrl(msg.file.url)" :alt="msg.file.name"
                             class="max-w-full h-auto rounded cursor-pointer border border-gray-200"
                             @click="$event.target.requestFullscreen?.()">
                        <a :href="msg.file.url" :download="msg.file.name"
                           class="absolute bottom-2 left-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                           title="دانلود تصویر">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                          </svg>
                        </a>
                      </div>
                      <div v-else class="flex items-center p-2 rounded border bg-gray-50 mb-2">
                        <svg class="w-8 h-8 text-gray-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <div class="flex-1">
                          <p class="text-sm font-medium text-gray-800">{{ msg.file.name }}</p>
                          <p class="text-xs text-gray-500">{{ formatFileSize(msg.file.size) }}</p>
                        </div>
                        <a :href="msg.file.url" :download="msg.file.name"
                           class="p-1 rounded text-blue-600 hover:bg-blue-100">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                        </a>
                      </div>
                    </div>

                    <!-- Prescription Display -->
                    <div
                        :id="'prescription-box-' + msg.id"
                        v-if="msg.type === 'prescription' && msg.prescription"
                        class="bg-gradient-to-br from-slate-800/80 to-slate-900/90 rounded-xl p-4 backdrop-blur-md mb-3 border border-white/10 shadow-lg shadow-emerald-900/20"
                    >
                      <div class="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                        <div class="bg-emerald-500/20 p-2 rounded-lg">
                          <i class="ti ti-prescription text-xl text-emerald-400"></i>
                        </div>
                        <div>
                          <span class="text-base font-bold text-white block">نسخه تجویزی</span>
                          <span class="text-xs text-slate-400">لطفاً طبق دستور پزشک مصرف کنید</span>
                        </div>
                      </div>
                      <div v-if="msg.prescription.medications && msg.prescription.medications.length > 0" class="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                        <div v-for="(med, index) in msg.prescription.medications"
                             :key="index"
                             class="bg-slate-700/40 hover:bg-slate-700/60 transition-colors duration-200 rounded-lg p-3 border border-white/5 relative overflow-hidden group">
                          <div class="absolute right-0 top-0 bottom-0 w-1 bg-emerald-500/50 group-hover:bg-emerald-400 transition-colors"></div>
                          <div class="flex items-center gap-2 mb-2 pr-2">
                            <i class="ti ti-pill text-sm text-emerald-300"></i>
                            <span class="text-sm font-bold text-white">{{ med.name }}</span>
                          </div>
                          <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-300 pr-2">
                            <div class="flex items-center gap-2 bg-slate-800/50 rounded px-2 py-1">
                              <i class="ti ti-droplet text-[10px] text-blue-400"></i>
                              <span class="opacity-70">دوز:</span>
                              <span class="font-medium text-slate-200">{{ med.dosage }}</span>
                            </div>
                            <div class="flex items-center gap-2 bg-slate-800/50 rounded px-2 py-1">
                              <i class="ti ti-clock text-[10px] text-orange-400"></i>
                              <span class="opacity-70">مدت:</span>
                              <span class="font-medium text-slate-200">{{ med.duration }}</span>
                            </div>
                          </div>
                          <div v-if="med.instructions" class="mt-3 pt-2 border-t border-white/5 text-xs text-slate-400 pr-2 flex gap-2">
                            <i class="ti ti-info-circle text-blue-400 mt-0.5"></i>
                            <span class="leading-relaxed">{{ med.instructions }}</span>
                          </div>
                        </div>
                      </div>
                      <div v-if="msg.prescription.notes" class="mt-4 pt-3 border-t border-white/10 bg-amber-500/10 rounded-lg p-3 border border-amber-500/20">
                        <div class="flex items-start gap-3">
                          <i class="ti ti-note text-amber-400 mt-0.5"></i>
                          <div>
                            <span class="text-xs font-bold text-amber-300 block mb-1">توصیه‌های کلی:</span>
                            <p class="text-xs text-slate-200 leading-relaxed">{{ msg.prescription.notes }}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Download Buttons for Prescription -->
                    <div class="mt-2 flex gap-2" v-if="msg.type === 'prescription' && msg.prescription">
                      <button
                          @click="downloadPrescriptionAsText(msg.prescription)"
                          class="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-2 rounded-lg transition-colors">
                        <i class="ti ti-file-text"></i>
                        دانلود متن نسخه
                      </button>
                      <button
                          @click="downloadPrescriptionAsImage(msg.prescription, msg.id)"
                          class="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 rounded-lg transition-colors">
                        <i class="ti ti-photo"></i>
                        دانلود تصویر
                      </button>
                    </div>

                    <!-- Text message -->
                    <p v-if="msg.text" class="text-sm">{{ msg.text }}</p>
                    <div :class="msg.isMe ? 'text-blue-100' : 'text-gray-400'"
                         class="text-xs mt-1 flex items-center justify-end">
                      <span>{{ msg.time }}</span>
                      <div v-if="msg.isMe && msg.status === 'read' && msg.readTime" class="mr-1 flex items-center">
                        <span class="text-blue-200 ml-1">خوانده شده {{ msg.readTime }}</span>
                      </div>
                      <div v-if="msg.isMe" class="mr-1 flex items-center">
                        <div v-if="msg.status === 'read'" class="flex">
                          <svg class="w-3 h-3 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                          </svg>
                          <svg class="w-3 h-3 text-blue-200 -mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                          </svg>
                        </div>
                        <svg v-else class="w-3 h-3 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TransitionGroup>

            <!-- Typing indicator -->
            <div v-if="typingIndicator" class="flex justify-start animate-pulse">
              <div class="bg-white max-w-xs px-4 py-2 rounded-lg shadow-sm">
                <div class="flex items-center space-x-2">
                  <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
                  </div>
                  <span class="text-xs text-gray-500">{{ typingIndicator }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Message input area -->
        <div v-if="selectedChat.status === 'closed'" class="bg-white border-t p-4">
          <div class="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
            <div class="flex items-center justify-center mb-2">
              <i class="ti ti-lock text-red-500 text-2xl"></i>
            </div>
            <h3 class="font-bold text-red-800 mb-1">گفتگو به پایان رسیده</h3>
            <p class="text-red-700 text-sm mb-3">این گفتگو بسته شده و امکان ارسال پیام وجود ندارد</p>
            <div class="flex gap-2 justify-center">
              <NuxtLink :to="'/chat'"
                        class="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border transition-all">
                بازگشت به لیست چت‌ها
              </NuxtLink>
            </div>
          </div>
        </div>

        <div v-else-if="selectedChat.status === 'active'" class="bg-white border-t p-4">
          <div v-if="selectedChat.requestStatus === 'request-sent'" class="text-center py-4">
            <div class="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
              <i class="ti ti-clock w-4 h-4 ml-2"></i>
              منتظر تأیید دکتر برای شروع گفتگو
            </div>
          </div>
          <div v-else class="flex items-end space-x-3 space-x-reverse">
            <!-- Attachment button -->
            <div class="relative">
              <input ref="fileInput" type="file" class="hidden" @change="handleFileSelect" multiple
                     accept="image/*,.pdf,.doc,.docx">
              <button @click="$refs.fileInput?.click()"
                      class="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                </svg>
              </button>
            </div>
            <div class="flex-1 relative">
              <input v-model="newMsg"
                     @keyup.enter="send"
                     @input="handleTyping"
                     :disabled="sending"
                     class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                     placeholder="پیام بنویسید...">
            </div>
            <button @click="send"
                    :disabled="!newMsg.trim() || sending"
                    :class="[
                      'px-6 py-3 rounded-xl transition-all font-medium',
                      newMsg.trim() && !sending
                        ? 'bg-blue-500 text-white hover:bg-blue-600 transform hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    ]">
              <span v-if="!sending">ارسال</span>
              <div v-else class="flex items-center">
                <svg class="animate-spin w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                ارسال
              </div>
            </button>
          </div>
        </div>
        <div v-else class="bg-gray-100 p-4 text-center text-gray-600">
          این گفتگو تمام شده است
        </div>
      </div>
    </div>

    <!-- Info Modal -->
    <Teleport to="body">
      <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
      >
        <div v-if="showInfo" class="fixed inset-0 z-50 flex items-center justify-center">
          <div
              class="absolute inset-0 bg-black/50 backdrop-blur-sm"
              @click="showInfo = false"
          ></div>
          <div class="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform modal">
            <Transition
                enter-active-class="transition-all duration-250 ease-out delay-50"
                enter-from-class="opacity-0 scale-95 translate-y-2"
                enter-to-class="opacity-100 scale-100 translate-y-0"
                leave-active-class="transition-all duration-150 ease-in"
                leave-from-class="opacity-100 scale-100 translate-y-0"
                leave-to-class="opacity-0 scale-95 translate-y-2"
            >
              <div v-if="showInfo" class="p-6">
                <!-- Header -->
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 p-2 bg-blue-100 rounded-lg ml-3">
                      <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900">راهنمای استفاده از چت</h3>
                  </div>
                  <button
                      @click="showInfo = false"
                      class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                <!-- Content -->
                <div class="space-y-4">
                  <div class="flex items-start">
                    <div class="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 ml-3"></div>
                    <p class="text-gray-700">برای شروع گفتگو، روی نام دکتر کلیک کنید</p>
                  </div>
                  <div class="flex items-start">
                    <div class="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 ml-3"></div>
                    <p class="text-gray-700">پیام‌های خوانده شده با تیک آبی مشخص می‌شوند</p>
                  </div>
                  <div class="flex items-start">
                    <div class="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 ml-3"></div>
                    <p class="text-gray-700">وضعیت آنلاین/آفلاین دکتر در کنار نام نشان داده می‌شود</p>
                  </div>
                  <div class="flex items-start">
                    <div class="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 ml-3"></div>
                    <p class="text-gray-700">می‌توانید در بین چت‌های فعال و تمام شده جابجا شوید</p>
                  </div>
                  <div class="flex items-start">
                    <div class="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 ml-3"></div>
                    <p class="text-gray-700">برای جستجو، از نوار جستجو در بالای لیست استفاده کنید</p>
                  </div>
                  <div class="flex items-start">
                    <div class="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 ml-3"></div>
                    <p class="text-gray-700">دکترهای تایید شده با تیک آبی مشخص می‌شوند</p>
                  </div>
                </div>
                <!-- Footer -->
                <div class="mt-6 pt-4 border-t border-gray-200">
                  <button
                      @click="showInfo = false"
                      class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    متوجه شدم
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import {useUrlHelper} from "~/composables/useUrlHelper";
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useSocketStore} from "~/stores/socket";
import {useAuthStore} from "~/stores/auth";
import {useMessageStore} from "~/stores/message";
import {useConsultationStore} from "~/stores/consultation";
import {storeToRefs} from 'pinia';
import html2canvas from 'html2canvas';

definePageMeta({
  layout: false
})
const {resolveUrl} = useUrlHelper();
const route = useRoute();
const router = useRouter();

// Stores
const socketStore = useSocketStore();
const {onlineUsers, typingUsers} = storeToRefs(socketStore);
const authStore = useAuthStore();
const messageStore = useMessageStore();
const consultationStore = useConsultationStore();

// Reactive state
const selected = ref(null);
const newMsg = ref('');
const searchQuery = ref('');
const messagesContainer = ref(null);
const sending = ref(false);
const showInfo = ref(false);
const fileInput = ref(null);
const windowWidth = ref(0);

const isMobile = computed(() => windowWidth.value < 768);

// Get doctorId from route
const chatId = computed(() => route.params.id);

// Computed Properties
const selectedChat = computed(() => {
  if (!chatId.value) return null;
  // جستجو بر اساس doctorId
  return consultationStore.consultations.find(c => String(c.id) === String(chatId.value));
});

const currentMessages = computed(() => messageStore.messages);

const typingIndicator = computed(() => {
  const users = socketStore.typingUsers;
  if (!users || users.length === 0) return '';
  const myId = authStore.user?.id;
  const otherUsers = users.filter(u => u.userId !== myId);
  if (otherUsers.length === 0) return '';
  const names = otherUsers.map(u => u.userName);
  if (names.length === 1) {
    return `${names} در حال تایپ...`;
  } else if (names.length === 2) {
    return `${names} و ${names} در حال تایپ...`;
  } else {
    return `${names.length} نفر در حال تایپ...`;
  }
});

// Methods
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const enterRoom = async (chat) => {

  if (!chat || !chat.consultationId) return;

  const targetId = chat.consultationId;

  if (socketStore.currentConsultationId) {
    socketStore.leaveConsultation();
  }

  if (socketStore.currentConsultationId === targetId) {

    await socketStore.joinConsultation({
      userId: authStore.user?.id,
      consultationId: targetId,
      userName: authStore.user?.firstName || 'کاربر'
    });

    await loadChatMessages(chat.id);

    return;
  }

  await new Promise(resolve => setTimeout(resolve, 100));

  socketStore.joinConsultation({
    userId: authStore.user?.id,
    consultationId: targetId,
    userName: authStore.user?.firstName || 'کاربر'
  });

  await loadChatMessages(chat.id);
};
const markChatAsRead = async (chatId) => {

  if (!chatId) return;
  try {
    if (socketStore.markConsultationRead) {
      await socketStore.markConsultationRead({consultationId: chatId, userId: authStore.user?.id});
    }
    const chat = consultationStore.consultations.find(c => String(c.id) === String(chatId));
    if (chat) {
      await consultationStore.updateConsultation(chat.id, {unread: 0});
    }
  } catch (error) {
    console.error('Error marking chat as read:', error);
  }
};

const loadChatMessages = async (chatId) => {
  messageStore.clearMessages();
  const chat = consultationStore.consultations.find(c => c.id === chatId);
  if (chat && chat.consultationId) {
    await messageStore.fetchConsultationMessages(chat.consultationId);
    await nextTick(() => scrollToBottom());
  }
};
const send = async () => {
  if (!newMsg.value.trim() || sending.value || !selectedChat.value) return;
  sending.value = true;
  const localMessage = {
    id: Date.now(),
    text: newMsg.value,
    senderId: authStore.user?.id,
    senderName: authStore.user?.firstName,
    isMe: true,
    time: new Date().toLocaleTimeString('fa-IR', {hour: '2-digit', minute: '2-digit'}),
    status: 'sent',
    type: 'text'
  };
  try {
    socketStore.sendMessage({
      messageText: localMessage.text,
      senderId: localMessage.senderId,
      senderName: localMessage.senderName,
      type: 'text',
      prescription: undefined,
      file: null
    });
    newMsg.value = '';
    scrollToBottom();
  } catch (error) {
    console.error('خطا در ارسال پیام:', error);
  } finally {
    sending.value = false;
  }
};

const handleFileSelect = (event) => {
  const files = event.target.files;
  if (!files || files.length === 0 || !selectedChat.value) return;
  Array.from(files).forEach(file => {
    if (file.size > 10 * 1024 * 1024) {
      alert('حجم فایل نباید از ۱۰ مگابایت بیشتر باشد');
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      scrollToBottom();
      try {
        const fileUrl = await messageStore.uploadFile(file);
        socketStore.sendFile({
          file: {
            url: fileUrl,
            name: file.name,
            type: file.type,
            size: file.size
          },
          senderId: authStore.user?.id,
          senderName: authStore.user?.firstName
        });
      } catch (error) {
        console.error('خطا در آپلود فایل:', error);
      }
    };
    reader.readAsDataURL(file);
  });
  event.target.value = '';
};

const handleTyping = () => {
  if (!selectedChat.value) return;
  socketStore.startTyping({
    userId: authStore.user?.id,
    userName: authStore.user?.firstName || 'کاربر'
  });
  if (typingTimeout) {
    clearTimeout(typingTimeout);
  }
  typingTimeout = setTimeout(() => {
    socketStore.stopTyping({
      userId: authStore.user?.id,
      userName: authStore.user?.firstName || 'کاربر'
    });
  }, 2000);
};

let typingTimeout = null;

const downloadPrescriptionAsText = (prescription) => {
  let content = "نسخه تجویزی\n";
  content += "----------------\n";
  if (prescription.medications) {
    prescription.medications.forEach((med, index) => {
      content += `${index + 1}. ${med.name}\n`;
      content += `دوز: ${med.dosage}\n`;
      content += `مدت: ${med.duration}\n`;
      if (med.instructions) {
        content += `دستور: ${med.instructions}\n`;
      }
      content += "\n";
    });
  }
  if (prescription.notes) {
    content += "----------------\n";
    content += `توصیه‌ها: ${prescription.notes}\n`;
  }
  const blob = new Blob([content], {type: 'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `naskhe-${new Date().toLocaleDateString('fa-IR')}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const downloadPrescriptionAsImage = async (prescription, msgId) => {
  try {
    const elementId = `prescription-box-${msgId}`;
    const element = document.getElementById(elementId);
    if (!element) {
      alert("خطا در پیدا کردن المان نسخه");
      return;
    }
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: null,
      logging: false,
      useCORS: true
    });
    const link = document.createElement('a');
    link.download = `noskheh-${msgId}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("خطا در تبدیل نسخه به عکس:", error);
    alert("خطا در ایجاد تصویر نسخه");
  }
};

// Lifecycle Hooks
onMounted(async () => {
  await authStore.fetchUser();
  windowWidth.value = window.innerWidth;
  window.addEventListener('resize', () => windowWidth.value = window.innerWidth);

  await consultationStore.fetchConsultations();

  // Find chat by doctorId
  const chat = consultationStore.consultations.find(c => String(c.id) === String(chatId.value));

  if (chat) {
    selected.value = chat.id;

    await markChatAsRead(chat.id);

    if (socketStore.isConnected) {

      await enterRoom(chat);
    }
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', () => windowWidth.value = window.innerWidth);
  if (typingTimeout) clearTimeout(typingTimeout);
});

// Watchers
watch(selectedChat, async (newVal, oldVal) => {
  if (newVal) {
    const targetId = newVal.consultationId || newVal.id;
    if (!socketStore.isConnected) {
      console.warn("سوکت متصل نیست، منتظر اتصال...");
      return;
    }
    await enterRoom(newVal);
  }
});

watch(() => socketStore.isConnected, (isConnected) => {
  if (isConnected && selectedChat.value) {
    const chat = selectedChat.value;
    if (socketStore.currentConsultationId !== chat.consultationId) {
      enterRoom(chat);
    }
  }
});

watch(() => socketStore.messages, (newMessages) => {
  newMessages.forEach(socketMsg => {
    if (socketMsg.status === 'read') {
      const existingMsg = messageStore.messages.find(m => m.id === socketMsg.id);
      if (existingMsg) {
        existingMsg.status = 'read';
        existingMsg.readTime = socketMsg.readTime;
      }
    }
  });

  const lastMsg = newMessages[newMessages.length - 1];
  if (lastMsg && !messageStore.messages.find(m => m.id === lastMsg.id)) {
    const isMe = lastMsg.senderId === authStore.user?.id;
    let sender = 'customer';
    if (lastMsg.type === 'system') sender = 'system';
    else if (lastMsg.senderId === authStore.user?.id) sender = 'doctor';

    let type = 'text';
    if (lastMsg.type === 'system') type = 'system';
    else if (lastMsg.type === 'prescription') type = 'prescription';
    else if (lastMsg.file) type = lastMsg.file.type.startsWith('image/') ? 'image' : 'file';

    const uiMessage = {
      id: lastMsg.id,
      sender: sender,
      type: type,
      text: lastMsg.text || '',
      time: lastMsg.time,
      status: lastMsg.status,
      isMe: isMe,
      ...(lastMsg.file && {file: lastMsg.file}),
      ...(lastMsg.prescription && {prescription: lastMsg.prescription})
    };
    messageStore.addMessage(uiMessage);
    scrollToBottom();
  }
}, {deep: true});

useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap'
    }
  ]
});
</script>

<style scoped>
.font-vazir {
  font-family: 'Vazirmatn', sans-serif;
}

.transition-all {
  transition: all 0.3s ease;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.message-enter-active {
  transition: all 0.3s ease-out;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.message-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.online-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.modal-backdrop {
  backdrop-filter: blur(4px);
}

.modal-content {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal button {
  transition: all 0.2s ease;
}

.modal button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .w-80 {
    width: 100%;
    position: absolute;
    z-index: 10;
    height: 100%;
  }
  .chat-area {
    display: none;
  }
  .chat-area.active {
    display: flex;
  }
}
</style>