<template>
  <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
    <div class="flex items-center justify-around h-16 px-2">
      <!-- Home -->
      <NuxtLink 
        to="/" 
        class="nav-item"
        :class="{ 'active': isActive('/') }"
      >
        <svg v-if="isActive('/')" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
          <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span class="nav-label">خانه</span>
      </NuxtLink>

      <!-- Categories -->
      <NuxtLink 
        to="/categories" 
        class="nav-item"
        :class="{ 'active': isActive('/categories') }"
      >
        <svg v-if="isActive('/categories')" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clip-rule="evenodd" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <span class="nav-label">دسته‌ها</span>
      </NuxtLink>

      <!-- Search (Center with FAB style) -->
      <NuxtLink 
        to="/search" 
        class="nav-item-fab"
        :class="{ 'active': isActive('/search') }"
      >
        <div class="fab-button">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </NuxtLink>

      <!-- Bookmark -->
      <NuxtLink 
        to="/profile?tab=bookmarked" 
        class="nav-item"
        :class="{ 'active': isActive('/profile?tab=bookmarked') }"
      >
        <svg v-if="isActive('/profile?tab=bookmarked')" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clip-rule="evenodd" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <span class="nav-label">ذخیره‌ها</span>
      </NuxtLink>

      <!-- Profile -->
      <NuxtLink 
        to="/profile" 
        class="nav-item"
        :class="{ 'active': isActive('/profile') }"
      >
        <svg v-if="isActive('/profile')" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span class="nav-label">پروفایل</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  
  // Check for query parameters
  if (path.includes('?')) {
    const [routePath, queryString] = path.split('?')
    const params = new URLSearchParams(queryString)
    const tabParam = params.get('tab')
    
    return route.path === routePath && route.query.tab === tabParam
  }
  
  // For profile without query, check if path is profile and no tab query
  if (path === '/profile') {
    return route.path === '/profile' && !route.query.tab
  }
  
  return route.path.startsWith(path)
}
</script>

<style scoped>
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  color: #6b7280;
  transition: all 0.2s;
  position: relative;
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
}

.nav-item:active {
  transform: scale(0.95);
}

.nav-item.active {
  color: #ea580c;
}

.nav-label {
  font-size: 0.75rem;
  font-weight: 500;
}

.nav-item-fab {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -2rem;
  position: relative;
}

.fab-button {
  width: 3.5rem;
  height: 3.5rem;
  background: linear-gradient(to bottom right, #f97316, #ea580c);
  color: white;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.fab-button:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.fab-button:active {
  transform: scale(0.95);
}

.nav-item-fab.active .fab-button {
  background: linear-gradient(to bottom right, #ea580c, #c2410c);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  transform: scale(1.1);
}

/* Animation for active state */
.nav-item.active {
  animation: bounce-in 0.3s ease-out;
}

@keyframes bounce-in {
  0% {
    transform: scale(0.9);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
