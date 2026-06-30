<template>
  <div class="invoice-document">
    <div class="document-container">
      <div class="document-content">

        <!-- Header -->
        <header class="document-header">
          <div class="header-content">
            <div class="header-left">
              <img src="~/assets/pet.png" alt="پتومن" class="logo" />
              <span class="company-name">پتومن</span>
            </div>
            <div class="header-center">
              <h1 class="invoice-title">فاکتور فروش</h1>
            </div>
            <div class="header-right">
              <div class="invoice-info">
                <div class="info-line">
                  <span>شماره: {{ orderData?.orderCode }}</span>
                </div>
                <div class="info-line">
                  <span>تاریخ: {{ new Date (orderData?.createdAt).toLocaleDateString('fa-IR') }}</span>
                </div>
                <div class="info-line">
                  <span>وضعیت: {{ orderData?.status === 'CUSTOMER_PAID' ? 'پرداخت شده' : 'در انتظار پرداخت' }}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- Parties -->
        <section class="parties-section">
          <div class="parties-grid">
            <!-- Seller -->
            <div class="party-card">
              <h3 class="party-header">مشخصات فروشنده</h3>
              <div class="party-info">
                <div class="info-row">
                  <span class="info-label">نام شرکت:</span>
                  <span class="info-value">{{ orderData?.tenant?.ownerName }}</span>
                </div>
                <!-- اگر شماره ثبت هم در استور دارید می‌توانید اضافه کنید -->
                <div class="info-row">
                  <span class="info-label">شماره تماس:</span>
                  <span class="info-value">{{ orderData?.tenant?.phone }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">آدرس:</span>
                  <span class="info-value">{{ orderData?.tenant?.tenantAddress?.fullAddress }}</span>
                </div>
              </div>
            </div>

            <!-- Buyer -->
            <div class="party-card">
              <h3 class="party-header">مشخصات خریدار</h3>
              <div class="party-info">
                <div class="info-row">
                  <span class="info-label">نام:</span>
                  <span class="info-value">{{ orderData?.metadata?.customerInfo?.firstName }} {{ orderData?.metadata?.customerInfo?.lastName }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">شماره تماس:</span>
                  <span class="info-value">{{ orderData?.metadata?.customerInfo?.phone }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">آدرس:</span>
                  <span class="info-value">{{ orderData?.address?.displayName }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Products Table -->
        <section class="products-section">
          <h2 class="section-title">جدول محصولات</h2>
          <div class="table-container">
            <table class="professional-table">
              <thead>
              <tr>
                <th>ردیف</th>
                <th>شرح کالا</th>
                <th>تعداد</th>
                <th>قیمت واحد (تومان)</th>
                <th>مبلغ کل (تومان)</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in orderData?.items" :key="item.id">
                <td>{{ index + 1 }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ formatPrice(item.price) }}</td>
                <td>{{ formatPrice(item.price * item.quantity) }}</td>
              </tr>
              <tr v-if="!orderData?.items || orderData?.items.length === 0">
                <td colspan="5" style="text-align: center;">محصولی یافت نشد</td>
              </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Financial Summary -->
        <section class="financial-section">
          <div class="financial-container">
            <div class="financial-table">
              <div class="financial-row">
                <span class="financial-label">مبلغ کل:</span>
                <span class="financial-value">{{ formatPrice(subtotal) }} تومان</span>
              </div>
              <div class="financial-row">
                <span class="financial-label">هزینه ارسال:</span>
                <span class="financial-value">{{ formatPrice(shippingCost) }} تومان</span>
              </div>
              <div class="financial-row total-row">
                <span class="financial-label">مبلغ قابل پرداخت:</span>
                <span class="financial-value">{{ formatPrice(orderData?.totalAmount) }} تومان</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Footer -->
        <footer class="document-footer">
          <div class="footer-content">
            <div class="footer-contact">
              <h4>اطلاعات تماس</h4>
              <p>{{ orderData?.tenant?.tenantAddress?.fullAddress }}</p>
              <p>تلفن: {{ orderData?.tenant?.phone }}</p>
            </div>
            <div class="signature-box">
              <p>مهر و امضای فروشنده</p>
            </div>
          </div>
        </footer>
      </div>
    </div>

    <!-- Print Controls -->
    <ClientOnly>
      <div class="print-controls">
        <NuxtLink to="/pharmacy" class="back-btn">
          بازگشت
        </NuxtLink>
        <button @click="downloadInvoice" class="download-btn">
          دانلود PDF
        </button>
        <button @click="printInvoice" class="print-btn">
          چاپ فاکتور
        </button>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup>
import {useTenantStore} from "~/stores/tenant.store";
import {useOrderStore} from "~/stores/order.store";
import {ref,onMounted} from "vue";

definePageMeta({
  layout: 'print'
})
const searchOrderId = ref('');
const orderStore=useOrderStore()
const tenantStore = useTenantStore()
const route = useRoute()
const router = useRouter()

// دریافت اطلاعات فاکتور از localStorage
const orderData = ref()

// تغییر: تبدیل computed به ref معمولی
const pharmacyInfo = ref({
  name: 'شرکت پتومن پارس',
  address: 'تهران، خیابان ولیعصر، پلاک ۱۲۳',
  phone: '۰۲۱-۸۸۹۹۰۰۱۱',
  logo: null
})

// تابعی برای لود کردن اطلاعات داروخانه
const loadPharmacyInfo = async (sellerId) => {
  if (!sellerId) return

  console.log('Loading pharmacy for ID:', sellerId)

  // اطمینان از اینکه لیست تننت‌ها لود شده است
  // اگر استور شما از Pinia استفاده می‌کند و قبلاً لود نشده، این کار ضروری است
  if (!tenantStore.tenants || tenantStore.tenants.length === 0) {
    await tenantStore.fetchTenants()
  }

  const ph = tenantStore.getTenantById(String(sellerId))

  if (ph) {
    // استخراج تنظیمات اختصاصی
    const pharmacyInfoSetting = (ph.settings || []).find(item => item.key === 'pharmacyInfo')?.value || {}

    pharmacyInfo.value = {
      name: pharmacyInfoSetting.name || ph.name || 'نامشخص',
      address: pharmacyInfoSetting.address || ph.address || 'آدرس ثبت نشده',
      phone: pharmacyInfoSetting.phone || ph.phone || 'تلفن ثبت نشده',
      logo: pharmacyInfoSetting.logo || ph.documents?.logo?.thumbnail || null,
    }
    console.log('Pharmacy Info Loaded:', pharmacyInfo.value)
  } else {
    console.warn('Tenant not found for ID:', sellerId)
  }
}

onMounted(async () => {
  const orderId = route.query.orderId;
  if (orderId) {
    searchOrderId.value = orderId;
    await searchOrder();
  }
})
const searchOrder = async () => {
  if (!searchOrderId.value.trim()) {
    /*showError('لطفاً شماره سفارش را وارد کنید', 'خطا');*/
    return;
  }

  try {
    // تلاش برای دریافت از API
    const order = await orderStore.fetchOrderById(searchOrderId.value.trim());

    // پیدا کردن سفارش در لیست استور
    ///const order = orderStore.orders.find(o => o.id === searchOrderId.value.trim());

    if (order) {
      orderData.value = order;
      console.log('oooo',orderData.value)
      ///await loadPharmacyInfo(mainSellerId)
    } else {
      orderData.value = null;
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    orderData.value = null;
  }
};

const subtotal = computed(() => {
  if (!orderData.value?.items) return 0
  return orderData.value?.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const shippingCost = computed(() => {
  return orderData.value?.metadata?.shippingCost || 0
})

// Methods
const formatPrice = (price) => {
  if (!price || isNaN(price)) return '0'
  return new Intl.NumberFormat('fa-IR').format(price)
}

const formatDate = (dateString) => {
  if (!dateString) return 'تاریخ نامشخص'
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  } catch (e) {
    return 'تاریخ نامشخص'
  }
}

const printInvoice = () => {
  window.print()
}

const downloadInvoice = async () => {
  try {
    if (typeof window === 'undefined') return
    const invoiceElement = document.querySelector('.document-container')
    if (!invoiceElement) {
      alert('خطا در یافتن المان فاکتور')
      return
    }
    const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
      import('jspdf'),
      import('html2canvas')
    ])
    const canvas = await html2canvas(invoiceElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: invoiceElement.scrollWidth,
      height: invoiceElement.scrollHeight
    })
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
    const imgData = canvas.toDataURL('image/png')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pageWidth - 20
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    if (imgHeight <= pageHeight - 20) {
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight)
    } else {
      let yPosition = 10
      let remainingHeight = imgHeight
      while (remainingHeight > 0) {
        const pageImgHeight = Math.min(remainingHeight, pageHeight - 20)
        pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, pageImgHeight, undefined, 'FAST')
        remainingHeight -= pageImgHeight
        if (remainingHeight > 0) {
          pdf.addPage()
          yPosition = 10
        }
      }
    }
    pdf.save(`فاکتور-${orderData.value.code || orderData.value.id}.pdf`)
  } catch (error) {
    console.error('خطا در ایجاد PDF:', error)
    alert('خطا در ایجاد فایل PDF')
  }
}
</script>

