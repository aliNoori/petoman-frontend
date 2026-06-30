<template>
  <div class="min-h-screen">
    <!-- Header -->
    <div class="mb-8">
      <HeaderFilm />
    </div>

    <!-- Report Problem Modal -->
    <div v-if="showReportModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
      <div class="bg-gray-900/95 backdrop-blur-lg rounded-2xl p-8 w-full max-w-lg border border-yellow-500/30 shadow-2xl">
        <div class="text-center mb-6">
          <div class="w-16 h-16 mx-auto bg-red-600/20 rounded-full flex items-center justify-center mb-4 border border-red-500/30">
            <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-white mb-2">گزارش مشکل</h2>
          <p class="text-gray-400">لطفاً مشکل خود را شرح دهید</p>
        </div>
        
        <form @submit.prevent="submitReport" class="space-y-6">
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-3">نوع مشکل</label>
            <!-- Problem type dropdown with ul/li -->
            <div class="relative" ref="problemTypeDropdownRef">
              <button
                @click.stop.prevent="toggleProblemTypeDropdown"
                class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500 focus:bg-white/15 transition-all duration-300 flex items-center justify-between"
              >
                <span>{{ getProblemTypeLabel(reportForm.type) || 'انتخاب کنید' }}</span>
                <svg 
                  class="w-4 h-4 transition-transform duration-200" 
                  :class="{ 'rotate-180': problemTypeDropdownOpen }" 
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
                  v-if="problemTypeDropdownOpen"
                  class="absolute top-full left-0 right-0 mt-2 bg-gray-800/95 backdrop-blur-md border border-yellow-400/30 rounded-lg shadow-2xl z-[99999] py-2 max-h-60 overflow-y-auto"
                >
                  <li v-for="type in problemTypes" :key="type.value">
                    <button
                      @click="selectProblemType(type)"
                      class="w-full text-right px-4 py-3 text-sm transition-all duration-200 hover:bg-yellow-400/10"
                      :class="type.value === reportForm.type ? 'bg-yellow-400/20 text-yellow-400' : 'text-white hover:text-yellow-400'"
                    >
                      <span class="font-medium">{{ type.label }}</span>
                    </button>
                  </li>
                </ul>
              </Transition>
            </div>
          </div>
          
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-3">شرح مشکل</label>
            <textarea 
              v-model="reportForm.description"
              rows="4"
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:bg-white/15 transition-all duration-300"
              placeholder="لطفاً مشکل خود را به تفصیل شرح دهید..."
              required
            ></textarea>
          </div>
          
          <div class="flex space-x-4 space-x-reverse">
            <button 
              type="submit"
              class="flex-1 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-all duration-300"
            >
              ارسال گزارش
            </button>
            <button 
              type="button"
              @click="closeReportModal"
              class="flex-1 bg-gray-600/20 border border-gray-500/30 text-gray-300 font-bold py-3 rounded-lg hover:bg-gray-600/30 transition-all duration-300"
            >
              لغو
            </button>
          </div>
        </form>
        
        <button 
          @click="closeReportModal"
          class="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Main Content -->
    <div class="container mx-auto px-4 pt-8 pb-8 ">
      <!-- Video Player Section -->
      <div class="relative mb-8 mt-36">
        <div class="relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-yellow-500/20">
          <!-- Video Player -->
          <div class="aspect-video relative">
            <!-- Episode Info Overlay -->
            <div v-if="currentEpisode" class="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 border border-yellow-500/30">
              <p class="text-yellow-400 text-sm font-medium">{{ currentEpisode.title }}</p>
              <p class="text-gray-300 text-xs">{{ currentEpisode.duration }}</p>
            </div>
            <FilmPlayer
                ref="mainPlayer"
                v-if="videoConfig"
                :key="videoConfig.url"
                :videoConfig="videoConfig"
                @play="onMainPlay"
            />
          </div>
        </div>
      </div>

      <!-- Movie Info Grid -->
      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Main Info -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Movie Title & Rating -->
          <div class="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <div class="flex items-start justify-between mb-6">
              <div>
                <h1 class="text-4xl font-bold text-white mb-3">
                  {{ media?.title }}
                </h1>

                <p class="text-yellow-400 text-xl">
                  {{ media?.titleEn }} • {{ media?.year }}
                </p>
              </div>
              <div class="flex items-center bg-yellow-500/20 px-6 py-3 rounded-xl border border-yellow-500/30">
                <svg class="w-6 h-6 text-yellow-400 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span class="text-yellow-400 font-bold text-lg">
                  {{ media?.imdbRating }}
                </span>
              </div>
            </div>
            
            <!-- Tags -->
            <div class="flex flex-wrap gap-3 mb-6">
              <span
                  v-for="tag in media?.tags"
                  :key="tag"
                  class="px-4 py-2 bg-yellow-600/20 text-yellow-300 rounded-lg text-sm border border-yellow-500/30 cursor-pointer hover:bg-yellow-600/30 transition-colors"
              >
                {{ tag }}
              </span>
            </div>

            <!-- Description -->
            <p class="text-gray-300 leading-relaxed text-lg">
              {{ media?.description }}
            </p>

          </div>

          <!-- Cast & Crew -->
          <div class="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <h3 class="text-2xl font-bold text-white mb-6 flex items-center">
              <svg class="w-7 h-7 text-yellow-400 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              بازیگران و عوامل
            </h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div @click="showActorInfo('actor1')" class="flex items-center space-x-4 space-x-reverse p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                  <div class="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                    <span class="text-black font-bold text-lg">AC</span>
                  </div>
                  <div>
                    <p class="text-white font-medium text-lg">نام بازیگر اول</p>
                    <p class="text-white font-medium text-lg">
                      {{ media?.cast }}
                    </p>
                  </div>
                </div>
                <div @click="showActorInfo('actor2')" class="flex items-center space-x-4 space-x-reverse p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                  <div class="w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
                    <span class="text-white font-bold text-lg">BD</span>
                  </div>
                  <div>
                    <p class="text-white font-medium text-lg">نام بازیگر دوم</p>
                    <p class="text-white font-medium text-lg">
                      {{ media?.cast }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="space-y-4">
                <div @click="showCrewInfo('director')" class="flex items-center space-x-4 space-x-reverse p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                  <div class="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                    <span class="text-black font-bold text-lg">DR</span>
                  </div>
                  <div>
                    <p class="text-white font-medium text-lg">نام کارگردان</p>
                    <p class="text-white font-medium text-lg">
                      {{ media?.director }}
                    </p>
                  </div>
                </div>
                <div @click="showCrewInfo('producer')" class="flex items-center space-x-4 space-x-reverse p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                  <div class="w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
                    <span class="text-white font-bold text-lg">PR</span>
                  </div>
                  <div>
                    <p class="text-white font-medium text-lg">نام تهیه‌کننده</p>
                    <p class="text-gray-400 text-sm">تهیه‌کننده</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Episodes Section -->
          <div v-if="seasons.length>0" class="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <div class="flex items-center justify-between mb-8">
              <h3 class="text-2xl font-bold text-white flex items-center">
                <svg class="w-7 h-7 text-yellow-400 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1h-1v11a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 3v1h6V3H9zm2 5a1 1 0 011-1h0a1 1 0 011 1v6a1 1 0 01-1 1h0a1 1 0 01-1-1V8z"/>
                </svg>
                قسمت‌ها
              </h3>
              <div class="relative">
                <button 
                  @click="toggleSeasonDropdown"
                  class="flex items-center space-x-3 space-x-reverse bg-yellow-600/20 hover:bg-yellow-600/30 px-6 py-3 rounded-lg border border-yellow-500/30 transition-colors duration-300"
                >
                  <span class="text-white text-lg">{{ selectedSeason?.title }}</span>
                  <svg class="w-5 h-5 text-yellow-400 transform transition-transform duration-300" :class="{'rotate-180': showSeasonDropdown}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                <ul v-if="showSeasonDropdown" class="absolute top-full right-0 mt-2 bg-gray-900/95 backdrop-blur-sm border border-yellow-500/30 rounded-lg shadow-xl z-50 min-w-[140px]">
                  <li v-for="(season, index) in seasons"
                      :key="season.id"
                      class="border-b border-gray-700/50 last:border-b-0">
                    <button
                      @click="selectSeason(season,index)"
                      class="w-full text-right px-6 py-4 text-white hover:bg-yellow-600/20 transition-colors duration-200 text-lg"
                    >
                      {{ season.title }}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            
            <!-- Episodes Grid -->
            <div class="grid md:grid-cols-2 gap-6">
              <div v-for="(episode, index) in episodes"
                   :key="episode.id"
                   @click="playEpisode(index)"
                   class="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-yellow-500/50 transition-all duration-300 cursor-pointer group">
                <div class="flex items-center space-x-4 space-x-reverse">
                  <div class="w-20 h-20 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg class="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 5v10l7-5z"/>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-white font-medium mb-2 text-lg">{{ episode.title }}</h4>
                    <p class="text-gray-400 text-sm mb-3">{{ episode.duration }}</p>
                    <div class="w-full bg-gray-700 rounded-full h-2">
                      <div class="bg-yellow-600 h-2 rounded-full transition-all duration-300" :style="`width: ${episode.progress}%`"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-8">
          <!-- Movie Stats -->
          <div class="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h3 class="text-xl font-bold text-white mb-6">اطلاعات فیلم</h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center py-2 border-b border-white/10">
                <span class="text-gray-400">مدت زمان:</span>
                <span class="text-white">
                  {{ media?.duration }} دقیقه
                </span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-white/10">
                <span class="text-gray-400">سال تولید:</span>
                <span class="text-white">
                  {{ media?.year }}
                </span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-white/10">
                <span class="text-gray-400">زبان:</span>
                <span class="text-white">
                  {{ media?.language || 'نامشخص' }}
                </span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-white/10">
                <span class="text-gray-400">کیفیت:</span>
                <span class="text-green-400">
                  {{ media?.videoQuality || 'HD' }}
                </span>
              </div>
              <div class="flex justify-between items-center py-2">
                <span class="text-gray-400">حجم:</span>
                <span class="text-white">۸.۵ گیگابایت</span>
              </div>
            </div>
          </div>

          <!-- Related Videos -->
          <div class="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h3 class="text-xl font-bold text-white mb-6">فیلم‌های مشابه</h3>
            <div class="space-y-4">
              <div v-for="related in relatedMovies" :key="related.id" 
                   @click="goToMovie(related)"
                   class="flex items-center space-x-4 space-x-reverse p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300 cursor-pointer">
                <div class="w-16 h-12 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded flex items-center justify-center">
                  <svg class="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 5v10l7-5z"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <h4 class="text-white text-sm font-medium">{{ related.title }}</h4>
                  <p class="text-gray-400 text-xs">{{ related.year }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-4">
            <button @click="mediaStore.toggleWatchlist(String(media?.id),media?.type)"
                    class="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold py-4 rounded-xl hover:from-yellow-700 hover:to-yellow-600 transform hover:scale-105 transition-all duration-300 shadow-lg text-lg">
              <i
                  :class="mediaStore.isWatchlist(String(media?.id),media?.type)
                  ? 'ti ti-check'
                  : 'ti ti-clock'"
              ></i>
              افزودن به لیست تماشا
            </button>
            <button @click="downloadMovie" class="w-full bg-gray-600/20 border border-gray-500/30 text-gray-300 font-bold py-4 rounded-xl hover:bg-gray-600/30 transition-all duration-300 text-lg">
              دانلود فیلم
            </button>
            <button @click.stop="reportProblem" class="w-full bg-red-600/20 border border-red-500/30 text-red-400 font-bold py-4 rounded-xl hover:bg-red-600/30 transition-all duration-300 text-lg">
              گزارش مشکل
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <FooterFilm />

    <!-- Episode Play Modal -->
    <div v-if="showEpisodeModal" class="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-gray-900/95 backdrop-blur-lg rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-yellow-500/30 shadow-2xl">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div class="flex items-center space-x-4 space-x-reverse">
            <div class="w-12 h-12 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 5v10l7-5z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">{{ currentEpisode?.title }}</h3>
              <p class="text-gray-400 text-sm">{{ currentEpisode?.duration }}</p>
            </div>
          </div>
          <button 
            @click="closeEpisodeModal"
            class="text-gray-400 hover:text-white transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Episode Content -->
        <div class="p-6">
          <!-- Movie Poster and Info -->
          <div class="flex flex-col lg:flex-row gap-6 mb-8">
            <div class="lg:w-1/3">
              <div class="aspect-[2/3] bg-gradient-to-br from-yellow-600/20 to-gray-800/20 rounded-xl border border-yellow-500/20 flex items-center justify-center">
                <svg class="w-16 h-16 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1h-1v11a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 3v1h6V3H9z"/>
                </svg>
              </div>
            </div>
            <div class="lg:w-2/3 space-y-4">
              <h2 class="text-2xl font-bold text-white">{{ media?.title }}</h2>
              <p class="text-yellow-400">{{ currentEpisode?.title }}</p>
              <p class="text-gray-300 leading-relaxed">
                {{ currentEpisode?.description }}
              </p>
              <div class="flex items-center space-x-4 space-x-reverse">
                <span class="px-3 py-1 bg-yellow-600/20 text-yellow-300 rounded-lg text-sm border border-yellow-500/30">{{ selectedSeason?.title }}</span>
                <span class="px-3 py-1 bg-gray-600/20 text-gray-300 rounded-lg text-sm border border-gray-500/30">{{ currentEpisode?.duration }}</span>
              </div>
            </div>
          </div>

          <!-- Video Player Section -->
          <div class="bg-black rounded-xl overflow-hidden mb-6">
            <div class="aspect-video bg-black flex items-center justify-center">
              <FilmPlayer
                  ref="episodePlayer"
                  v-if="videoConfig"
                  :key="videoConfig.url + '-modal'"
                  :videoConfig="videoConfig"
                  @play="onEpisodePlay"
              />
            </div>
          </div>


          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-4">
            <button 
              @click="startPlaying"
              class="flex-1 min-w-[200px] bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold py-3 px-6 rounded-xl hover:from-yellow-700 hover:to-yellow-600 transform hover:scale-105 transition-all duration-300"
            >
              شروع پخش
            </button>
            <button
                @click="mediaStore.toggleWatchlist(currentEpisode.id,'episode')"
              class="flex-1 min-w-[200px] bg-gray-600/20 border border-gray-500/30 text-gray-300 font-bold py-3 px-6 rounded-xl hover:bg-gray-600/30 transition-all duration-300"
            >

              <i
                  :class="mediaStore.isWatchlist(currentEpisode.id,'episode')
                  ? 'ti ti-check'
                  : 'ti ti-clock'"
              ></i>
              افزودن به لیست
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Login Modal -->
    <div v-if="showLoginModal" class="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-gray-900/98 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-yellow-500/30 shadow-2xl">
        <div class="text-center mb-8">
          <div class="w-20 h-20 mx-auto bg-yellow-600/20 rounded-full flex items-center justify-center mb-6 border border-yellow-500/30">
            <svg class="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-white mb-3">ورود کاربران</h2>
          <p class="text-gray-400 text-lg">دسترسی به محتوای ویژه</p>
        </div>
        
        <form @submit.prevent="login" class="space-y-6">
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-3">نام کاربری یا ایمیل</label>
            <div class="relative">
              <input 
                v-model="loginForm.username"
                type="text" 
                class="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:bg-white/15 transition-all duration-300"
                placeholder="نام کاربری خود را وارد کنید"
                required
              >
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-3">رمز عبور</label>
            <div class="relative">
              <input 
                v-model="loginForm.password"
                type="password" 
                class="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:bg-white/15 transition-all duration-300"
                placeholder="رمز عبور خود را وارد کنید"
                required
              >
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <label class="flex items-center cursor-pointer">
              <input type="checkbox" class="rounded border-gray-600 text-yellow-600 focus:ring-yellow-500">
              <span class="mr-3 text-gray-300 text-sm">مرا به خاطر بسپار</span>
            </label>
            <a href="#" @click="forgotPassword" class="text-yellow-400 text-sm hover:text-yellow-300 transition-colors">فراموشی رمز عبور؟</a>
          </div>
          
          <button 
            type="submit"
            class="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold py-4 rounded-xl hover:from-yellow-700 hover:to-yellow-600 transform hover:scale-[1.02] transition-all duration-300 shadow-lg text-lg"
          >
            ورود و تماشا
          </button>
        </form>
        
        <div class="mt-8 text-center">
          <p class="text-gray-400">حساب کاربری ندارید؟ 
            <a href="#" @click="openRegister" class="text-yellow-400 hover:text-yellow-300 transition-colors font-medium">ثبت نام کنید</a>
          </p>
        </div>
        
        <button 
          @click="closeLoginModal"
          class="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Notification Toast -->
    <div v-if="showNotification" class="fixed top-4 right-4 bg-yellow-600 text-black px-6 py-4 rounded-lg shadow-lg z-50 transform transition-transform duration-300">
      {{ notificationMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import Hls from 'hls.js'
import {ref, onMounted, computed} from 'vue'
import {useRoute, useRouter} from "nuxt/app";
import {type Movie, useMovieStore} from "~/stores/movie";
import {type Series, useSeriesStore} from "~/stores/series";
import {useMediaStore} from "~/stores/media";
import { onBeforeUnmount, watch } from 'vue'
import throttle from 'lodash/throttle'
import {useReportStore} from "~/stores/report";

const mediaStore=useMediaStore()
const route=useRoute()
const movieStore=useMovieStore()
const seriesStore=useSeriesStore()
// Authentication state
const isAuthenticated = ref(true)
const showLoginModal = ref(false)
const loginForm = ref({
  username: '',
  password: ''
})


// UI states
const showSeasonDropdown = ref(false)
const activeSeries = ref<Series | null>(null)

const media = computed<Movie | Series | undefined>(() => {
  if (activeSeries.value) return activeSeries.value
  return (
      movieStore.movies.find(m => m.id === route.params.id) ||
      seriesStore.seriesList.find(s => s.id === route.params.id)
  )
})
const seasons = computed(() => {
  if (!media.value || media.value.type !== 'series') return []
  return media.value.seasonsList
})

const videoPlayer = ref<HTMLVideoElement | null>(null)
const showNotification = ref(false)
const notificationMessage = ref('')
const showEpisodeModal = ref(false)
const showReportModal = ref(false)
const selectedSeason = ref(seasons.value[0] || null)
const selectedSeasonIndex = ref(0)
const selectedEpisodeIndex = ref(0)
const isPlaying = ref(false)
const problemTypeDropdownOpen = ref(false)
const problemTypeDropdownRef = ref<HTMLElement | null>(null)

// Report form
const reportForm = ref({
  type: '',
  description: ''
})


// Problem types
const problemTypes = ref([
  { value: 'video', label: 'مشکل در پخش ویدیو' },
  { value: 'audio', label: 'مشکل در صدا' },
  { value: 'subtitle', label: 'مشکل در زیرنویس' },
  { value: 'quality', label: 'مشکل در کیفیت' },
  { value: 'other', label: 'سایر موارد' }
])

const getEpisodeProgressPercent = (episodeId: string) => {
  const watched = mediaStore.getWatched(episodeId, 'episode')
  if (!watched || !watched.duration) return 0

  return Math.min(
      100,
      Math.floor((watched.currentTime / watched.duration) * 100)
  )
}


// Data
const episodes = computed(() => {
  if (!seasons.value.length) return []

  return (
      seasons.value[selectedSeasonIndex.value]?.episodes || []
  ).map(ep => ({
    ...ep,
    progress: getEpisodeProgressPercent(ep.id),
  }))
})


const currentEpisode = computed(() => {
  return episodes.value[selectedEpisodeIndex.value]
})

const getEpisodeResumeTime = () => {
  if (!currentEpisode.value) return 0

  const watched = mediaStore.getWatched(
      currentEpisode.value.id,
      'episode'
  )

  return watched?.currentTime ?? 0
}

const saveEpisodeProgress = () => {
  if (!videoPlayer.value || !currentEpisode.value) return

  const currentTime = Math.floor(videoPlayer.value.currentTime)
  const duration = Math.floor(videoPlayer.value.duration || 0)

  if (!duration || currentTime < 5) return

  mediaStore.updateWatched(
      currentEpisode.value.id,
      'episode',
      currentTime,
      duration,
  )
}

const throttledSaveProgress = throttle(saveEpisodeProgress, 10_000)
const bindVideoEvents = () => {
  if (!videoPlayer.value) return

  videoPlayer.value.addEventListener('timeupdate', throttledSaveProgress)
  videoPlayer.value.addEventListener('pause', saveEpisodeProgress)
  videoPlayer.value.addEventListener('ended', onVideoEnded)
}

const unbindVideoEvents = () => {
  if (!videoPlayer.value) return

  videoPlayer.value.removeEventListener('timeupdate', throttledSaveProgress)
  videoPlayer.value.removeEventListener('pause', saveEpisodeProgress)
  videoPlayer.value.removeEventListener('ended', onVideoEnded)
}

watch(showEpisodeModal, (open) => {
  if (open) {
    setTimeout(bindVideoEvents, 0)
  } else {
    saveEpisodeProgress()
    unbindVideoEvents()
    episodePlayer.value?.pause?.()
  }
})

onBeforeUnmount(() => {
  saveEpisodeProgress()
  unbindVideoEvents()
  throttledSaveProgress.cancel()
})
const resumeTime = getEpisodeResumeTime()

if (resumeTime > 5) {
  videoPlayer.value!.currentTime = resumeTime
}

const onVideoEnded = () => {
  saveEpisodeProgress()

  if (selectedEpisodeIndex.value < episodes.value.length - 1) {
    playEpisode(selectedEpisodeIndex.value + 1)
  }
}



/*const episodes = ref([
  { id: 1, title: 'قسمت اول - آغاز ماجراجویی', duration: '45 دقیقه', progress: 75 },
  { id: 2, title: 'قسمت دوم - راز پنهان', duration: '50 دقیقه', progress: 30 },
  { id: 3, title: 'قسمت سوم - نبرد نهایی', duration: '48 دقیقه', progress: 0 },
  { id: 4, title: 'قسمت چهارم - پایان داستان', duration: '52 دقیقه', progress: 0 },
])*/
interface MediaItem {
  id: string
  type: 'movie' | 'series'
  title: string
  description: string
  poster: string
  category: string
  slug: string
  duration: number
  ageRating:number
  rating: number
  year: number
  views: number
  status: string
}

const films = computed<MediaItem[]>(() =>
    movieStore.movies.map((film: any) => ({
      id: film.id,
      type: 'movie',
      title: film.title,
      description: film.description,
      poster: film.poster,
      category: film.category.title,
      slug: film.category.slug,
      duration: film.duration,
      rating: film.rating,
      ageRating:film.ageRating,
      year: film.year,
      views: film.views ?? 0,
      status: film.views > 15000 ? 'پر بازدید' : 'کم بازدید'
    }))
)

const series = computed<MediaItem[]>(() =>
    seriesStore.seriesList.map((s: any) => ({
      id: s.id,
      type: 'series',
      title: s.title,
      description: s.description,
      poster: s.poster,
      category: s.category.title,
      slug: s.category.slug,
      duration: s.duration ?? 0,
      ageRating: s.ageRating,
      rating: s.rating,
      year: s.year,
      views: s.views ?? 0,
      status: s.views > 15000 ? 'پر بازدید' : 'کم بازدید'
    }))
)


const allContents = computed<MediaItem[]>(() => [
  ...films.value,
  ...series.value
])

/*const relatedMovies = ref([
  { id: 1, title: 'فیلم مشابه اول', year: '2023' },
  { id: 2, title: 'فیلم مشابه دوم', year: '2022' },
  { id: 3, title: 'فیلم مشابه سوم', year: '2024' },
  { id: 4, title: 'فیلم مشابه چهارم', year: '2021' },
])*/
const relatedMovies = computed<MediaItem[]>(() => {
  if (!media.value) return []

  return allContents.value
      .filter(item =>
          item.id !== media.value!.id &&
          item.category === media.value!.category.title
      )
      .sort((a, b) => b.views - a.views) // محبوب‌ترها اول
      .slice(0, 4)
})


// Methods
const openLoginModal = () => {
  showLoginModal.value = true
}

const closeLoginModal = () => {
  showLoginModal.value = false
}

const login = () => {
  if (loginForm.value.username && loginForm.value.password) {
    // Simple demo login
    localStorage.setItem('userAuth', 'true')
    localStorage.setItem('username', loginForm.value.username)
    isAuthenticated.value = true
    showLoginModal.value = false
    
    // Reset form
    loginForm.value = { username: '', password: '' }
    
    showToast('با موفقیت وارد شدید!')
  } else {
    showToast('لطفاً تمام فیلدها را پر کنید')
  }
}

const logout = () => {
  localStorage.removeItem('userAuth')
  localStorage.removeItem('username')
  isAuthenticated.value = false
  showToast('با موفقیت خارج شدید')
}

const checkAuth = () => {
  const auth = localStorage.getItem('userAuth')
  isAuthenticated.value = auth === 'true'
}

const toggleSeasonDropdown = () => {
  showSeasonDropdown.value = !showSeasonDropdown.value
}

const selectSeason = (season:any,index: number) => {
  showSeasonDropdown.value = !showSeasonDropdown.value
  selectedSeasonIndex.value = index
  selectedSeason.value=season
  selectedEpisodeIndex.value = 0 // برگرد به قسمت اول
  showToast(`فصل ${seasons.value[index].number} انتخاب شد`)
}


const toggleProblemTypeDropdown = () => {
  problemTypeDropdownOpen.value = !problemTypeDropdownOpen.value
}

const getProblemTypeLabel = (value: string) => {
  const type = problemTypes.value.find(t => t.value === value)
  return type?.label || ''
}

const selectProblemType = (type: any) => {
  reportForm.value.type = type.value
  problemTypeDropdownOpen.value = false
}

const playEpisode = (index: number) => {

  selectedEpisodeIndex.value = index
  showEpisodeModal.value = true
  console.log('cp',currentEpisode.value)
  isPlaying.value = true

  showToast(
      `در حال پخش: ${episodes.value[index].title}`
  )
}


const closeEpisodeModal = () => {
  showEpisodeModal.value = false
  //selectedEpisodeIndex.value = 0
}
const mainPlayer = ref<any>(null)
const episodePlayer = ref<any>(null)

const onMainPlay = () => {
  // وقتی پلیر اصلی play شد، اپیزود pause
  episodePlayer.value?.pause?.()
}

const onEpisodePlay = () => {
  // وقتی اپیزود play شد، پلیر اصلی pause
  mainPlayer.value?.pause?.()
}


/*const startPlaying = () => {
  showEpisodeModal.value = false
  isPlaying.value = true
  isAuthenticated.value = true

  if (currentEpisode.value) {
    showToast(`در حال پخش: ${currentEpisode.value.title}`)
  }
}*/

/*const startPlaying = () => {
  const url = currentEpisode.value?.videoUrl
  if (!url || !videoPlayer.value) return

  const resumeTime = getEpisodeResumeTime()

  if (url.endsWith('.m3u8') && Hls.isSupported()) {
    const hls = new Hls()
    hls.loadSource(url)
    hls.attachMedia(videoPlayer.value)

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      if (resumeTime > 5) {
        videoPlayer.value!.currentTime = resumeTime
      }
      videoPlayer.value!.play()
    })
  } else {

    videoPlayer.value.src = url
    videoPlayer.value.load()

    videoPlayer.value.onloadedmetadata = () => {
      if (resumeTime > 5) {
        videoPlayer.value!.currentTime = resumeTime
      }
      videoPlayer.value!.play()
    }
  }
}*/



const reportProblem = () => {
  showReportModal.value = true
}

const closeReportModal = () => {
  showReportModal.value = false
  reportForm.value = { type: '', description: '' }
}
const reportStore = useReportStore()

const submitReport = async () => {
  if (!reportForm.value.type || !reportForm.value.description) {
    showToast('لطفاً تمام فیلدها را پر کنید')
    return
  }

  try {
    await reportStore.sendReport({
      mediaId:
          media.value?.type === 'movies'
              ? String(media.value.id)
              : String(currentEpisode.value?.id),

      mediaType:
          media.value?.type === 'movies'
              ? 'movie'
              : 'episode',

      problemType: reportForm.value.type,
      description: reportForm.value.description,
    })

    showToast('گزارش شما با موفقیت ارسال شد')
    closeReportModal()
  } catch (e) {
    console.error(e)
    showToast('خطا در ارسال گزارش')
  }
}


const showActorInfo = (actorId: string) => {
  showToast('اطلاعات بازیگر در حال بارگذاری...')
}

const showCrewInfo = (crewId: string) => {
  showToast('اطلاعات عوامل در حال بارگذاری...')
}

const addToWatchlist = () => {
  showToast('فیلم به لیست تماشا اضافه شد')
}
const downloadMovie = () => {
  if (!media.value) return

  const url =
      media.value.type === 'movies'
          ? media.value.videoLink
          : currentEpisode.value?.videoUrl

  if (!url) {
    showToast('لینک دانلود موجود نیست')
    return
  }

  const a = document.createElement('a')
  a.href = url
  a.download = `${media.value.title}.mp4`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

  showToast('دانلود آغاز شد')
}


const goToMovie = async (item: MediaItem) => {
  // اگر همونه، کاری نکن
  if (item.id === route.params.id) return

  showToast(`در حال انتقال به: ${item.title}`)

  // ذخیره پیشرفت اگر اپیزود در حال پخش است
  try {
    if (media.value?.type === 'series' && currentEpisode.value) {
      saveEpisodeProgress()
    }
  } catch (e) {}

  // ریست stateهای صفحه
  activeSeries.value = null
  selectedEpisodeIndex.value = 0
  selectedSeasonIndex.value = 0
  selectedSeason.value = null
  showEpisodeModal.value = false

  // تغییر route (کامپوننت همونه، فقط پارامتر عوض میشه)
  const router = useRouter()
  await router.push({
    params: {
      id: item.id
    }
  })

  // برگرد بالا
  window.scrollTo({ top: 0, behavior: 'smooth' })
}



const forgotPassword = () => {
  showToast('لینک بازیابی رمز عبور ارسال شد')
}

const openRegister = () => {
  showToast('صفحه ثبت نام در حال بارگذاری...')
}

const showToast = (message: string) => {
  notificationMessage.value = message
  showNotification.value = true
  setTimeout(() => {
    showNotification.value = false
  }, 3000)
}

const closeProblemTypeDropdown = (event: Event) => {
  if (!event.target || !problemTypeDropdownRef.value?.contains(event.target as Node)) {
    problemTypeDropdownOpen.value = false
  }
}

const videoConfig = computed(() => {
  if (!media.value) return undefined

  // 🎬 FILM
  if (media.value.type === 'movies') {
    const watched = mediaStore.getWatched(media.value.id, 'movie')
    return {
      mediaId:media.value.id,
      mediaType:'movie',
      url: media.value.videoLink,
      resumeTime: watched?.currentTime ?? 0,
      title: media.value.title,
      poster: media.value.poster,
      subtitles: media.value.language
          ? [{
            id: media.value.language,
            label: media.value.language === 'fa' ? 'فارسی' : media.value.language,
            language: media.value.language,
            url: `/subtitles/${media.value.id}-${media.value.language}.vtt`,
            default: true,
          }]
          : [],
      ads: [],
    }
  }

  // 📺 SERIES
  if (media.value.type === 'series') {
    if (!currentEpisode.value) return undefined

    const watched = mediaStore.getWatched(
        currentEpisode.value.id,
        'episode'
    )
    return {
      mediaId:currentEpisode.value.id,
      mediaType:'episode',
      url: currentEpisode.value.videoUrl,
      resumeTime: watched?.currentTime ?? 0,
      title: `${media.value.title} - قسمت ${currentEpisode.value.number}`,
      poster: media.value.poster,
      subtitles: [],
      ads: [],
    }
  }
})

// Lifecycle
onMounted(() => {
  const episodeData = seriesStore.findEpisodeById(route.params.id as string)

  if (episodeData) {
    activeSeries.value = episodeData.series
    selectedSeasonIndex.value = episodeData.seasonIndex
    selectedEpisodeIndex.value = episodeData.episodeIndex
    selectedSeason.value = episodeData.season
/*
    nextTick(() => {
      startPlaying()
    })*/
  }
  checkAuth()
  document.addEventListener('click', closeProblemTypeDropdown)
})
</script>

<style scoped>
/* Custom scrollbar for dropdowns */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb {
  background: rgba(202, 138, 4, 0.5);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(202, 138, 4, 0.7);
}

/* Smooth animations */
* {
  transition: all 0.3s ease;
}

/* Glass effect enhancements */
.backdrop-blur-lg {
  backdrop-filter: blur(16px);
}

/* Focus states */
input:focus {
  box-shadow: 0 0 0 3px rgba(202, 138, 4, 0.1);
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(202, 138, 4, 0.3);
}

/* Hover effects */
.group:hover {
  transform: translateY(-2px);
}

/* Notification animation */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.fixed.top-4.right-4 {
  animation: slideInRight 0.3s ease-out;
}
</style>
