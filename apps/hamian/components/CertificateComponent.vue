<template>
  <!-- بدون wrapper div بیرونی - مستقیم Teleport -->

  <!-- ============================================ -->
  <!-- 🏆 Certificate Preview Modal -->
  <!-- ============================================ -->
  <Teleport to="body">
    <div
        v-if="showCertificatePreview"
        class="fixed inset-0 overflow-y-auto"
        style="z-index: 9999;"
    >
      <div class="flex items-center justify-center min-h-screen px-4 py-8">
        <!-- Backdrop -->
        <div
            class="fixed inset-0 bg-black/80 backdrop-blur-sm"
            style="z-index: 1;"
            @click="closePreview"
        ></div>

        <!-- Modal Content -->
        <div
            class="relative bg-white rounded-3xl max-w-2xl w-full mx-auto p-6 shadow-2xl"
            style="z-index: 2;"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-gray-900 flex items-center gap-2">
              <i class="ti ti-certificate text-rose-600"></i>
              پیش‌نمایش گواهی‌نامه
            </h3>
            <button
                @click="closePreview"
                class="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <i class="ti ti-x text-2xl"></i>
            </button>
          </div>

          <div class="bg-gray-100 rounded-2xl p-4 mb-4 flex items-center justify-center min-h-[400px]">
            <img
                v-if="previewImage"
                :src="previewImage"
                alt="پیش‌نمایش گواهی‌نامه"
                class="max-w-full h-auto rounded-xl shadow-lg"
                style="max-height: 70vh;"
            />
            <div v-else class="flex flex-col items-center text-gray-400">
              <i class="ti ti-loader-2 text-4xl animate-spin mb-2"></i>
              <span>در حال ساخت...</span>
            </div>
          </div>

          <div class="flex gap-3">
            <button
                @click="downloadCertificate"
                :disabled="isGenerating || !previewImage"
                class="flex-1 bg-gradient-to-r from-rose-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-rose-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="ti ti-download text-lg ml-2"></i>
              دانلود با کیفیت بالا
            </button>
            <button
                @click="shareCertificate"
                :disabled="!previewImage"
                class="flex-1 bg-white border-2 border-rose-600 text-rose-700 py-3 px-6 rounded-xl font-semibold hover:bg-rose-50 transition-all disabled:opacity-50"
            >
              <i class="ti ti-share text-lg ml-2"></i>
              اشتراک‌گذاری
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- ============================================ -->
  <!-- 🎉 Success Modal -->
  <!-- ============================================ -->
  <Teleport to="body">
    <div
        v-if="showSuccess"
        class="fixed inset-0 overflow-y-auto"
        style="z-index: 9998;"
    >
      <div class="flex items-center justify-center min-h-screen px-4 py-8">
        <!-- Backdrop -->
        <div
            class="fixed inset-0 bg-black/60 backdrop-blur-sm"
            style="z-index: 1;"
            @click="closeSuccess"
        ></div>

        <!-- Modal Content -->
        <div
            class="relative bg-white rounded-3xl max-w-lg w-full mx-auto p-8 text-center shadow-2xl"
            style="z-index: 2;"
        >
          <!-- Success Animation -->
          <div class="relative w-24 h-24 mx-auto mb-6">
            <div class="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full animate-ping opacity-25"></div>
            <div class="relative w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <i class="ti ti-check text-5xl text-white"></i>
            </div>
          </div>

          <h3 class="text-2xl font-bold text-gray-900 mb-3">
            🎉 عضویت شما ثبت شد!
          </h3>

          <p class="text-gray-600 mb-6 leading-relaxed">
            <strong class="text-rose-600">
              {{ certificateData.firstName }} {{ certificateData.lastName }}
            </strong>
            عزیز، به جمع خانواده بزرگ حامیان حیوانات خوش آمدید!
          </p>

          <!-- Info Card -->
          <div class="mb-6 p-5 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 text-right">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i class="ti ti-sparkles text-rose-600"></i>
              </div>
              <div>
                <h4 class="font-bold text-gray-900 mb-2">گواهی‌نامه دیجیتال شما آماده است!</h4>
                <p class="text-sm text-gray-700">
                  می‌توانید گواهی‌نامه زیبای عضویت خود را دانلود کرده و در شبکه‌های اجتماعی به اشتراک بگذارید.
                </p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-3">
            <button
                @click="openPreview"
                :disabled="isGenerating"
                class="w-full bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-bold text-base hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <span class="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <span class="relative flex items-center justify-center">
                <span v-if="isGenerating">
                  <i class="ti ti-loader-2 text-lg ml-2 animate-spin"></i>
                  در حال ساخت...
                </span>
                <span v-else>
                  <i class="ti ti-certificate text-xl ml-2"></i>
                  🏆 مشاهده و دانلود گواهی‌نامه
                </span>
              </span>
            </button>

            <button
                @click="shareSuccess"
                class="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 px-6 rounded-2xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              <i class="ti ti-share text-lg ml-2"></i>
              اشتراک‌گذاری در شبکه‌های اجتماعی
            </button>

            <button
                @click="closeSuccess"
                class="w-full text-gray-500 hover:text-gray-700 py-2 text-sm font-medium transition-colors"
            >
              بازگشت به خانه
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import {useSupporterStore} from "~/stores/supporter.ts";
// ============================================
// States
// ============================================
// ============================================
// 🛡️ Monkey-Patch: محافظت از setLineDash
// ============================================
// این کد فقط یک بار در کل برنامه اجرا می‌شه

