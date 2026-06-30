# صداهای نوتیفیکیشن

## نحوه اضافه کردن فایل صوتی

برای اینکه صدای نوتیفیکیشن کار کند، یک فایل صوتی با نام `notification.mp3` در این پوشه قرار دهید.

### گزینه‌های پیشنهادی:

1. **استفاده از صدای سیستمی:**
   - می‌توانید از صداهای پیش‌فرض سیستم‌عامل استفاده کنید
   - در ویندوز: `C:\Windows\Media\`
   - صدای مناسب را کپی کرده و به `notification.mp3` تبدیل کنید

2. **دانلود رایگان:**
   - https://notificationsounds.com
   - https://freesound.org
   - https://mixkit.co/free-sound-effects/notification/

3. **ساخت صدای سفارشی:**
   - از ابزارهایی مثل Audacity استفاده کنید
   - صدایی کوتاه (1-2 ثانیه) بسازید
   - در فرمت MP3 ذخیره کنید

### مشخصات پیشنهادی:
- فرمت: MP3
- مدت: 1-2 ثانیه
- حجم: کمتر از 50KB
- کیفیت: 128kbps

### استفاده موقت (توسعه):
اگر الان فایل صوتی ندارید، می‌توانید از Web Audio API استفاده کنید:

```javascript
// در notificationSound.value به جای فایل MP3:
const audioContext = new AudioContext()
const oscillator = audioContext.createOscillator()
const gainNode = audioContext.createGain()

oscillator.connect(gainNode)
gainNode.connect(audioContext.destination)

oscillator.frequency.value = 800
oscillator.type = 'sine'

gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

oscillator.start(audioContext.currentTime)
oscillator.stop(audioContext.currentTime + 0.5)
```

این کد یک صدای ساده بیپ ایجاد می‌کند که نیاز به فایل خارجی ندارد.
