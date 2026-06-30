<template>
  <ClientOnly>
  <AddressSelector
    v-model="cityData"
    placeholder="انتخاب شهر"
    title="انتخاب شهر از روی نقشه"
    button-class="text-gray-600 hover:text-gray-900"
    @update:modelValue="onCitySelected"
  />
  </ClientOnly>
</template>

<script setup>
const { selectedCity, setSelectedCity } = useCity()

const cityData = ref({
  address: '',
  province: '',
  city: selectedCity.value || '',
  location: null
})

const onCitySelected = (data) => {
  if (data.city) {
    setSelectedCity(data.city)
    console.log('City selected:', data)
  }
}
</script>