<style scoped>
/* استایل‌ها دقیقاً همان قبلی باقی می‌مانند */
.invoice-document {
  min-height: 100vh;
  padding: 2rem;
  background: #f5f5f5;
}
.document-container {
  max-width: 210mm;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}
.document-content {
  padding: 1.5rem;
  direction: rtl;
  text-align: right;
}
/* Header */
.document-header {
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #000;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 8px 8px 0 0;
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.logo {
  width: 60px;
  height: 60px;
  object-fit: contain;
}
.company-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: black;
}
.header-center {
  flex: 1;
  text-align: center;
}
.invoice-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: black;
  margin: 0;
}
.header-right {
  text-align: right;
}
.invoice-info {
  font-size: 0.9rem;
  color: black;
}
.info-line {
  margin-bottom: 0.25rem;
}
/* Parties */
.parties-section {
  margin-bottom: 1.5rem;
}
.parties-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.party-card {
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 8px;
}
.party-header {
  background: #f3f4f6;
  color: #374151;
  padding: 0.75rem;
  text-align: center;
  margin: 0;
  font-size: 1rem;
  border-radius: 8px 8px 0 0;
}
.party-info {
  padding: 1rem;
}
.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.6rem 0;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
}
.info-row:last-child {
  border-bottom: none;
}
.info-label {
  font-weight: 600;
  color: #4b5563;
  margin-left: 1rem;
}
.info-value {
  color: #1f2937;
  text-align: left;
}
/* Products */
.products-section {
  margin-bottom: 1.5rem;
}
.section-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #374151;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
}
.table-container {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}
.professional-table {
  width: 100%;
  border-collapse: collapse;
}
.professional-table th {
  background: #f3f4f6;
  color: #374151;
  padding: 0.75rem;
  font-weight: bold;
  text-align: center;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.9rem;
}
.professional-table td {
  padding: 0.75rem;
  text-align: center;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.9rem;
  color: #374151;
}
/* Financial */
.financial-section {
  margin-bottom: 1.5rem;
}
.financial-container {
  max-width: 450px;
  margin-left: auto;
  direction: rtl;
}
.financial-table {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}
.financial-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
}
.financial-row:last-child {
  border-bottom: none;
}
.total-row {
  background: #f3f4f6;
  font-weight: bold;
  font-size: 1.1rem;
}
.financial-label {
  font-weight: 600;
  color: #4b5563;
}
.financial-value {
  font-weight: bold;
  color: #1f2937;
}
/* Footer */
.document-footer {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}
.footer-content {
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 2rem;
}
.footer-contact h4 {
  font-size: 1rem;
  font-weight: bold;
  color: black;
  margin-bottom: 0.75rem;
}
.footer-contact p {
  font-size: 0.875rem;
  color: black;
  margin-bottom: 0.25rem;
}
.signature-box {
  border: 1px solid #e5e7eb;
  padding: 3rem 1rem 1rem;
  text-align: center;
  background: #f9fafb;
  border-radius: 6px;
}
.signature-box p {
  font-size: 0.875rem;
  color: black;
  margin: 0;
}
/* Print Controls */
.print-controls {
  text-align: center;
  margin: 2rem 0;
  display: flex;
  justify-content: center;
  gap: 1rem;
}
.back-btn {
  background: #6b7280;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}
.back-btn:hover {
  background: #4b5563;
  text-decoration: none;
  color: white;
}
.download-btn {
  background: #059669;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}
.download-btn:hover {
  background: #047857;
}
.print-btn {
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}
.print-btn:hover {
  background: #1d4ed8;
}
/* Print Styles */
@media print {
  .print-controls {
    display: none;
  }
  .document-container {
    max-width: none;
    margin: 0;
    border: none;
  }
  .document-content {
    padding: 0.5rem;
  }
}
/* Mobile */
@media (max-width: 768px) {
  .header-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .parties-grid {
    grid-template-columns: 1fr;
  }
  .footer-content {
    grid-template-columns: 1fr;
  }
}
</style>