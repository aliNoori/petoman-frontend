/**
 * Image Moderation Composable (CDN Version)
 */

let cocoSsdLoaded = false
let cocoModel: any = null
let loadingPromise: Promise<boolean> | null = null

const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`)
    if (existing) { resolve(); return }
    
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.crossOrigin = 'anonymous'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(script)
  })
}

export const useImageModeration = () => {
  const loadModel = async () => {
    if (loadingPromise) return loadingPromise
    if (cocoSsdLoaded) return true
    if (!import.meta.client) return false

    loadingPromise = (async () => {
      try {
        await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.11.0/dist/tf.min.js')
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (typeof (window as any).tf === 'undefined') throw new Error('TensorFlow.js failed')
        
        const tf = (window as any).tf
        await tf.ready()
        
        await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.3/dist/coco-ssd.min.js')
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (typeof (window as any).cocoSsd === 'undefined') throw new Error('COCO-SSD failed')
        
        const cocoSsd = (window as any).cocoSsd
        cocoModel = await cocoSsd.load({ base: 'lite_mobilenet_v2' })
        cocoSsdLoaded = true
        return true
      } catch (error) {
        console.error('Error loading models:', error)
        loadingPromise = null
        return false
      }
    })()
    
    return loadingPromise
  }

  const checkImageFile = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      return { safe: false, message: 'حجم فایل بیش از 10MB است' }
    }
    
    if (!file.type.startsWith('image/')) {
      return { safe: false, message: 'فقط تصویر مجاز است' }
    }
    
    if (!import.meta.client || !cocoSsdLoaded) {
      return { safe: true, message: '' }
    }

    try {
      const img = await createImageFromFile(file)
      
      if (cocoSsdLoaded && cocoModel) {
        const predictions = await cocoModel.detect(img)
        const persons = predictions.filter((p: any) => p.class === 'person' && p.score > 0.3)
        
        if (persons.length > 0) {
          return { safe: false, message: 'ارسال تصویر انسان ممنوع است' }
        }
      }
      
      return { safe: true, message: '' }
    } catch (error) {
      console.error('Detection error:', error)
      return { safe: true, message: '' }
    }
  }
  
  const createImageFromFile = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const url = URL.createObjectURL(file)
      img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed')) }
      img.src = url
    })
  }
  
  return { loadModel, checkImageFile }
}
