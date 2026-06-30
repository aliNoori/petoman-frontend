import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useOrdersStore = defineStore('orders', () => {
  // همه سفارشات (دارو و محصول یکی شده)
  const orders = ref([
    {
      id: 1,
      code: 'ORD-1001',
      type: 'medicine',
      owner: 'علی محمدی',
      phone: '0912-345-6789',
      pet: 'ماکس',
      petType: 'سگ',
      items: 'آنتی‌بیوتیک آموکسی‌سیلین',
      dosage: '500mg - دو بار در روز',
      hasPrescription: true,
      date: '1403/09/10',
      status: 'pending',
      isPaid: false,
      total: 450000,
      address: 'تهران، ونک'
    },
    {
      id: 2,
      code: 'ORD-1002',
      type: 'product',
      owner: 'فاطمه احمدی',
      phone: '0913-456-7890',
      pet: 'میلو',
      petType: 'گربه',
      items: 'غذای خشک گربه رویال کنین 2 کیلویی',
      hasPrescription: false,
      date: '1403/09/10',
      status: 'pending',
      isPaid: false,
      total: 850000,
      address: 'تهران، سعادت آباد'
    },
    {
      id: 3,
      code: 'ORD-1003',
      type: 'medicine',
      owner: 'محمد رضایی',
      phone: '0914-567-8901',
      pet: 'راکی',
      petType: 'سگ',
      items: 'مسکن ترامادول، ویتامین B کمپلکس',
      dosage: '50mg - سه بار در روز',
      hasPrescription: true,
      date: '1403/09/09',
      status: 'processing',
      isPaid: true,
      total: 250000,
      address: 'تهران، تجریش'
    },
    {
      id: 4,
      code: 'ORD-1004',
      type: 'product',
      owner: 'زهرا کریمی',
      phone: '0915-678-9012',
      pet: 'لونا',
      petType: 'گربه',
      items: 'شامپو ضد کک، اسباب بازی موش',
      hasPrescription: false,
      date: '1403/09/08',
      status: 'delivered',
      isPaid: true,
      total: 380000,
      address: 'کرج، مهرشهر'
    },
    {
      id: 5,
      code: 'ORD-1005',
      type: 'medicine',
      owner: 'حسین نوری',
      phone: '0916-789-0123',
      pet: 'باکی',
      petType: 'سگ',
      items: 'قرص ضد انگل',
      dosage: 'ماهی یکبار',
      hasPrescription: false,
      date: '1403/09/07',
      status: 'ready',
      isPaid: true,
      total: 95000,
      address: 'تهران، پاسداران'
    },
    {
      id: 6,
      code: 'ORD-1006',
      type: 'product',
      owner: 'مریم حسینی',
      phone: '0917-890-1234',
      pet: 'چارلی',
      petType: 'سگ',
      items: 'قلاده چرمی، غذای تر سگ',
      hasPrescription: false,
      date: '1403/09/06',
      status: 'shipped',
      isPaid: true,
      total: 620000,
      address: 'اصفهان، خیابان چهارباغ'
    }
  ])

  // اضافه کردن سفارش جدید
  const addOrder = (order) => {
    const newOrder = {
      id: Date.now(),
      code: order.code,
      type: order.type || 'medicine',
      owner: order.customerName || order.owner,
      phone: order.phone || '0912-XXX-XXXX',
      pet: order.petName || order.pet || 'نامشخص',
      petType: order.petType || 'نامشخص',
      items: order.items,
      dosage: order.dosage || '',
      hasPrescription: order.hasPrescription || false,
      date: new Date().toLocaleDateString('fa-IR'),
      status: 'confirmed',
      isPaid: order.isPaid || false,
      total: order.total,
      address: order.address,
      notes: order.notes,
      subtotal: order.subtotal,
      shipping: order.shipping
    }
    
    orders.value.unshift(newOrder)
    return newOrder
  }

  // آپدیت وضعیت سفارش
  const updateOrderStatus = (orderId, status) => {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = status
    }
  }

  // فیلتر سفارشات
  const getOrdersByType = (type) => {
    if (!type) return orders.value
    return orders.value.filter(o => o.type === type)
  }

  const getOrdersByStatus = (status) => {
    if (!status) return orders.value
    return orders.value.filter(o => o.status === status)
  }

  // Computed
  const medicineOrders = computed(() => orders.value.filter(o => o.type === 'medicine'))
  const productOrders = computed(() => orders.value.filter(o => o.type === 'product'))
  const pendingOrders = computed(() => orders.value.filter(o => o.status === 'pending'))
  const confirmedOrders = computed(() => orders.value.filter(o => o.status === 'confirmed'))
  const totalOrders = computed(() => orders.value.length)

  // Get single order by ID
  const getOrderById = (id) => {
    return orders.value.find(o => o.id === parseInt(id))
  }

  return {
    orders,
    medicineOrders,
    productOrders,
    pendingOrders,
    confirmedOrders,
    totalOrders,
    addOrder,
    updateOrderStatus,
    getOrdersByType,
    getOrdersByStatus,
    getOrderById
  }
})
