<template>
  <div class="certificate-generator">
    <canvas
      ref="canvasRef"
      :width="canvasWidth"
      :height="canvasHeight"
      class="hidden"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import type { Supporter } from '@/types/supporter'

interface Props {
  supporter: Supporter
  format: 'story' | 'post' | 'poster'
}

const props = defineProps<Props>()
const emit = defineEmits<{
  generated: [dataUrl: string]
}>()

const canvasRef = ref<HTMLCanvasElement>()

const dimensions = {
  story: { width: 1080, height: 1920 },
  post: { width: 1080, height: 1080 },
  poster: { width: 1080, height: 1350 }
}

const canvasWidth = computed(() => dimensions[props.format].width)
const canvasHeight = computed(() => dimensions[props.format].height)

const generateCertificate = async () => {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  gradient.addColorStop(0, '#667eea')
  gradient.addColorStop(1, '#764ba2')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Persian/Farsi font setup
  const primaryFont = '700 64px "Vazir", Arial, sans-serif'
  const secondaryFont = '400 32px "Vazir", Arial, sans-serif'
  const dateFont = '300 28px "Vazir", Arial, sans-serif'

  // Logo area
  await drawLogo(ctx)

  // Main title
  ctx.fillStyle = '#ffffff'
  ctx.font = primaryFont
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  const titleY = props.format === 'story' ? 350 : 280
  ctx.fillText('گواهی حمایت', canvas.width / 2, titleY)

  // Organization name
  ctx.font = secondaryFont
  ctx.fillStyle = '#f0f4f8'
  const orgY = titleY + 80
  ctx.fillText('سازمان حمایت از حیوانات پتومن', canvas.width / 2, orgY)

  // Decorative line
  drawDecorativeLine(ctx, orgY + 60)

  // Certificate text
  const textStartY = orgY + 140
  drawCertificateText(ctx, textStartY)

  // Supporter name highlight
  drawSupporterName(ctx, textStartY + 120)

  // Support details
  drawSupportDetails(ctx, textStartY + 220)

  // Date and signature area
  drawFooter(ctx)

  // Generate data URL
  const dataUrl = canvas.toDataURL('image/png', 0.9)
  emit('generated', dataUrl)

  return dataUrl
}

const drawLogo = async (ctx: CanvasRenderingContext2D) => {
  // Draw a circular logo background
  const logoSize = 120
  const centerX = canvasWidth.value / 2
  const logoY = props.format === 'story' ? 180 : 140

  // Logo circle
  ctx.beginPath()
  ctx.arc(centerX, logoY, logoSize / 2, 0, 2 * Math.PI)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
  ctx.fill()

  // Heart icon (simplified)
  ctx.fillStyle = '#ffffff'
  ctx.font = '48px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('♥', centerX, logoY)
}

const drawDecorativeLine = (ctx: CanvasRenderingContext2D, y: number) => {
  const centerX = canvasWidth.value / 2
  const lineWidth = 300

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
  ctx.lineWidth = 2
  ctx.setLineDash([10, 5])
  
  ctx.beginPath()
  ctx.moveTo(centerX - lineWidth / 2, y)
  ctx.lineTo(centerX + lineWidth / 2, y)
  ctx.stroke()
  
  ctx.setLineDash([]) // Reset dash
}

const drawCertificateText = (ctx: CanvasRenderingContext2D, y: number) => {
  ctx.fillStyle = '#ffffff'
  ctx.font = '400 36px "Vazir", Arial, sans-serif'
  ctx.textAlign = 'center'
  
  const line1 = 'اینجانب گواهی می‌نمایم که'
  ctx.fillText(line1, canvasWidth.value / 2, y)
}

const drawSupporterName = (ctx: CanvasRenderingContext2D, y: number) => {
  // Name background
  const nameWidth = 500
  const nameHeight = 80
  const centerX = canvasWidth.value / 2
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
  ctx.fillRect(centerX - nameWidth / 2, y - nameHeight / 2, nameWidth, nameHeight)
  
  // Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
  ctx.lineWidth = 2
  ctx.strokeRect(centerX - nameWidth / 2, y - nameHeight / 2, nameWidth, nameHeight)
  
  // Name text
  ctx.fillStyle = '#ffffff'
  ctx.font = '700 42px "Vazir", Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(props.supporter.name, centerX, y)
}

const drawSupportDetails = (ctx: CanvasRenderingContext2D, y: number) => {
  ctx.fillStyle = '#f0f4f8'
  ctx.font = '400 32px "Vazir", Arial, sans-serif'
  ctx.textAlign = 'center'
  
  const details = [
    'از حامیان فعال و مهربان',
    'سازمان نجات حیوانات بی‌سرپناه',
    `شماره عضویت: ${props.supporter.supporterNumber}`,
    `تاریخ عضویت: ${formatPersianDate(props.supporter.joinDate)}`
  ]
  
  details.forEach((detail, index) => {
    ctx.fillText(detail, canvasWidth.value / 2, y + (index * 50))
  })
}

const drawFooter = (ctx: CanvasRenderingContext2D) => {
  const footerY = canvasHeight.value - 180
  
  // Current date
  ctx.fillStyle = '#e2e8f0'
  ctx.font = '300 28px "Vazir", Arial, sans-serif'
  ctx.textAlign = 'center'
  
  const currentDate = formatPersianDate(new Date().toISOString())
  ctx.fillText(`تاریخ صدور: ${currentDate}`, canvasWidth.value / 2, footerY)
  
  // Signature line
  const signY = footerY + 60
  const signWidth = 200
  const centerX = canvasWidth.value / 2
  
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(centerX - signWidth / 2, signY)
  ctx.lineTo(centerX + signWidth / 2, signY)
  ctx.stroke()
  
  // Signature text
  ctx.fillStyle = '#e2e8f0'
  ctx.font = '300 24px "Vazir", Arial, sans-serif'
  ctx.fillText('مدیر عامل سازمان', centerX, signY + 35)
}

const formatPersianDate = (dateString: string) => {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  return date.toLocaleDateString('fa-IR', options)
}

// Auto-generate when component mounts or props change
watch([() => props.supporter, () => props.format], () => {
  nextTick(() => {
    generateCertificate()
  })
}, { immediate: true })

// Expose generate method
defineExpose({
  generateCertificate
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Vazir:wght@300;400;700&display=swap');

.certificate-generator {
  direction: rtl;
}
</style>