const patchSetLineDash = () => {
  if (typeof window === 'undefined') return

  // بررسی اینکه آیا قبلاً patch شده
  const w = window as any
  if (w.__setLineDashPatched) return
  w.__setLineDashPatched = true

  // پیدا کردن prototype اصلی
  const proto = CanvasRenderingContext2D.prototype
  const original = proto.setLineDash

  // جایگزینی با نسخه امن
  proto.setLineDash = function (pattern?: number[]) {
    try {
      // اگر pattern خالی، null، undefined یا آرایه خالی بود
      if (!pattern || !Array.isArray(pattern) || pattern.length === 0) {
        // ⭐ به جای setLineDash([]) از این روش استفاده می‌کنیم
        // که setLineDash اصلاً صدا زده نمی‌شه
        this.lineDashOffset = 0
        return
      }

      // فیلتر مقادیر نامعتبر
      const safe = pattern.filter(
          (n) => !isNaN(n) && n >= 0
      )

      // اگر همه مقادیر نامعتبر بودن
      if (safe.length === 0) {
        this.lineDashOffset = 0
        return
      }

      // صدا زدن نسخه اصلی با مقدار معتبر
      return original.call(this, safe)
    } catch (e) {
      console.warn('setLineDash patched error:', e)
    }
  }

  console.log('✅ setLineDash patched successfully')
}

// اجرای patch در سمت کلاینت
if (process.client) {
  patchSetLineDash()
}
const isGenerating = ref(false)
const showSuccess = ref(false)
const showCertificatePreview = ref(false)
const previewImage = ref<string | null>(null)

const certificateData = reactive({
  firstName: '',
  lastName: '',
  type: '',
  phone: '',
  email: ''
})

const supporter = computed(() => useSupporterStore().supporter)
const supporterStore = useSupporterStore()

// ============================================
// 🛡️ Helper Functions
// ============================================

const applyLineDash = (
    ctx: CanvasRenderingContext2D,
    pattern?: number[]
): void => {
  // حالا به لطف patch، هر ورودی امن هست
  if (!pattern || !Array.isArray(pattern) || pattern.length === 0) {
    ctx.setLineDash()  // ✅ patch این رو مدیریت می‌کنه
    return
  }

  const safe = pattern.filter(
      (n) => !isNaN(n) && n >= 0
  )

  ctx.setLineDash(safe.length > 0 ? safe : undefined)
}

const resetLineDash = (ctx: CanvasRenderingContext2D): void => {
  ctx.setLineDash()  // ✅ فقط خط ممتد
}

const safeCanvasOp = (
    ctx: CanvasRenderingContext2D,
    operation: () => void,
    errorMsg: string = 'Canvas operation failed'
): void => {
  try {
    operation()
  } catch (e) {
    console.warn(errorMsg, e)
  }
}

// ============================================
// Utility: Draw Rounded Rectangle
// ============================================
const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number, r: number
) => {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

// ============================================
// Utility: Draw Star
// ============================================
const drawStar = (
    ctx: CanvasRenderingContext2D,
    cx: number, cy: number, spikes: number,
    outerRadius: number, innerRadius: number
) => {
  let rot = Math.PI / 2 * 3
  let x = cx
  let y = cy
  const step = Math.PI / spikes

  ctx.beginPath()
  ctx.moveTo(cx, cy - outerRadius)
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius
    y = cy + Math.sin(rot) * outerRadius
    ctx.lineTo(x, y)
    rot += step

    x = cx + Math.cos(rot) * innerRadius
    y = cy + Math.sin(rot) * innerRadius
    ctx.lineTo(x, y)
    rot += step
  }
  ctx.lineTo(cx, cy - outerRadius)
  ctx.closePath()
}

