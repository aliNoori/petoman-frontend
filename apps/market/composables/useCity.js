import { ref, readonly } from 'vue'

// مدیریت شهر انتخاب شده در سراسر اپلیکیشن
const selectedCity = ref('تهران')

export function useCity() {
  const setSelectedCity = (city) => {
    selectedCity.value = city
  }

  return {
    selectedCity: readonly(selectedCity),
    setSelectedCity
  }
}