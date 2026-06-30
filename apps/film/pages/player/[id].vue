<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
    <!-- Background blur -->
    <div 
      class="fixed inset-0 bg-cover bg-center filter blur-sm opacity-20 z-0"
      :style="{ backgroundImage: `url(${film.poster})` }"
    ></div>
    
    <!-- Main content -->
    <div class="relative z-10">
      <!-- Navigation bar -->
      <nav class="flex items-center justify-between p-4 bg-black/30 backdrop-blur-sm border-b border-gray-700/50">
        <div class="flex items-center space-x-4 space-x-reverse">
          <!-- <button @click="navigateTo(-1)" class="p-2 rounded-full bg-black/50 hover:bg-yellow-500/20 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button> -->
          <h1 class="text-xl font-bold">{{ film.title }}</h1>
        </div>
        
        <div class="flex items-center space-x-3 space-x-reverse">
          <!-- Search dropdown -->
          <BaseDropdown
            v-model="searchCategory"
            :options="searchCategories"
            placeholder="جستجو در..."
            button-class="p-2 rounded-full bg-black/50 hover:bg-yellow-500/20 transition-colors w-10 h-10 flex items-center justify-center"
            dropdown-class="top-full right-0 mt-2 w-48 z-[9999]"
          >
            <template #icon>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </template>
          </BaseDropdown>
          
          <button class="p-2 rounded-full bg-black/50 hover:bg-yellow-500/20 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </button>
          
          <!-- Share dropdown -->
          <BaseDropdown
            v-model="shareOption"
            :options="shareOptions"
            placeholder="اشتراک‌گذاری"
            button-class="p-2 rounded-full bg-black/50 hover:bg-yellow-500/20 transition-colors w-10 h-10 flex items-center justify-center"
            dropdown-class="top-full right-0 mt-2 w-48 z-[9999]"
            @select="shareFilm"
          >
            <template #icon>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
              </svg>
            </template>
          </BaseDropdown>
          
          <!-- User account icon - mobile -->
          <button 
            @click="showUserBottomSheet = true"
            class="p-2 rounded-full bg-black/50 hover:bg-yellow-500/20 transition-colors md:hidden"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </button>
        </div>
      </nav>

      <!-- Video Player Container -->
      <div class="relative w-full rounded-2xl overflow-hidden shadow-2xl mb-8 bg-black mx-4 mt-6">
        <!-- Video Element -->
        <video
          ref="videoPlayer"
          class="w-full aspect-video object-contain bg-black"
          :poster="film.poster"
          controls
          preload="metadata"
        >
          <source :src="videoUrl" type="video/mp4">
          <p class="text-white text-center p-8">
            مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
          </p>
        </video>

        <!-- Custom Controls Overlay -->
        <div 
          class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300"
          :class="{ 'opacity-100': showControls }"
        >
          <!-- Bottom Controls -->
          <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
            <!-- Control Buttons -->
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-6 space-x-reverse">
                <!-- Play/Pause Button -->
                <button
                  @click="togglePlayPause"
                  class="text-white hover:text-yellow-500 transition-all duration-300 bg-black/30 backdrop-blur-sm rounded-full p-3"
                >
                  <svg v-if="!isPlaying" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5v14l11-7z"/>
                  </svg>
                  <svg v-else class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </button>

                <!-- Time Display -->
                <div class="text-white text-sm bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
                  {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
                </div>
              </div>

              <!-- Right Controls -->
              <div class="flex items-center space-x-4 space-x-reverse">
                <!-- Quality Dropdown with ul/li -->
                <div class="relative" ref="qualityDropdownRef">
                  <button
                    @click.stop.prevent="toggleQualityDropdown"
                    class="bg-black/30 backdrop-blur-sm text-white border border-gray-600/50 rounded-full px-4 py-2 text-sm hover:border-yellow-500/50 transition-all duration-300 flex items-center space-x-2 space-x-reverse"
                  >
                    <span>{{ getQualityLabel(selectedQuality) }}</span>
                    <svg 
                      class="w-4 h-4 transition-transform duration-200" 
                      :class="{ 'rotate-180': qualityDropdownOpen }" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>
                  
                    <ul 
                      v-show="qualityDropdownOpen"
                      class="absolute top-full right-0 mt-2 w-40 bg-black/95 backdrop-blur-md border border-yellow-400/30 rounded-2xl shadow-2xl z-[99999] py-2 max-h-60 overflow-y-auto custom-scrollbar"
                    >
                      <li v-for="quality in qualities" :key="quality.value">
                        <button
                          @click="selectQualityOption(quality)"
                          class="w-full text-right px-6 py-4 text-sm transition-all duration-200 flex items-center justify-between hover:bg-yellow-400/10"
                          :class="quality.value === selectedQuality ? 'bg-yellow-400/20 text-yellow-400 border-r-4 border-yellow-400' : 'text-white hover:text-yellow-400'"
                        >
                          <span class="flex items-center space-x-3 space-x-reverse">
                            <span class="font-medium">{{ quality.label }}</span>
                          </span>
                          <div class="flex items-center space-x-2 space-x-reverse">
                            <span v-if="quality.badge" class="text-xs px-2 py-1 bg-gray-600/50 rounded-lg text-gray-300">{{ quality.badge }}</span>
                            <i v-if="quality.value === selectedQuality" class="ti ti-check text-yellow-400"></i>
                          </div>
                        </button>
                      </li>
                    </ul>
                </div>

                <!-- Speed Dropdown -->
                <div class="relative" ref="speedDropdownRef">
                  <button
                    @click.stop.prevent="toggleSpeedDropdown"
                    class="bg-black/30 backdrop-blur-sm text-white border border-gray-600/50 rounded-full px-4 py-2 text-sm hover:border-yellow-500/50 transition-all duration-300 flex items-center space-x-2 space-x-reverse"
                  >
                    <span>{{ getSpeedLabel(playbackRate) }}</span>
                    <svg 
                      class="w-4 h-4 transition-transform duration-200" 
                      :class="{ 'rotate-180': speedDropdownOpen }" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>
                  
                  <Transition
                    enter-active-class="transition ease-out duration-200"
                    enter-from-class="opacity-0 translate-y-1"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition ease-in duration-150"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 translate-y-1"
                  >
                    <ul 
                      v-if="speedDropdownOpen"
                      class="absolute top-full right-0 mt-2 w-32 bg-black/95 backdrop-blur-md border border-yellow-400/30 rounded-2xl shadow-2xl z-[99999] py-2 max-h-60 overflow-y-auto custom-scrollbar"
                    >
                      <li v-for="speed in speeds" :key="speed.value">
                        <button
                          @click="selectSpeedOption(speed)"
                          class="w-full text-right px-6 py-4 text-sm transition-all duration-200 flex items-center justify-between hover:bg-yellow-400/10"
                          :class="speed.value === playbackRate ? 'bg-yellow-400/20 text-yellow-400 border-r-4 border-yellow-400' : 'text-white hover:text-yellow-400'"
                        >
                          <span class="flex items-center space-x-3 space-x-reverse">
                            <span class="font-medium">{{ speed.label }}</span>
                          </span>
                          <div class="flex items-center space-x-2 space-x-reverse">
                            <i v-if="speed.value === playbackRate" class="ti ti-check text-yellow-400"></i>
                          </div>
                        </button>
                      </li>
                    </ul>
                  </Transition>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content below video -->
      <div class="px-4 pb-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main film info -->
          <div class="lg:col-span-2">
            <!-- Film Info Section -->
            <div class="bg-gradient-to-br from-zinc-900 to-black border border-yellow-500/20 rounded-2xl p-8 mb-6">
              <div class="flex items-start justify-between mb-6">
                <div class="flex-1">
                  <h1 class="text-3xl font-bold text-yellow-500 mb-3">{{ film.title }}</h1>
                  <div class="flex items-center space-x-6 space-x-reverse text-gray-400 mb-4">
                    <div class="flex items-center space-x-2 space-x-reverse">
                      <svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span>{{ film.rating }}/10</span>
                    </div>
                    <span>{{ film.year }}</span>
                    <span>{{ formatTime(film.duration || 0) }}</span>
                    <span class="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full text-sm">HD</span>
                  </div>
                  <p class="text-gray-300 leading-relaxed">{{ film.description }}</p>
                </div>
                
                <!-- Download button with ul/li dropdown -->
                <BaseDropdown
                  v-model="selectedDownload"
                  :options="downloadOptions"
                  placeholder="دانلود"
                  button-class="flex items-center space-x-2 space-x-reverse bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                  dropdown-class="top-full left-0 mt-2 w-48 z-[9999]"
                  @select="downloadVideo"
                >
                  <template #icon>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                  </template>
                  <span class="mr-2">دانلود</span>
                </BaseDropdown>
              </div>

              <!-- Action buttons -->
              <div class="flex items-center space-x-4 space-x-reverse">
                <button class="flex items-center space-x-2 space-x-reverse bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                  <span>علاقه‌مندی</span>
                </button>
                
                <button class="flex items-center space-x-2 space-x-reverse bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  <span>لیست پخش</span>
                </button>
              </div>
            </div>

            <!-- Cast section (عوامل ساخت) -->
            <div class="bg-gradient-to-br from-zinc-900 to-black border border-yellow-500/20 rounded-2xl p-8 mb-6">
              <h3 class="text-xl font-bold text-yellow-500 mb-6 flex items-center">
                <svg class="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                عوامل ساخت
              </h3>
              
              <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div class="text-center">
                  <div class="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <h4 class="font-bold text-white mb-1">کارگردان</h4>
                  <p class="text-gray-400 text-sm">احمد محمدی</p>
                </div>
                
                <div class="text-center">
                  <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <h4 class="font-bold text-white mb-1">فیلمبردار</h4>
                  <p class="text-gray-400 text-sm">رضا احمدی</p>
                </div>
                
                <div class="text-center">
                  <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                    </svg>
                  </div>
                  <h4 class="font-bold text-white mb-1">آهنگساز</h4>
                  <p class="text-gray-400 text-sm">علی کریمی</p>
                </div>
                
                <div class="text-center">
                  <div class="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </div>
                  <h4 class="font-bold text-white mb-1">تدوینگر</h4>
                  <p class="text-gray-400 text-sm">مریم حسینی</p>
                </div>
              </div>
            </div>

            <!-- Category section (دسته‌بندی) -->
            <div class="bg-gradient-to-br from-zinc-900 to-black border border-yellow-500/20 rounded-2xl p-8 mb-6">
              <h3 class="text-xl font-bold text-yellow-500 mb-4 flex items-center">
                <svg class="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a2 2 0 012-2z"/>
                </svg>
                دسته‌بندی
              </h3>
              
              <!-- Category dropdown with ul/li -->
              <div class="relative" ref="categoryDropdownRef">
                <button
                  @click.stop.prevent="toggleCategoryDropdown"
                  class="w-full bg-black/30 backdrop-blur-sm text-white border border-gray-600/50 rounded-xl px-4 py-3 text-sm hover:border-yellow-500/50 transition-all duration-300 flex items-center justify-between"
                >
                  <span>{{ getCategoryLabel(selectedCategory) || 'انتخاب دسته‌بندی' }}</span>
                  <svg 
                    class="w-4 h-4 transition-transform duration-200" 
                    :class="{ 'rotate-180': categoryDropdownOpen }" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                
                <Transition
                  enter-active-class="transition ease-out duration-200"
                  enter-from-class="opacity-0 translate-y-1"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition ease-in duration-150"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 translate-y-1"
                >
                  <ul 
                    v-if="categoryDropdownOpen"
                    class="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-md border border-yellow-400/30 rounded-2xl shadow-2xl z-[99999] py-2 max-h-60 overflow-y-auto custom-scrollbar"
                  >
                    <li v-for="category in categories" :key="category.value">
                      <button
                        @click="selectCategoryOption(category)"
                        class="w-full text-right px-6 py-4 text-sm transition-all duration-200 flex items-center justify-between hover:bg-yellow-400/10"
                        :class="category.value === selectedCategory ? 'bg-yellow-400/20 text-yellow-400 border-r-4 border-yellow-400' : 'text-white hover:text-yellow-400'"
                      >
                        <span class="flex items-center space-x-3 space-x-reverse">
                          <span class="font-medium">{{ category.label }}</span>
                        </span>
                        <div class="flex items-center space-x-2 space-x-reverse">
                          <i v-if="category.value === selectedCategory" class="ti ti-check text-yellow-400"></i>
                        </div>
                      </button>
                    </li>
                  </ul>
                </Transition>
              </div>
            </div>

            <!-- Sharing section (اشتراک‌گذاری) -->
            <div class="bg-gradient-to-br from-zinc-900 to-black border border-yellow-500/20 rounded-2xl p-8 mb-6">
              <h3 class="text-xl font-bold text-yellow-500 mb-4 flex items-center">
                <svg class="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                </svg>
                اشتراک‌گذاری
              </h3>
              
              <div class="grid grid-cols-3 md:grid-cols-5 gap-4">
                <button 
                  v-for="share in shareOptions" 
                  :key="share.value"
                  class="flex flex-col items-center space-y-2 p-4 bg-black/30 hover:bg-yellow-500/10 rounded-xl transition-colors"
                  @click="shareFilm(share.value)"
                >
                  <div class="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                    </svg>
                  </div>
                  <span class="text-white text-xs font-medium">{{ share.label }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Seasons and episodes -->
          <div class="space-y-6">
            <!-- Season selection -->
            <div class="bg-gradient-to-br from-zinc-900 to-black border border-yellow-500/20 rounded-2xl p-6">
              <h3 class="text-xl font-bold text-yellow-500 mb-4 flex items-center">
                <svg class="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
                فصل‌بندی
              </h3>
              
              <BaseDropdown
                v-model="selectedSeason"
                :options="seasons"
                placeholder="انتخاب فصل"
                button-class="w-full bg-black/30 backdrop-blur-sm text-white border border-gray-600/50 rounded-xl px-4 py-3 text-sm hover:border-yellow-500/50 transition-all duration-300"
                dropdown-class="top-full left-0 right-0 mt-2 z-[9999]"
                @select="selectSeason"
              />
            </div>

            <!-- Episodes list -->
            <div class="bg-gradient-to-br from-zinc-900 to-black border border-yellow-500/20 rounded-2xl p-6">
              <h3 class="text-xl font-bold text-yellow-500 mb-4 flex items-center">
                <svg class="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z"/>
                </svg>
                قسمت‌ها
              </h3>
              
              <div class="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                <div 
                  v-for="episode in currentSeasonEpisodes" 
                  :key="episode.id"
                  class="group relative bg-black/30 backdrop-blur-sm border border-gray-600/30 rounded-xl p-4 hover:border-yellow-500/50 transition-all duration-300 cursor-pointer"
                  :class="{ 'border-yellow-500/70 bg-yellow-500/10': episode.id === currentEpisode }"
                  @click="playEpisode(episode.id)"
                >
                  <div class="flex items-start space-x-4 space-x-reverse">
                    <div class="relative flex-shrink-0">
                      <img 
                        :src="episode.thumbnail" 
                        :alt="episode.title"
                        class="w-20 h-12 object-cover rounded-lg"
                      >
                      <div class="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg class="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                    
                    <div class="flex-1 min-w-0">
                      <h4 class="text-white font-medium text-sm mb-1 group-hover:text-yellow-500 transition-colors">
                        قسمت {{ episode.number }}: {{ episode.title }}
                      </h4>
                      <p class="text-gray-400 text-xs mb-2 line-clamp-2">{{ episode.description }}</p>
                      <div class="flex items-center space-x-3 space-x-reverse text-xs text-gray-500">
                        <span>{{ formatTime(episode.duration) }}</span>
                        <span>{{ episode.quality }}</span>
                        <span v-if="episode.watched" class="text-green-400">تماشا شده</span>
                      </div>
                    </div>
                  </div>

                  <!-- Progress Bar -->
                  <div v-if="episode.progress > 0" class="mt-3">
                    <div class="w-full h-1 bg-gray-600 rounded-full">
                      <div 
                        class="h-full bg-yellow-500 rounded-full transition-all duration-300"
                        :style="{ width: episode.progress + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Related films (فیلم‌های مرتبط) -->
            <div class="bg-gradient-to-br from-zinc-900 to-black border border-yellow-500/20 rounded-2xl p-6">
              <h3 class="text-xl font-bold text-yellow-500 mb-4 flex items-center">
                <svg class="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                </svg>
                فیلم‌های مرتبط
              </h3>
              
              <div class="space-y-3">
                <div v-for="related in relatedFilms" :key="related.id" class="group cursor-pointer">
                  <div class="flex items-start space-x-3 space-x-reverse bg-black/30 rounded-lg p-3 hover:bg-yellow-500/10 transition-colors">
                    <img :src="related.poster" :alt="related.title" class="w-16 h-12 object-cover rounded-lg flex-shrink-0">
                    <div class="flex-1 min-w-0">
                      <h4 class="text-white text-sm font-medium group-hover:text-yellow-500 transition-colors">{{ related.title }}</h4>
                      <p class="text-gray-400 text-xs mt-1">{{ related.year }} • {{ formatTime(related.duration) }}</p>
                      <div class="flex items-center space-x-1 space-x-reverse mt-1">
                        <svg class="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span class="text-xs text-gray-400">{{ related.rating }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Sheet for mobile user account -->
    <BottomSheet :is-open="showUserBottomSheet" title="حساب کاربری" @close="showUserBottomSheet = false">
      <div class="space-y-4">
        <div class="flex items-center space-x-4 space-x-reverse">
          <div class="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-white">کاربر نمونه</h3>
            <p class="text-gray-400">user@example.com</p>
          </div>
        </div>
        
        <div class="border-t border-gray-700 pt-4">
          <button class="w-full text-right flex items-center space-x-3 space-x-reverse p-3 hover:bg-gray-800 rounded-lg transition-colors">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <span class="text-white">پروفایل</span>
          </button>
          
          <button class="w-full text-right flex items-center space-x-3 space-x-reverse p-3 hover:bg-gray-800 rounded-lg transition-colors">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            <span class="text-white">علاقه‌مندی‌ها</span>
          </button>
          
          <button class="w-full text-right flex items-center space-x-3 space-x-reverse p-3 hover:bg-gray-800 rounded-lg transition-colors">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span class="text-white">تنظیمات</span>
          </button>
          
          <button class="w-full text-right flex items-center space-x-3 space-x-reverse p-3 hover:bg-gray-800 rounded-lg transition-colors text-red-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span>خروج</span>
          </button>
        </div>
      </div>
    </BottomSheet>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Props
interface Props {
  id?: string
}
const props = defineProps<Props>()

// Refs
const videoPlayer = ref<HTMLVideoElement | null>(null)
const isPlaying = ref(false)
const showControls = ref(true)
const showUserBottomSheet = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const selectedQuality = ref('auto')
const selectedDownload = ref('')
const selectedCategory = ref('')
const selectedSeason = ref(1)
const currentEpisode = ref(1)
const playbackRate = ref(1)
const searchCategory = ref('')
const shareOption = ref('')
const qualityDropdownOpen = ref(false)
const qualityDropdownRef = ref<HTMLElement | null>(null)
const speedDropdownOpen = ref(false)
const speedDropdownRef = ref<HTMLElement | null>(null)
const categoryDropdownOpen = ref(false)
const categoryDropdownRef = ref<HTMLElement | null>(null)

// Sample data
const film = ref({
  id: 1,
  title: 'نجات گربه‌های خیابانی',
  description: 'مستندی درباره نجات و نگهداری گربه‌های خیابانی توسط گروه‌های داوطلب در شهر تهران. این فیلم نشان می‌دهد چگونه عشق و مهربانی می‌تواند زندگی موجودات بی‌دفاع را نجات دهد.',
  poster: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400&h=600&fit=crop',
  videoUrl: 'https://sample-videos.com/zip/10/mp4/720/mp4-25MB.mp4',
  duration: 2730,
  rating: 8.5,
  year: 2023
})

const searchCategories = ref([
  { value: 'all', label: 'همه موارد' },
  { value: 'title', label: 'عنوان فیلم' },
  { value: 'actor', label: 'بازیگر' },
  { value: 'director', label: 'کارگردان' },
  { value: 'genre', label: 'ژانر' }
])

const shareOptions = ref([
  { value: 'telegram', label: 'تلگرام' },
  { value: 'whatsapp', label: 'واتساپ' },
  { value: 'instagram', label: 'اینستاگرام' },
  { value: 'twitter', label: 'توییتر' },
  { value: 'copy', label: 'کپی لینک' }
])

const qualities = ref([
  { value: 'auto', label: 'خودکار', badge: '' },
  { value: '1080', label: 'Full HD', badge: '1080p' },
  { value: '720', label: 'HD', badge: '720p' },
  { value: '480', label: 'SD', badge: '480p' },
  { value: '360', label: 'LD', badge: '360p' }
])

const speeds = ref([
  { value: 0.5, label: '×0.5' },
  { value: 0.75, label: '×0.75' },
  { value: 1, label: 'عادی' },
  { value: 1.25, label: '×1.25' },
  { value: 1.5, label: '×1.5' },
  { value: 2, label: '×2' }
])

const downloadOptions = ref([
  { value: '1080', label: 'Full HD (1080p)', badge: '2.5 GB' },
  { value: '720', label: 'HD (720p)', badge: '1.2 GB' },
  { value: '480', label: 'SD (480p)', badge: '600 MB' },
  { value: '360', label: 'LD (360p)', badge: '300 MB' }
])

const categories = ref([
  { value: 'documentary', label: 'مستند' },
  { value: 'wildlife', label: 'حیات وحش' },
  { value: 'pets', label: 'حیوانات خانگی' },
  { value: 'marine', label: 'دریایی' },
  { value: 'birds', label: 'پرندگان' }
])

const seasons = ref([
  { value: 1, label: 'فصل اول', badge: '12 قسمت' },
  { value: 2, label: 'فصل دوم', badge: '10 قسمت' },
  { value: 3, label: 'فصل سوم', badge: '8 قسمت' }
])

const allEpisodes = ref([
  {
    id: 1,
    season: 1,
    number: 1,
    title: 'آغاز ماجراجویی',
    description: 'در این قسمت با شخصیت‌های اصلی آشنا می‌شویم و ماجراجویی آغاز می‌شود.',
    thumbnail: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=200&h=120&fit=crop',
    duration: 1800,
    quality: 'HD',
    watched: true,
    progress: 100
  },
  {
    id: 2,
    season: 1,
    number: 2,
    title: 'اولین چالش',
    description: 'قهرمانان ما با اولین چالش بزرگ خود مواجه می‌شوند.',
    thumbnail: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=200&h=120&fit=crop',
    duration: 1950,
    quality: 'HD',
    watched: true,
    progress: 65
  },
  {
    id: 3,
    season: 1,
    number: 3,
    title: 'کشف راز',
    description: 'رازی مهم کشف می‌شود که مسیر داستان را تغییر می‌دهد.',
    thumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=120&fit=crop',
    duration: 2100,
    quality: 'HD',
    watched: false,
    progress: 0
  }
])

const relatedFilms = ref([
  {
    id: 2,
    title: 'شیرهای آفریقا',
    poster: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=200&h=120&fit=crop',
    duration: 3135,
    rating: 9.2,
    year: 2023
  },
  {
    id: 3,
    title: 'دنیای دلفین‌ها',
    poster: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=120&fit=crop',
    duration: 2325,
    rating: 8.8,
    year: 2023
  }
])

// Computed
const currentSeasonEpisodes = computed(() => {
  return allEpisodes.value.filter(episode => episode.season === selectedSeason.value)
})

const videoUrl = computed(() => {
  return film.value.videoUrl || ''
})

// Methods
const togglePlayPause = () => {
  if (!videoPlayer.value) return
  if (isPlaying.value) {
    videoPlayer.value.pause()
  } else {
    videoPlayer.value.play()
  }
}

const toggleQualityDropdown = () => {
  qualityDropdownOpen.value = !qualityDropdownOpen.value
}

const getQualityLabel = (value: string) => {
  const quality = qualities.value.find(q => q.value === value)
  return quality?.label || 'کیفیت'
}

const toggleSpeedDropdown = () => {
  speedDropdownOpen.value = !speedDropdownOpen.value
}

const getSpeedLabel = (value: number) => {
  const speed = speeds.value.find(s => s.value === value)
  return speed?.label || 'سرعت'
}

const selectSpeedOption = (speed: any) => {
  playbackRate.value = speed.value
  speedDropdownOpen.value = false
  if (videoPlayer.value) {
    videoPlayer.value.playbackRate = speed.value
  }
  console.log('Speed changed to:', speed.value)
}

const toggleCategoryDropdown = () => {
  categoryDropdownOpen.value = !categoryDropdownOpen.value
}

const getCategoryLabel = (value: string) => {
  const category = categories.value.find(c => c.value === value)
  return category?.label || ''
}

const selectCategoryOption = (category: any) => {
  selectedCategory.value = category.value
  categoryDropdownOpen.value = false
  console.log('Category changed to:', category.value)
}

const closeQualityDropdown = (event: Event) => {
  if (!event.target || !qualityDropdownRef.value?.contains(event.target as Node)) {
    qualityDropdownOpen.value = false
  }
}

const selectQualityOption = (quality: any) => {
  selectedQuality.value = quality.value
  qualityDropdownOpen.value = false
  console.log('Quality changed to:', quality.value)
}

const closeSpeedDropdown = (event: Event) => {
  if (!event.target || !speedDropdownRef.value?.contains(event.target as Node)) {
    speedDropdownOpen.value = false
  }
}

const closeCategoryDropdown = (event: Event) => {
  if (!event.target || !categoryDropdownRef.value?.contains(event.target as Node)) {
    categoryDropdownOpen.value = false
  }
}

const selectSpeed = (option: any) => {
  playbackRate.value = option.value
  if (videoPlayer.value) {
    videoPlayer.value.playbackRate = option.value
  }
}

const selectSeason = (option: any) => {
  selectedSeason.value = option.value
}

const downloadVideo = (option: any) => {
  console.log('Downloading video with quality:', option.value)
  alert(`دانلود فیلم با کیفیت ${option.label} شروع شد`)
}

const playEpisode = (episodeId: number) => {
  currentEpisode.value = episodeId
  console.log('Playing episode:', episodeId)
}

const shareFilm = (platform: string) => {
  console.log('Sharing to:', platform)
  alert(`اشتراک‌گذاری در ${platform}`)
}

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', closeQualityDropdown)
  document.addEventListener('click', closeSpeedDropdown)
  document.addEventListener('click', closeCategoryDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeQualityDropdown)
  document.removeEventListener('click', closeSpeedDropdown)
  document.removeEventListener('click', closeCategoryDropdown)
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(55, 65, 81, 0.3);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(234, 179, 8, 0.6);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(234, 179, 8, 0.8);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

video::-webkit-media-controls {
  display: none !important;
}

video::-webkit-media-controls-enclosure {
  display: none !important;
}
</style>
