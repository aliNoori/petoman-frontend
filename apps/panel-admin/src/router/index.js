import { createRouter, createWebHistory } from 'vue-router'

// Pharmacy Panel Routes
const pharmacyRoutes = [
  {
    path: '/pharmacies',
    component: () => import('@/layouts/pharmacy.vue'),
    meta: { panelType: 'PHARMACY' }, // <--- اضافه شده
    children: [
      { path: '', name: 'pharmacy-dashboard', component: () => import('@/views/pharmacies/index.vue') },
      { path: 'login', name: 'pharmacy-login', component: () => import('@/views/pharmacies/login.vue') },
      { path: 'orders', name: 'pharmacy-orders', component: () => import('@/views/pharmacies/orders.vue') },
      { path: 'medicine-orders', name: 'pharmacy-medicine-orders', component: () => import('@/views/pharmacies/medicine-orders.vue') },
      { path: 'medicine-orders/:id', name: 'pharmacy-medicine-order-detail', component: () => import('@/views/pharmacies/medicine-orders/[id].vue') },
      { path: 'orders/:id', name: 'pharmacy-order-detail', component: () => import('@/views/pharmacies/medicine-orders/[id].vue') },
      { path: 'products', name: 'pharmacy-products', component: () => import('@/views/pharmacies/products/index.vue') },
      { path: 'products/add-medicine', name: 'pharmacy-products-add-medicine', component: () => import('@/views/pharmacies/products/add-medicine.vue') },
      { path: 'products/add-shop', name: 'pharmacy-products-add-shop', component: () => import('@/views/pharmacies/products/add-shop.vue') },
      { path: 'products/categories', name: 'pharmacy-products-categories', component: () => import('@/views/pharmacies/products/categories.vue') },
      { path: 'products/attributes', name: 'pharmacy-products-attributes', component: () => import('@/views/pharmacies/products/attributes.vue') },
      { path: 'products/orders', name: 'pharmacy-product-orders', component: () => import('@/views/pharmacies/products/product-orders.vue') },
      { path: 'products/edit/:id', name: 'pharmacy-product-edit', component: () => import('@/views/pharmacies/products/edit-[id].vue') },
      { path: 'products/:id', name: 'pharmacy-product-detail', component: () => import('@/views/pharmacies/products/[id].vue') },
      { path: 'settings', name: 'pharmacy-settings', component: () => import('@/views/pharmacies/settings.vue') },
      { path: 'financial', name: 'pharmacy-financial', component: () => import('@/views/pharmacies/financial.vue') },
      { path: 'reviews', name: 'pharmacy-reviews', component: () => import('@/views/pharmacies/reviews.vue') },
      { path: 'reports', name: 'pharmacy-reports', component: () => import('@/views/pharmacies/reports.vue') },
      { path: 'notifications', name: 'pharmacy-notifications', component: () => import('@/views/pharmacies/notifications.vue') },
      { path: 'support', name: 'pharmacy-support', component: () => import('@/views/pharmacies/support.vue') },
      { path: 'documents', name: 'pharmacy-documents', component: () => import('@/views/pharmacies/documents.vue') },
      { path: 'faq', name: 'pharmacy-faq', component: () => import('@/views/pharmacies/faq.vue') },
    ]
  }
]

// Clinic & Vet Panel Routes (یکی شده)
const clinicVetRoutes = [
  {
    path: '/clinic',
    component: () => import('@/layouts/clinic-vet.vue'),
    meta: { panelType: ['VET', 'CLINIC'] },
    children: [
      { path: '', name: 'clinic-dashboard', component: () => import('@/views/clinics/index.vue') },
      { path: 'appointments', name: 'clinic-appointments', component: () => import('@/views/clinics/appointments.vue') },
      { path: 'appointments/table', name: 'clinic-appointments-table', component: () => import('@/views/clinics/appointments-table.vue') },
      { path: 'appointments/calendar', name: 'clinic-appointments-calendar', component: () => import('@/views/clinics/appointments-calendar.vue') },
      { path: 'urgent-requests', name: 'clinic-urgent-requests', component: () => import('@/views/clinics/urgent-requests.vue') },
      { path: 'services', name: 'clinic-services', component: () => import('@/views/clinics/services.vue') },
      { path: 'financial', name: 'clinic-financial', component: () => import('@/views/clinics/finance.vue') },
      { path: 'reviews', name: 'clinic-reviews', component: () => import('@/views/clinics/reviews.vue') },
      { path: 'settings', name: 'clinic-settings', component: () => import('@/views/clinics/settings.vue') },
      { path: 'support', name: 'clinic-support', component: () => import('@/views/clinics/support.vue') },
      { path: 'faq', name: 'clinic-faq', component: () => import('@/views/clinics/faq.vue') },
    ]
  },
  // Chat routes - with separate layout (like user chat)
  {
    path: '/clinics/chat',
    component: () => import('@/layouts/clinic-chat.vue'),
    meta: { panelType: ['VET', 'CLINIC'] }, // <--- اضافه شده
    children: [
      { path: '', name: 'clinic-chat-list', component: () => import('@/views/clinics/chat/index.vue') },
      { path: ':id', name: 'clinic-chat', component: () => import('@/views/clinics/chat/[id].vue') },
    ]
  },
  // ریدایرکت مسیرهای قدیمی
  { path: '/clinic/finance', redirect: '/clinic/financial' },
  { path: '/clinic/chat', redirect: '/clinics/chat' },
  { path: '/clinic/chat/:id', redirect: to => `/clinics/chat/${to.params.id}` },
  { path: '/vets', redirect: '/clinic' },
  { path: '/vets/:pathMatch(.*)*', redirect: to => `/clinic/${to.params.pathMatch}` },
]

