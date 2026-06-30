const downloadCertificate = async () => {
  // Generate certificate as Instagram Story format
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  if (!ctx) return
  
  // Set canvas size for Instagram Story (9:16 ratio)
  canvas.width = 1080
  canvas.height = 1920
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  gradient.addColorStop(0, '#fdf2f8')
  gradient.addColorStop(0.3, '#fce7f3')
  gradient.addColorStop(0.7, '#f3e8ff')
  gradient.addColorStop(1, '#e0e7ff')
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // Add subtle pattern overlay
  ctx.fillStyle = 'rgba(236, 72, 153, 0.05)'
  for (let i = 0; i < canvas.width; i += 60) {
    for (let j = 0; j < canvas.height; j += 60) {
      ctx.fillRect(i, j, 30, 30)
    }
  }
  
  // Top section with logo area
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(60, 60, canvas.width - 120, 300)
  ctx.strokeStyle = '#ec4899'
  ctx.lineWidth = 4
  ctx.strokeRect(60, 60, canvas.width - 120, 300)
  
  // Logo circle
  ctx.fillStyle = '#ec4899'
  ctx.beginPath()
  ctx.arc(canvas.width / 2, 180, 60, 0, 2 * Math.PI)
  ctx.fill()
  
  // Logo inner circle
  ctx.fillStyle = '#fce7f3'
  ctx.beginPath()
  ctx.arc(canvas.width / 2, 180, 45, 0, 2 * Math.PI)
  ctx.fill()
  
  // Animal emojis around logo (smaller for mobile)
  ctx.font = '32px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('🐕', canvas.width / 2 - 80, 140)
  ctx.fillText('🐱', canvas.width / 2 + 80, 140)
  ctx.fillText('❤️', canvas.width / 2 - 80, 220)
  ctx.fillText('🐾', canvas.width / 2 + 80, 220)
  
  // Title
  ctx.fillStyle = '#be185d'
  ctx.font = 'bold 48px Tahoma, Arial, sans-serif'
  ctx.fillText('گواهینامه عضویت', canvas.width / 2, 280)
  
  ctx.fillStyle = '#ec4899'
  ctx.font = 'bold 32px Tahoma, Arial, sans-serif'
  ctx.fillText('پتومن', canvas.width / 2, 320)
  
  // Main content section
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(60, 400, canvas.width - 120, 600)
  ctx.strokeStyle = '#f9a8d4'
  ctx.lineWidth = 3
  ctx.strokeRect(60, 400, canvas.width - 120, 600)
  
  // Member name section
  ctx.fillStyle = '#831843'
  ctx.font = 'bold 56px Tahoma, Arial, sans-serif'
  const firstName = form.firstName
  const lastName = form.lastName
  
  // Center the name vertically in the content area
  ctx.fillText(firstName, canvas.width / 2, 520)
  ctx.fillText(lastName, canvas.width / 2, 590)
  
  // Membership text
  ctx.fillStyle = '#be185d'
  ctx.font = 'bold 42px Tahoma, Arial, sans-serif'
  ctx.fillText('به جمع حامیان', canvas.width / 2, 680)
  ctx.fillText('حیوانات پیوست', canvas.width / 2, 730)
  
  // Support type with icon
  const supportTypeText = form.supportType === 'financial' ? 'حامی مالی' : 'داوطلب'
  const supportIcon = form.supportType === 'financial' ? '💰' : '🤝'
  
  ctx.fillStyle = '#fce7f3'
  ctx.fillRect(120, 770, canvas.width - 240, 80)
  ctx.strokeStyle = '#ec4899'
  ctx.lineWidth = 2
  ctx.strokeRect(120, 770, canvas.width - 240, 80)
  
  ctx.fillStyle = '#831843'
  ctx.font = 'bold 36px Tahoma, Arial, sans-serif'
  ctx.fillText(`${supportIcon} ${supportTypeText}`, canvas.width / 2, 820)
  
  // Date section
  const today = new Date()
  const persianDate = today.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  ctx.fillStyle = '#be185d'
  ctx.font = '28px Tahoma, Arial, sans-serif'
  ctx.fillText(`📅 ${persianDate}`, canvas.width / 2, 900)
  
  // Bottom decorative section
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(60, 1050, canvas.width - 120, 400)
  ctx.strokeStyle = '#ec4899'
  ctx.lineWidth = 4
  ctx.strokeRect(60, 1050, canvas.width - 120, 400)
  
  // Thank you message
  ctx.fillStyle = '#6b7280'
  ctx.font = '24px Tahoma, Arial, sans-serif'
  ctx.fillText('با تشکر از حمایت گرم شما', canvas.width / 2, 1150)
  ctx.fillText('در نجات جان حیوانات', canvas.width / 2, 1190)
  
  // Animal parade
  ctx.font = '40px Arial'
  ctx.fillText('🐕 🐱 🐰', canvas.width / 2, 1280)
  ctx.fillText('🦔 🐦 🐹', canvas.width / 2, 1340)
  
  // Organization signature
  ctx.fillStyle = '#831843'
  ctx.font = 'bold 24px Tahoma, Arial, sans-serif'
  ctx.fillText('مدیریت سازمان پتومن', canvas.width / 2, 1400)
  
  // Certificate ID
  const certificateId = `PET-${Date.now().toString().slice(-6)}`
  ctx.fillStyle = '#9ca3af'
  ctx.font = '18px Tahoma, Arial, sans-serif'
  ctx.fillText(`شناسه: ${certificateId}`, canvas.width / 2, 1430)
  
  // Social media ready watermark
  ctx.fillStyle = 'rgba(236, 72, 153, 0.1)'
  ctx.font = '16px Arial'
  ctx.fillText('📱 آماده اشتراک‌گذاری', canvas.width / 2, 1850)
  
  // Download with optimal settings for social media
  const link = document.createElement('a')
  link.download = `گواهینامه-استوری-${form.firstName}-${form.lastName}.png`
  link.href = canvas.toDataURL('image/png', 1.0)
  link.click()
}