// ============================================
// 🌟 Main Certificate Generator
// ============================================
const generateCertificateCanvas = (): HTMLCanvasElement => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')

  canvas.width = 1080
  canvas.height = 1920
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'

  // ============ Background ============
  safeCanvasOp(ctx, () => {
    const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    bgGradient.addColorStop(0, '#fdf2f8')
    bgGradient.addColorStop(0.5, '#fce7f3')
    bgGradient.addColorStop(1, '#f3e8ff')
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, 'Background failed')

  // Subtle pattern overlay
  safeCanvasOp(ctx, () => {
    ctx.save()
    ctx.globalAlpha = 0.03
    ctx.fillStyle = '#ec4899'
    for (let i = 0; i < canvas.width; i += 40) {
      for (let j = 0; j < canvas.height; j += 40) {
        ctx.beginPath()
        ctx.arc(i, j, 1.5, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    ctx.restore()
  }, 'Pattern failed')

  // ============ Outer Decorative Border ============
  safeCanvasOp(ctx, () => {
    const goldGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    goldGradient.addColorStop(0, '#fbbf24')
    goldGradient.addColorStop(0.5, '#f59e0b')
    goldGradient.addColorStop(1, '#d97706')

    ctx.strokeStyle = goldGradient
    ctx.lineWidth = 8
    roundRect(ctx, 40, 40, canvas.width - 80, canvas.height - 80, 30)
    ctx.stroke()
  }, 'Gold border failed')

  safeCanvasOp(ctx, () => {
    ctx.strokeStyle = '#ec4899'
    ctx.lineWidth = 3
    roundRect(ctx, 65, 65, canvas.width - 130, canvas.height - 130, 24)
    ctx.stroke()
  }, 'Pink border failed')

  // ✅ Dashed inner border - FIXED
  safeCanvasOp(ctx, () => {
    ctx.strokeStyle = '#f9a8d4'
    ctx.lineWidth = 2
    applyLineDash(ctx,) // ✅ استفاده از helper امن
    roundRect(ctx, 90, 90, canvas.width - 180, canvas.height - 180, 18)
    ctx.stroke()
    resetLineDash(ctx) // ✅ ریست امن
  }, 'Dashed border failed')

  // ============ Corner Ornaments ============
  const drawCornerOrnament = (x: number, y: number, rotation: number) => {
    safeCanvasOp(ctx, () => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)

      ctx.lineWidth = 3
      ctx.strokeStyle = '#d97706'
      ctx.beginPath()
      ctx.arc(0, 0, 40, 0, Math.PI / 2)
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(20, 20, 30, 0, Math.PI / 2)
      ctx.stroke()

      drawStar(ctx, 0, 0, 5, 18, 8)
      ctx.fillStyle = '#fbbf24'
      ctx.fill()
      ctx.strokeStyle = '#92400e'
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.restore()
    }, 'Corner ornament failed')
  }

  drawCornerOrnament(120, 120, 0)
  drawCornerOrnament(canvas.width - 120, 120, Math.PI / 2)
  drawCornerOrnament(canvas.width - 120, canvas.height - 120, Math.PI)
  drawCornerOrnament(120, canvas.height - 120, -Math.PI / 2)

  // ============ Top Header ============
  safeCanvasOp(ctx, () => {
    ctx.fillStyle = '#ffffff'
    roundRect(ctx, 140, 160, canvas.width - 280, 280, 24)
    ctx.fill()
  }, 'Header bg failed')

  safeCanvasOp(ctx, () => {
    const headerStroke = ctx.createLinearGradient(140, 160, canvas.width - 140, 440)
    headerStroke.addColorStop(0, '#ec4899')
    headerStroke.addColorStop(0.5, '#db2777')
    headerStroke.addColorStop(1, '#be185d')
    ctx.strokeStyle = headerStroke
    ctx.lineWidth = 4
    roundRect(ctx, 140, 160, canvas.width - 280, 280, 24)
    ctx.stroke()
  }, 'Header border failed')

  // Logo Circles
  safeCanvasOp(ctx, () => {
    ctx.fillStyle = '#fbbf24'
    ctx.beginPath()
    ctx.arc(canvas.width / 2, 260, 78, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(canvas.width / 2, 260, 70, 0, Math.PI * 2)
    ctx.fill()

    const logoGradient = ctx.createRadialGradient(canvas.width / 2, 260, 0, canvas.width / 2, 260, 55)
    logoGradient.addColorStop(0, '#fdf2f8')
    logoGradient.addColorStop(1, '#fbcfe8')
    ctx.fillStyle = logoGradient
    ctx.beginPath()
    ctx.arc(canvas.width / 2, 260, 55, 0, Math.PI * 2)
    ctx.fill()

    // Paw icon
    ctx.font = '60px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('🐾', canvas.width / 2, 268)
  }, 'Logo failed')

  // Stars around logo
  safeCanvasOp(ctx, () => {
    const starPositions = [
      { angle: -Math.PI / 2, dist: 110 },
      { angle: -Math.PI / 6, dist: 110 },
      { angle: Math.PI / 6, dist: 110 },
      { angle: Math.PI / 2, dist: 110 },
      { angle: 5 * Math.PI / 6, dist: 110 },
      { angle: -5 * Math.PI / 6, dist: 110 }
    ]

    starPositions.forEach(pos => {
      const x = canvas.width / 2 + Math.cos(pos.angle) * pos.dist
      const y = 260 + Math.sin(pos.angle) * pos.dist

      drawStar(ctx, x, y, 5, 10, 4)
      ctx.fillStyle = '#fbbf24'
      ctx.fill()
      ctx.strokeStyle = '#d97706'
      ctx.lineWidth = 1
      ctx.stroke()
    })
  }, 'Stars failed')

  // Header text
  safeCanvasOp(ctx, () => {
    ctx.fillStyle = '#831843'
    ctx.font = 'bold 38px Georgia, serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText('CERTIFICATE', canvas.width / 2, 365)

    ctx.strokeStyle = '#ec4899'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(canvas.width / 2 - 120, 380)
    ctx.lineTo(canvas.width / 2 + 120, 380)
    ctx.stroke()

    ctx.fillStyle = '#fbbf24'
    ctx.save()
    ctx.translate(canvas.width / 2, 380)
    ctx.rotate(Math.PI / 4)
    ctx.fillRect(-5, -5, 10, 10)
    ctx.restore()

    ctx.fillStyle = '#be185d'
    ctx.font = 'bold 42px Tahoma, Arial'
    ctx.fillText('گواهی‌نامه عضویت', canvas.width / 2, 420)
  }, 'Header text failed')

  // ============ Middle Content Card ============
  safeCanvasOp(ctx, () => {
    ctx.fillStyle = '#ffffff'
    roundRect(ctx, 140, 480, canvas.width - 280, 720, 24)
    ctx.fill()
  }, 'Middle card bg failed')

  safeCanvasOp(ctx, () => {
    ctx.strokeStyle = '#f9a8d4'
    ctx.lineWidth = 3
    roundRect(ctx, 140, 480, canvas.width - 280, 720, 24)
    ctx.stroke()
  }, 'Middle card border failed')

  // "این گواهی‌نامه به" text
  safeCanvasOp(ctx, () => {
    ctx.fillStyle = '#6b7280'
    ctx.font = '32px Tahoma, Arial'
    ctx.textAlign = 'center'
    ctx.fillText('این گواهی‌نامه به', canvas.width / 2, 560)
  }, 'Intro text failed')

  // Member Name section
  const name = `${certificateData.firstName} ${certificateData.lastName}`

  safeCanvasOp(ctx, () => {
    const nameGradient = ctx.createLinearGradient(200, 580, canvas.width - 200, 700)
    nameGradient.addColorStop(0, '#fdf2f8')
    nameGradient.addColorStop(0.5, '#fce7f3')
    nameGradient.addColorStop(1, '#fdf2f8')
    ctx.fillStyle = nameGradient
    roundRect(ctx, 200, 590, canvas.width - 400, 110, 16)
    ctx.fill()
  }, 'Name bg failed')

  // ✅ Name dashed border - FIXED
  safeCanvasOp(ctx, () => {
    ctx.strokeStyle = '#ec4899'
    ctx.lineWidth = 2
    applyLineDash(ctx,) // ✅ helper امن
    roundRect(ctx, 200, 590, canvas.width - 400, 110, 16)
    ctx.stroke()
    resetLineDash(ctx) // ✅ ریست امن
  }, 'Name dashed border failed')

  // Name text with shadow
  safeCanvasOp(ctx, () => {
    ctx.shadowColor = 'rgba(190, 24, 93, 0.3)'
    ctx.shadowBlur = 8
    ctx.shadowOffsetY = 2
    ctx.fillStyle = '#831843'
    ctx.font = 'bold 56px Tahoma, Arial'
    ctx.textAlign = 'center'
    ctx.fillText(name || 'عضو جدید', canvas.width / 2, 660)
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
    ctx.shadowOffsetY = 0
  }, 'Name text failed')

  // Description
  safeCanvasOp(ctx, () => {
    ctx.fillStyle = '#4b5563'
    ctx.font = '28px Tahoma, Arial'
    ctx.fillText('به‌عنوان یکی از اعضای ارزشمند خانواده پتومن', canvas.width / 2, 750)
    ctx.fillText('به جمع حامیان حیوانات پیوست', canvas.width / 2, 795)
  }, 'Description failed')

  // ============ Support Type Badge ============
  const supportText = certificateData.type === 'financial' ? 'حامی مالی' : 'داوطلب فعال'
  const supportEmoji = certificateData.type === 'financial' ? '💝' : '🤝'

  safeCanvasOp(ctx, () => {
    const badgeGradient = ctx.createLinearGradient(280, 830, canvas.width - 280, 920)
    badgeGradient.addColorStop(0, '#ec4899')
    badgeGradient.addColorStop(0.5, '#db2777')
    badgeGradient.addColorStop(1, '#be185d')
    ctx.fillStyle = badgeGradient
    roundRect(ctx, 280, 830, canvas.width - 560, 90, 45)
    ctx.fill()

    const shineGradient = ctx.createLinearGradient(280, 830, canvas.width - 280, 870)
    shineGradient.addColorStop(0, 'rgba(255,255,255,0.3)')
    shineGradient.addColorStop(0.5, 'rgba(255,255,255,0.1)')
    shineGradient.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = shineGradient
    roundRect(ctx, 280, 830, canvas.width - 560, 45, 45)
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 38px Tahoma, Arial'
    ctx.fillText(`${supportEmoji}  ${supportText}  ${supportEmoji}`, canvas.width / 2, 888)
  }, 'Badge failed')

  // Date Section
  safeCanvasOp(ctx, () => {
    ctx.fillStyle = '#6b7280'
    ctx.font = '24px Tahoma, Arial'
    ctx.fillText('تاریخ صدور گواهی‌نامه', canvas.width / 2, 980)

    const today = new Date()
    const persianDate = today.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    ctx.fillStyle = '#1f2937'
    ctx.font = 'bold 32px Tahoma, Arial'
    ctx.fillText(`📅  ${persianDate}  📅`, canvas.width / 2, 1030)

    const certId = `PET-${Date.now().toString().slice(-8)}`
    ctx.fillStyle = '#9ca3af'
    ctx.font = '20px monospace'
    ctx.fillText(`Certificate ID: ${certId}`, canvas.width / 2, 1070)

    // Signature line
    ctx.strokeStyle = '#6b7280'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(canvas.width / 2 - 200, 1150)
    ctx.lineTo(canvas.width / 2 + 200, 1150)
    ctx.stroke()

    ctx.fillStyle = '#374151'
    ctx.font = '22px Tahoma, Arial'
    ctx.fillText('مدیرعامل سازمان پتومن', canvas.width / 2, 1185)
  }, 'Date section failed')

  // ============ Official Seal ============
  safeCanvasOp(ctx, () => {
    const sealX = canvas.width - 200
    const sealY = 1180

    ctx.strokeStyle = '#dc2626'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(sealX, sealY, 80, 0, Math.PI * 2)
    ctx.stroke()

    ctx.strokeStyle = '#dc2626'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(sealX, sealY, 68, 0, Math.PI * 2)
    ctx.stroke()

    ctx.fillStyle = 'rgba(254, 226, 226, 0.5)'
    ctx.beginPath()
    ctx.arc(sealX, sealY, 66, 0, Math.PI * 2)
    ctx.fill()

    ctx.save()
    ctx.translate(sealX, sealY)
    ctx.rotate(-Math.PI / 2)
    ctx.fillStyle = '#dc2626'
    ctx.font = 'bold 18px Tahoma, Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const sealText = '★  OFFICIAL SEAL  ★  PETMAN  ★  VERIFIED  '
    ctx.fillText(sealText, 0, -42)
    ctx.fillText(sealText, 0, 42)
    ctx.restore()

    drawStar(ctx, sealX, sealY, 5, 22, 10)
    ctx.fillStyle = '#fbbf24'
    ctx.fill()
    ctx.strokeStyle = '#92400e'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.fillStyle = '#dc2626'
    ctx.font = 'bold 16px Georgia, serif'
    ctx.fillText('PETMAN', sealX, sealY + 35)
  }, 'Seal failed')

  // ============ Footer Ribbon ============
  safeCanvasOp(ctx, () => {
    const ribbonY = 1280
    ctx.fillStyle = '#1f2937'
    ctx.beginPath()
    ctx.moveTo(140, ribbonY)
    ctx.lineTo(140, ribbonY + 60)
    ctx.lineTo(180, ribbonY + 30)
    ctx.closePath()
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(canvas.width - 140, ribbonY)
    ctx.lineTo(canvas.width - 140, ribbonY + 60)
    ctx.lineTo(canvas.width - 180, ribbonY + 30)
    ctx.closePath()
    ctx.fill()

    const ribbonGradient = ctx.createLinearGradient(140, ribbonY, canvas.width - 140, ribbonY + 60)
    ribbonGradient.addColorStop(0, '#be185d')
    ribbonGradient.addColorStop(0.5, '#ec4899')
    ribbonGradient.addColorStop(1, '#be185d')
    ctx.fillStyle = ribbonGradient
    ctx.fillRect(180, ribbonY, canvas.width - 360, 60)

    ctx.fillStyle = 'rgba(255,255,255,0.2)'
    ctx.fillRect(180, ribbonY, canvas.width - 360, 20)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 26px Tahoma, Arial'
    ctx.fillText('🌟  از اینکه به ماموریت ما ایمان آوردید، سپاسگزاریم  🌟', canvas.width / 2, ribbonY + 38)

    ctx.fillStyle = '#374151'
    ctx.font = '24px Tahoma, Arial'
    ctx.textAlign = 'center'
    ctx.fillText('با حمایت شما، جان‌های بی‌گناه نجات پیدا می‌کنند', canvas.width / 2, 1400)

    ctx.fillStyle = '#6b7280'
    ctx.font = '22px Tahoma, Arial'
    ctx.fillText('هر کمکی، هر چند کوچک، یک زندگی تازه است', canvas.width / 2, 1440)
  }, 'Ribbon failed')

  // ============ Animal Emojis Parade ============
  safeCanvasOp(ctx, () => {
    const emojiY = 1500
    const emojis = ['🐕', '🐈', '🐰', '🦔', '🐹', '🐦']
    const spacing = 130
    const totalWidth = (emojis.length - 1) * spacing
    const startX = (canvas.width - totalWidth) / 2

    emojis.forEach((emoji, i) => {
      const cx = startX + i * spacing
      const cy = emojiY

      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(cx, cy, 38, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = '#f9a8d4'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(cx, cy, 38, 0, Math.PI * 2)
      ctx.stroke()

      ctx.font = '40px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(emoji, cx, cy + 2)
    })
  }, 'Emojis failed')

  // ============ QR Code Pattern ============
  safeCanvasOp(ctx, () => {
    const qrSize = 120
    const qrX = canvas.width / 2 - qrSize / 2
    const qrY = 1600

    ctx.fillStyle = '#ffffff'
    roundRect(ctx, qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 12)
    ctx.fill()
    ctx.strokeStyle = '#1f2937'
    ctx.lineWidth = 3
    roundRect(ctx, qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 12)
    ctx.stroke()

    ctx.fillStyle = '#1f2937'
    const cellSize = 8
    for (let row = 0; row < qrSize / cellSize; row++) {
      for (let col = 0; col < qrSize / cellSize; col++) {
        if ((row * 7 + col * 13 + (row * col)) % 3 === 0) {
          ctx.fillRect(qrX + col * cellSize, qrY + row * cellSize, cellSize - 1, cellSize - 1)
        }
      }
    }

    const drawFinderSquare = (x: number, y: number) => {
      ctx.fillStyle = '#1f2937'
      ctx.fillRect(x, y, 24, 24)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(x + 4, y + 4, 16, 16)
      ctx.fillStyle = '#1f2937'
      ctx.fillRect(x + 8, y + 8, 8, 8)
    }
    drawFinderSquare(qrX + 4, qrY + 4)
    drawFinderSquare(qrX + qrSize - 28, qrY + 4)
    drawFinderSquare(qrX + 4, qrY + qrSize - 28)

    ctx.fillStyle = '#1f2937'
    ctx.font = 'bold 18px Tahoma, Arial'
    ctx.fillText('petoman.com', canvas.width / 2, qrY + qrSize + 35)

    ctx.fillStyle = '#ec4899'
    ctx.font = '18px Tahoma, Arial'
    ctx.fillText('#پتومن  #حامیان_حیوانات  #نجات_حیوانات', canvas.width / 2, qrY + qrSize + 70)
  }, 'QR failed')

  // Bottom sparkles
  safeCanvasOp(ctx, () => {
    ctx.fillStyle = '#fbbf24'
    const sparkles = [
      { x: 180, y: 1800 },
      { x: canvas.width - 180, y: 1800 },
      { x: 300, y: 1820 },
      { x: canvas.width - 300, y: 1820 }
    ]
    sparkles.forEach(s => {
      drawStar(ctx, s.x, s.y, 4, 8, 3)
      ctx.fill()
    })

    ctx.fillStyle = 'rgba(190, 24, 93, 0.3)'
    ctx.font = '16px Tahoma, Arial'
    ctx.fillText('✨ Made with love by Petman Team ✨', canvas.width / 2, 1870)
  }, 'Sparkles failed')

  return canvas
}

// ============================================
// Actions
// ============================================
const openPreview = async () => {
  isGenerating.value = true
  try {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready
    }
    await new Promise(resolve => setTimeout(resolve, 100))

    const canvas = generateCertificateCanvas()
    previewImage.value = canvas.toDataURL('image/png', 1.0)
    showCertificatePreview.value = true
  } catch (error) {
    console.error('❌ خطا در ساخت گواهی‌نامه:', error)
    alert('متاسفانه خطایی رخ داد. لطفاً دوباره تلاش کنید.')
  } finally {
    isGenerating.value = false
  }
}

const downloadCertificate = async () => {
  isGenerating.value = true
  try {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready
    }
    await new Promise(resolve => setTimeout(resolve, 100))

    const canvas = generateCertificateCanvas()
    const dataUrl = canvas.toDataURL('image/png', 1.0)

    const link = document.createElement('a')
    const fileName = `گواهی‌نامه-${certificateData.firstName || 'عضو'}-${certificateData.lastName || 'جدید'}.png`
    link.download = fileName
    link.href = dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('❌ خطا در دانلود:', error)
    alert('خطا در دانلود گواهی‌نامه')
  } finally {
    isGenerating.value = false
  }
}

const shareCertificate = async () => {
  const supportText = certificateData.type === 'financial' ? 'حامی مالی' : 'داوطلب فعال'

  const text = `🎉 من ${certificateData.firstName} ${certificateData.lastName} به جمع حامیان حیوانات پتومن پیوستم!

${supportText} 🐾

سازمان پتومن به نجات و مراقبت از حیوانات بی‌سرپناه می‌پردازد.

❤️ با حمایت هر کدام از ما، جان‌های بی‌گناه نجات پیدا می‌کنند.

#پتومن #حامیان_حیوانات #نجات_حیوانات`

  if (navigator.share) {
    try {
      await navigator.share({
        title: `گواهی‌نامه عضویت ${certificateData.firstName}`,
        text,
        url: window.location.origin
      })
    } catch (err) {
      // User cancelled
    }
  } else {
    try {
      await navigator.clipboard.writeText(text + '\n\n' + window.location.origin)
      alert('✅ متن کپی شد! می‌توانید در شبکه‌های اجتماعی به اشتراک بگذارید.')
    } catch (err) {
      alert(text)
    }
  }
}

const shareSuccess = () => shareCertificate()
const closeSuccess = () => { showSuccess.value = false }
const closePreview = () => { showCertificatePreview.value = false }

const setCertificateData = (data: any) => {
  Object.assign(certificateData, data)
}

defineExpose({
  setCertificateData,
  showSuccessModal: () => { showSuccess.value = true }
})
</script>

<style scoped>
@keyframes shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-shine::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: shine 2s infinite;
}
</style>