import { 
  containsOffensiveContent, 
  isValidPersianText,
  containsUrl,
  containsEmail,
  containsPhoneNumber
} from '../utils/offensive-words'

/**
 * Content moderation endpoint
 * STEP 1: Block URLs and links
 * STEP 2: Block email addresses
 * STEP 3: Block phone numbers (optional)
 * STEP 4: Block all non-Persian text (English/Latin characters)
 * STEP 5: Check for offensive Persian words (keyword-based filter)
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { text } = body

    // Validate input
    if (!text || typeof text !== 'string') {
      return {
        allowed: false,
        reason: 'متن نامعتبر است'
      }
    }

    // Empty text is allowed
    if (text.trim().length === 0) {
      return { allowed: true }
    }

    console.log('🔍 Checking message:', text.substring(0, 50) + (text.length > 50 ? '...' : ''))

    // STEP 1: Check for URLs/Links
    if (containsUrl(text)) {
      console.log('⛔ Content BLOCKED - URL/Link detected')
      return {
        allowed: false,
        reason: '🚫 ارسال لینک و آدرس سایت ممنوع است'
      }
    }

    // STEP 2: Check for email addresses
    if (containsEmail(text)) {
      console.log('⛔ Content BLOCKED - Email detected')
      return {
        allowed: false,
        reason: '🚫 ارسال ایمیل ممنوع است'
      }
    }

    // STEP 3: Check for phone numbers (optional - uncomment if needed)
    // if (containsPhoneNumber(text)) {
    //   console.log('⛔ Content BLOCKED - Phone number detected')
    //   return {
    //     allowed: false,
    //     reason: '🚫 ارسال شماره تلفن ممنوع است'
    //   }
    // }

    // STEP 4: Check for English characters (block immediately)
    if (!isValidPersianText(text)) {
      console.log('⛔ Content BLOCKED - English/Latin characters not allowed')
      return {
        allowed: false,
        reason: '⚠️ لطفاً فقط از حروف فارسی استفاده کنید'
      }
    }

    // STEP 5: Quick keyword check (instant, no AI needed)
    if (containsOffensiveContent(text)) {
      console.log('⛔ Content BLOCKED by keyword filter')
      return {
        allowed: false,
        reason: '🚫 پیام دارای محتوای نامناسب است'
      }
    }

    // Content is clean
    console.log('✅ Content APPROVED')
    return {
      allowed: true
    }

  } catch (error: any) {
    console.error('❌ Error in moderation system:', error)
    
    // In case of error, allow the message but log it for review
    return {
      allowed: true,
      warning: 'Moderation check failed - message sent without full validation'
    }
  }
})
