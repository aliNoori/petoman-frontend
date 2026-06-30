export interface Supporter {
  id: number
  name: string
  role: string
  bio: string
  joinDate: string
  donationAmount: number
  petsHelped: number
  supporterNumber: string
}

export interface CertificateSupporter {
  name: string
  supporterNumber: string
  joinDate: string
}

export interface VideoData {
  id: string
  title: string
  description: string
  thumbnail: string
  videoUrl: string
  duration: string
  publishDate: string
  category: string
  views: number
  storyText: string[]
}

export interface CategoryData {
  id: string
  name: string
  icon: string
  description: string
  count: number
  color: string
}

export interface FAQItem {
  id: string
  category: string
  question: string
  answer: string
  links?: {
    title: string
    url: string
  }[]
}
