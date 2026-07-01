<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <!-- Header with Actions -->
    <div class="max-w-4xl mx-auto mb-6 flex justify-between items-center px-4">
      <div class="flex items-center gap-4">
        <button
          @click="goBack"
          class="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <i class="ti ti-arrow-right"></i>
          بازگشت
        </button>
        <h1 class="text-3xl font-bold text-gray-900">فاکتور</h1>
      </div>
      <div class="flex gap-3">
        <button
          @click="printInvoice"
          class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i class="ti ti-printer"></i>
          چاپ
        </button>
        <button
          @click="downloadPDF"
          class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <i class="ti ti-download"></i>
          دانلود
        </button>
      </div>
    </div>

    <!-- Invoice Container -->
    <div ref="invoiceRef" class="max-w-4xl mx-auto bg-white shadow-lg">
      <!-- Invoice Header -->
      <div class="p-6 border-b border-gray-300">
        <div class="flex justify-between items-start">
          <!-- Left: Company Info -->
          <div class="flex items-center gap-4">
            <img src="/pet.png" alt="لوگو" class="w-20 h-20 object-contain border border-gray-300 rounded-lg p-2">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">پت مارکت پتومن</h2>
              <p class="text-sm text-gray-600 mt-1">مارکت‌پلیس حیوانات خانگی</p>
              <p class="text-xs text-gray-500 mt-1">تهران، ایران</p>
            </div>
          </div>

          <!-- Right: Invoice Details -->
          <div class="text-left">
            <h3 class="text-2xl font-bold text-gray-900 mb-3">فاکتور فروش</h3>
            <div class="mb-3 space-y-1">
              <p class="text-sm text-gray-700">شماره فاکتور: <span class="font-bold">{{ order.code }}</span></p>
              <p class="text-sm text-gray-700">تاریخ: <span class="font-semibold">{{ order.date }}</span></p>
              <p class="text-sm text-gray-700">
                وضعیت پرداخت: 
                <span v-if="order.isPaid" class="inline-block px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">پرداخت شده</span>
                <span v-else class="inline-block px-3 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">پرداخت نشده</span>
              </p>
            </div>
            <!-- Barcode -->
            <div class="flex justify-end mt-3" v-html="barcodeHTML"></div>
          </div>
        </div>
      </div>

      <!-- Seller and Buyer Info -->
      <div class="grid grid-cols-2 border-b border-gray-300">
        <!-- Seller -->
        <div class="p-6 border-l border-gray-300">
          <h4 class="text-sm font-bold text-gray-900 mb-3 pb-2 border-b border-gray-300">فروشنده</h4>
          <div class="space-y-2">
            <div class="flex">
              <span class="text-xs text-gray-600 w-20">نام:</span>
              <span class="text-sm text-gray-900 font-medium">پت مارکت پتومن</span>
            </div>
            <div class="flex">
              <span class="text-xs text-gray-600 w-20">آدرس:</span>
              <span class="text-sm text-gray-900">تهران</span>
            </div>
            <div class="flex">
              <span class="text-xs text-gray-600 w-20">شماره ثبت:</span>
              <span class="text-sm text-gray-900">-</span>
            </div>
            <div class="flex">
              <span class="text-xs text-gray-600 w-20">تلفن:</span>
              <span class="text-sm text-gray-900">021-12345678</span>
            </div>
          </div>
        </div>
        
        <!-- Buyer -->
        <div class="p-6">
          <h4 class="text-sm font-bold text-gray-900 mb-3 pb-2 border-b border-gray-300">خریدار</h4>
          <div class="space-y-2">
            <div class="flex">
              <span class="text-xs text-gray-600 w-20">نام:</span>
              <span class="text-sm text-gray-900 font-medium">{{ order.customer }}</span>
            </div>
            <div class="flex">
              <span class="text-xs text-gray-600 w-20">موبایل:</span>
              <span class="text-sm text-gray-900">{{ order.phone }}</span>
            </div>
            <div class="flex">
              <span class="text-xs text-gray-600 w-20">تاریخ خرید:</span>
              <span class="text-sm text-gray-900">{{ order.date }}</span>
            </div>
            <div class="flex">
              <span class="text-xs text-gray-600 w-20">ایمیل:</span>
              <span class="text-sm text-gray-900">info@petoman.com</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div class="p-6">
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-3 py-4 text-center text-sm font-bold">ردیف</th>
              <th class="border border-gray-300 px-3 py-4 text-right text-sm font-bold">شرح کالا/خدمات</th>
              <th class="border border-gray-300 px-3 py-4 text-center text-sm font-bold">تعداد</th>
              <th class="border border-gray-300 px-3 py-4 text-center text-sm font-bold">قیمت واحد</th>
              <th class="border border-gray-300 px-3 py-4 text-center text-sm font-bold">جمع کل</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in itemsWithPrice" :key="index">
              <td class="border border-gray-300 px-3 py-4 text-center text-sm align-middle">{{ index + 1 }}</td>
              <td class="border border-gray-300 px-3 py-4 text-right text-sm align-middle">{{ item.name }}</td>
              <td class="border border-gray-300 px-3 py-4 text-center text-sm align-middle">{{ item.quantity }}</td>
              <td class="border border-gray-300 px-3 py-4 text-center text-sm align-middle">{{ formatPrice(item.price) }}</td>
              <td class="border border-gray-300 px-3 py-4 text-center text-sm font-semibold align-middle">{{ formatPrice(item.price * item.quantity) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Totals Section -->
      <div class="px-6 pb-6">
        <div class="bg-gray-50 p-4">
          <div class="grid grid-cols-2 gap-3 max-w-md mr-auto">
            <div class="text-right">
              <span class="text-sm text-gray-700">جمع کل:</span>
            </div>
            <div class="text-left">
              <span class="text-sm text-gray-900 font-semibold">{{ formatPrice(subtotal) }}</span>
            </div>

            <div class="text-right">
              <span class="text-sm text-gray-700">مالیات بر ارزش افزوده (9%):</span>
            </div>
            <div class="text-left">
              <span class="text-sm text-gray-900 font-semibold">{{ formatPrice(tax) }}</span>
            </div>

            <div class="text-right">
              <span class="text-sm text-gray-700">تخفیف:</span>
            </div>
            <div class="text-left">
              <span class="text-sm text-gray-900 font-semibold">{{ formatPrice(discount) }}</span>
            </div>

            <div class="text-right pt-3 border-t-2 border-gray-300">
              <span class="text-base text-gray-900 font-bold">مبلغ قابل پرداخت:</span>
            </div>
            <div class="text-left pt-3 border-t-2 border-gray-300">
              <span class="text-xl text-gray-900 font-bold">{{ formatPrice(finalTotal) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Notes Section -->
      <div class="px-6 pb-6" v-if="order.note">
        <div class="border border-gray-300 p-4 bg-yellow-50">
          <p class="text-xs text-gray-600 font-bold mb-2">یادداشت:</p>
          <p class="text-sm text-gray-800 leading-relaxed">{{ order.note }}</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 text-center border-t border-gray-300 bg-gray-50">
        <p class="text-xs text-gray-700">با تشکر از خرید شما - پت مارکت پتومن</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const invoiceRef = ref(null)
const order = ref({})
const barcodeHTML = ref('')

const itemsWithPrice = ref([])
const subtotal = ref(0)
const discount = ref(0)
const tax = ref(0)
const finalTotal = ref(0)

// Format price in Persian
const formatPrice = (price) => {
  return new Intl.NumberFormat('fa-IR', {
    style: 'currency',
    currency: 'IRR',
    minimumFractionDigits: 0
  }).format(price)
}

// Generate Barcode
const generateBarcode = (code) => {
  const barcodeText = code.replace(/[^\x00-\x7F]/g, '').substring(0, 20)

  const code128B = {
    ' ': '11011001100', '!': '11001101100', '"': '11001100110', '#': '10010011000',
    '$': '10010001100', '%': '10001001100', '&': '10011001000', "'": '10011000100',
    '(': '10001100100', ')': '11001001000', '*': '11001000100', '+': '11000100100',
    ',': '10110011100', '-': '10011011100', '.': '10011001110', '/': '10111001100',
    '0': '10011101100', '1': '10011100110', '2': '11001110010', '3': '11001011100',
    '4': '11001001110', '5': '11011100100', '6': '11001110100', '7': '11101101110',
    '8': '11101001100', '9': '11100101100', ':': '11100100110', ';': '11101100100',
    '<': '11100110100', '=': '11100110010', '>': '11011011000', '?': '11011000110',
    '@': '11000110110', 'A': '10100011000', 'B': '10001011000', 'C': '10001000110',
    'D': '10110001000', 'E': '10001101000', 'F': '10001100010', 'G': '11010001000',
    'H': '11000101000', 'I': '11000100010', 'J': '10110111000', 'K': '10110001110',
    'L': '10001101110', 'M': '10111011000', 'N': '10111000110', 'O': '10001110110',
    'P': '11101110110', 'Q': '11010001110', 'R': '11000101110', 'S': '11011101000',
    'T': '11011100010', 'U': '11011101110', 'V': '11101011000', 'W': '11101000110',
    'X': '11100010110', 'Y': '11101101000', 'Z': '11101100010'
  }

  const startB = '11010010000'
  let pattern = startB

  for (let i = 0; i < barcodeText.length; i++) {
    const char = barcodeText[i]
    pattern += (code128B[char] || code128B['0'])
  }

  pattern += '1100011101011'

  let x = 0
  const barWidth = 1.5
  let bars = ''

  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === '1') {
      bars += `<rect width="${barWidth}" height="40" x="${x}" y="0" fill="#000"/>`
    }
    x += barWidth
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${x}" height="50" viewBox="0 0 ${x} 50" style="max-width: 150px; height: auto;">${bars}</svg>`
}

// Load order data from query or route params
const loadOrderData = () => {
  try {
    const orderData = route.query.order ? JSON.parse(decodeURIComponent(route.query.order)) : {}
    
    order.value = orderData
    barcodeHTML.value = generateBarcode(orderData.code || '')

    const totalAmount = orderData.total || 0
    
    itemsWithPrice.value = (orderData.items || []).map(item => ({
      ...item,
      price: item.price || Math.floor(totalAmount / (orderData.items?.reduce((sum, i) => sum + i.quantity, 0) || 1))
    }))

    subtotal.value = totalAmount
    discount.value = 0
    tax.value = Math.floor(totalAmount * 0.09)
    finalTotal.value = subtotal.value - discount.value + tax.value
  } catch (error) {
    console.error('Error loading order data:', error)
    notification.error('خطا', 'خطا در بارگذاری اطلاعات فاکتور')
  }
}

// Go back to previous page
const goBack = () => {
  window.history.back()
}

// Print invoice
const printInvoice = () => {
  window.print()
}

// Download as PDF
const downloadPDF = async () => {
  try {
    const html2canvas = (await import('html2canvas')).default
    const { jsPDF } = await import('jspdf')

    const canvas = await html2canvas(invoiceRef.value, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const imgWidth = 210
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
    pdf.save(`فاکتور-${order.value.code}.pdf`)

    notification.success('موفق', 'فاکتور به صورت PDF دانلود شد!')
  } catch (error) {
    console.error('Error downloading PDF:', error)
    notification.error('خطا', 'خطا در دانلود فاکتور')
  }
}

onMounted(() => {
  loadOrderData()
})
</script>

<style scoped>
@media print {
  body {
    margin: 0;
    padding: 0;
  }
  
  .max-w-4xl {
    max-width: 100%;
  }
  
  /* Hide header with buttons */
  .mb-6 {
    display: none !important;
  }
  
  .bg-gray-100 {
    background: white !important;
  }
  
  .shadow-lg {
    box-shadow: none !important;
  }
  
  .py-8 {
    padding: 0 !important;
  }
}
</style>


