import { defineStore } from "pinia";
import { ref } from "vue";
import { useNuxtApp } from "nuxt/app";
import type { AxiosInstance } from "axios";

export interface Pet {
    id: string;
    name: string;
    type: 'DOG' | 'CAT' | 'BIRD' | 'OTHER';
    breed?: string;
    age?: number;
    gender?: string;
    weight?: number;
    color?: string;
    microchip?: string;
    isNeutered?: boolean;
    medicalHistory?: string;
    description?: string;
    logo?: string; // جایگزین logo شده یا به عنوان فیلد جداگانه
    ownerId: string;
}

export const usePetStore = defineStore("pet", () => {
    const pets = ref<Pet[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const { $axios } = useNuxtApp();
    const axios = $axios as AxiosInstance;

    /**
     * دریافت لیست حیوانات کاربر
     */
    const fetchPets = async () => {
        loading.value = true;
        error.value = null;
        try {
            const res = await axios.get("/pets"); // فرض بر اینکه اندپوینت /pets است
            pets.value = res.data;
        } catch (err: any) {
            console.error("Error fetching pets:", err);
            error.value = err.response?.data?.message || "خطا در دریافت لیست حیوانات";
        } finally {
            loading.value = false;
        }
    };

    /**
     * افزودن حیوان جدید
     */
    const createPet = async (petData: Partial<Pet>) => {
        loading.value = true;
        error.value = null;
        try {
            const res = await axios.post("/pets", petData);
            // اضافه کردن به لیست محلی برای جلوگیری از رفرش
            pets.value.unshift(res.data);
            return res.data;
        } catch (err: any) {
            console.error("Error creating pet:", err);
            error.value = err.response?.data?.message || "خطا در ثبت حیوان";
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * به‌روزرسانی اطلاعات حیوان
     */
    const updatePet = async (id: string, updates: Partial<Pet>) => {
        loading.value = true;
        try {
            const res = await axios.patch(`/pets/${id}`, updates);
            const index = pets.value.findIndex((p) => p.id === id);
            if (index !== -1) {
                pets.value[index] = { ...pets.value[index], ...res.data };
            }
            return res.data;
        } catch (err: any) {
            console.error("Error updating pet:", err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return {
        pets,
        loading,
        error,
        fetchPets,
        createPet,
        updatePet,
    };
});