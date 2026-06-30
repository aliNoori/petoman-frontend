export const generateSlug = (id: string, firstName: string, lastName: string) => {
  const persianToLatin = (text: string) => {
    const persianToLatinMap: { [key: string]: string } = {
      'ا': 'a', 'آ': 'a', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ث': 's',
      'ج': 'j', 'چ': 'ch', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'z',
      'ر': 'r', 'ز': 'z', 'ژ': 'zh', 'س': 's', 'ش': 'sh', 'ص': 's',
      'ض': 'z', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f',
      'ق': 'gh', 'ک': 'k', 'گ': 'g', 'ل': 'l', 'م': 'm', 'ن': 'n',
      'و': 'v', 'ه': 'h', 'ی': 'y', 'ئ': 'y'
    }
    return text.split('').map(char => persianToLatinMap[char] || char).join('')
  }
  
  const nameSlug = `${persianToLatin(firstName)}-${persianToLatin(lastName)}`.toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  
  return `${id}-${nameSlug}`
}

export const extractIdFromSlug = (slug: string): string | null => {
  if (!slug) return null

  const parts = slug.split('-')
  const id = parts[0]
  return id && id.trim().length > 0 ? id : null
}
