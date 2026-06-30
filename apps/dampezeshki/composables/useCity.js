// مدیریت شهر انتخاب شده در سراسر اپلیکیشن
import {ref} from "vue";

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