// Market Panel Routes
const marketRoutes = [
  // Print invoice outside layout for clean printing
  {
    path: '/markets/orders/print-invoice',
    name: 'market-orders-print',
    component: () => import('@/views/markets/orders/print-invoice.vue'),
    meta: { panelType: 'MARKET' }, // <--- اضافه شده
  },
  {
    path: '/markets/products/print-invoice',
    name: 'market-products-print',
    component: () => import('@/views/markets/products/print-invoice.vue'),
    meta: { panelType: 'MARKET' }, // <--- اضافه شده
  },
  {
    path: '/markets',
    component: () => import('@/layouts/market.vue'),
    meta: { panelType: 'MARKET' }, // <--- اضافه شده
    children: [
      { path: '', name: 'market-dashboard', component: () => import('@/views/markets/index.vue') },
      { path: 'login', name: 'market-login', component: () => import('@/views/markets/login.vue') },
      { path: 'orders', name: 'market-orders', component: () => import('@/views/markets/orders.vue') },
      { path: 'products', name: 'market-products', component: () => import('@/views/markets/products/index.vue') },
      { path: 'products/add', name: 'market-products-add', component: () => import('@/views/markets/products/add-shop.vue') },
      { path: 'products/add-shop', name: 'market-products-add-shop', component: () => import('@/views/markets/products/add-shop.vue') },
      { path: 'products/orders', name: 'market-product-orders', component: () => import('@/views/markets/products/product-orders.vue') },
      { path: 'reviews', name: 'market-reviews', component: () => import('@/views/markets/reviews.vue') },
      { path: 'financial', name: 'market-financial', component: () => import('@/views/markets/financial.vue') },
      { path: 'settings', name: 'market-settings', component: () => import('@/views/markets/settings.vue') },
      { path: 'documents', name: 'market-documents', component: () => import('@/views/markets/documents.vue') },
      { path: 'notifications', name: 'market-notifications', component: () => import('@/views/markets/notifications.vue') },
      { path: 'support', name: 'market-support', component: () => import('@/views/markets/support.vue') },
      { path: 'faq', name: 'market-faq', component: () => import('@/views/markets/faq.vue') },
    ]
  }
]

// User Panel Routes (پنل کاربری)
const userRoutes = [
  {
    path: '/users',
    component: () => import('@/layouts/user.vue'),
    children: [
      { path: '', name: 'user-dashboard', component: () => import('@/views/users/index.vue') },
      { path: 'visits', name: 'user-visits', component: () => import('@/views/users/visits.vue') },
      { path: 'orders', name: 'user-orders', component: () => import('@/views/users/orders.vue') },
      { path: 'notifications', name: 'user-notifications', component: () => import('@/views/users/notifications.vue') },
    ]
  },
  // Chat routes - with separate layout
  {
    path: '/users/chat',
    component: () => import('@/layouts/user-chat.vue'),
    children: [
      { path: '', name: 'user-chat', component: () => import('@/views/users/chat.vue') },
      { path: ':doctorId', name: 'user-chat-doctor', component: () => import('@/views/users/chat/[doctorId].vue') },
    ]
  }
]

// Admin Panel Routes
const adminRoutes = [
  {
    path: '/admin',
    component: () => import('@/layouts/admin.vue'),
    meta: { panelType: 'ADMIN' }, // <--- اضافه شده
    children: [
      { path: '', name: 'admin-dashboard', component: () => import('@/views/admin/index.vue') },
      { path: 'users', name: 'admin-users', component: () => import('@/views/admin/users.vue') },
      { path: 'roles', name: 'admin-roles', component: () => import('@/views/admin/roles.vue') },
      { path: 'clinics', name: 'admin-clinics', component: () => import('@/views/admin/clinics.vue') },
      { path: 'markets', name: 'admin-markets', component: () => import('@/views/admin/markets.vue') },
      { path: 'pharmacies', name: 'admin-pharmacies', component: () => import('@/views/admin/pharmacies.vue') },
      { path: 'products', name: 'admin-products', component: () => import('@/views/admin/products.vue') },
      { path: 'orders', name: 'admin-orders', component: () => import('@/views/admin/orders.vue') },
      { path: 'pending', name: 'admin-pending', component: () => import('@/views/admin/pending.vue') },
      { path: 'finance', name: 'admin-finance', component: () => import('@/views/admin/finance.vue') },
      { path: 'store-finance', name: 'admin-store-finance', component: () => import('@/views/admin/store-finance.vue') },
      { path: 'faq', name: 'admin-faq', component: () => import('@/views/admin/faq.vue') },
      { path: 'reports', name: 'admin-reports', component: () => import('@/views/admin/reports.vue') },
      { path: 'tickets', name: 'admin-tickets', component: () => import('@/views/admin/tickets.vue') },
      { path: 'settings', name: 'admin-settings', component: () => import('@/views/admin/settings.vue') },
    ]
  }
]

// Auth Routes
const authRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { guest: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/pharmacies'
    },
    ...authRoutes,
    ...pharmacyRoutes,
    ...clinicVetRoutes, // کلینیک فعال شد
    ...marketRoutes,
    ...userRoutes,
    ...adminRoutes,
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFound.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {

  const isAuthenticated = localStorage.getItem('auth_token')
  let adminPanelType = localStorage.getItem('admin_panel_type')

  // اصلاح ۱: اگر مقدار رشته‌ای 'null' است، آن را خالی کن
  if (adminPanelType === 'null' || adminPanelType === 'undefined') {
    adminPanelType = null
  }

  // ۱. اگر مسیر نیاز به احراز هویت ندارد (مثل لاگین)
  const isGuestRoute = to.meta.guest || to.name === 'login'

  if (!isGuestRoute && !isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  // ۲. اگر کاربر لاگین است اما نوع پنل او مشخص نیست (null)
  // این بخش خیلی مهم است تا از لوپ جلوگیری شود
  if (isAuthenticated && !adminPanelType) {
    // اگر کاربر در صفحه لاگین نیست، او را به لاگین بفرست تا دوباره لاگین کند و نوع پنلش مشخص شود
    if (to.name !== 'login') {
      next({ name: 'login' })
      return
    }
  }

  // ۳. اگر کاربر لاگین است و می‌خواهد به صفحه لاگین برود
  if (isGuestRoute && isAuthenticated && adminPanelType) {
    if (adminPanelType === 'ADMIN') next({ name: 'admin' })
    else if (adminPanelType === 'PHARMACY') next({ name: 'pharmacies' })
    else if (adminPanelType === 'MARKET') next({ name: 'markets' })
    else if (adminPanelType === 'VET' || adminPanelType === 'CLINIC') next({ name: 'clinic-dashboard' })
    else next('/')
    return
  }
  let hasAccess = false
  // ۴. بررسی دسترسی به پنل‌ها
  if (isAuthenticated && adminPanelType && to.meta.panelType) {
    const routePanelType = to.meta.panelType


    // اگر panelType یک آرایه است (مثل ['VET', 'CLINIC'])
    if (Array.isArray(routePanelType)) {
      hasAccess = routePanelType.includes(adminPanelType)
    }
    // اگر panelType یک رشته معمولی است (مثل 'ADMIN')
    else {
      hasAccess = adminPanelType === routePanelType
    }

    if (!hasAccess) {
      console.warn(`Access Denied: User is ${adminPanelType} but route requires ${JSON.stringify(routePanelType)}`)

      // ریدایرکت به صفحه اصلی خودش
      if (adminPanelType === 'ADMIN') next({ name: 'admin' })
      else if (adminPanelType === 'PHARMACY') next({ name: 'pharmacies' })
      else if (adminPanelType === 'MARKET') next({ name: 'markets' })
      else if (adminPanelType === 'VET' || adminPanelType === 'CLINIC') next({ name: 'clinic-dashboard' })
      else next({ name: 'login' })
      return
    }
  }

  next()
})
export default router
