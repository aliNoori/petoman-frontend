import { defineStore } from 'pinia';
import { inject, ref, computed } from 'vue';
import { type AxiosInstance } from 'axios';
import { axiosKey } from "../../plugins/axiosPlugins";

// ────────────── Types & Interfaces ──────────────

export interface Animal {
    id: string;
    slug: string;
    name: string;
    icon: string;
    code: string;
}

export interface Brand {
    id: string;
    slug: string;
    name: string;
    code: string;
    // در پاسخ API جدید، این فیلدها وجود ندارند، اما در computed استفاده می‌شوند
    animalSlug?: string;
}

export interface Attribute {
    id: string;
    slug: string;
    name: string;
    type: string;
    // در پاسخ API جدید، این فیلدها وجود ندارند
    animalSlug?: string;
}

export const useReferenceStore = defineStore('referenceStore', () => {
    // ────────────── State ──────────────
    const animals = ref<Animal[]>([]);
    const rawBrands = ref<Brand[]>([]); // Flat list from API (with relations)
    const rawAttributes = ref<Attribute[]>([]); // Flat list from API (with relations)

    const loading = ref(false);
    const fetched = ref(false);

    const axios = inject<AxiosInstance>(axiosKey);
    if (!axios) throw new Error('Axios instance not injected');

    // ────────────── Computed (Transform API Data to Mock Structure) ──────────────

    /**
     * Transforms the flat brand list (with nested animals) into an object grouped by animal slug.
     * Structure: { cat: [...], dog: [...] }
     */
    const brands = computed(() => {
        const grouped: Record<string, Brand[]> = {};

        rawBrands.value.forEach(brand => {
            // چون رابطه Many-to-Many است، هر برند ممکن است چند حیوان داشته باشد
            if (brand.animals && Array.isArray(brand.animals)) {
                brand.animals.forEach(animal => {
                    if (!grouped[animal.slug]) {
                        grouped[animal.slug] = [];
                    }
                    // Return only necessary fields to match Mock structure
                    grouped[animal.slug].push({
                        id: brand.id,
                        slug: brand.slug,
                        name: brand.name,
                        code: brand.code
                    });
                });
            }
        });

        return grouped;
    });

    /**
     * Transforms the flat attribute list (with nested animals) into a nested object.
     * Structure: { cat: { taste: [...], age: [...] }, ... }
     */
    const attributes = computed(() => {
        const groupedByAnimal: Record<string, Record<string, Attribute[]>> = {};

        rawAttributes.value.forEach(attr => {
            // چون رابطه Many-to-Many است، هر ویژگی ممکن است چند حیوان داشته باشد
            if (attr.animals && Array.isArray(attr.animals)) {
                attr.animals.forEach(animal => {
                    // 1. Group by Animal
                    if (!groupedByAnimal[animal.slug]) {
                        groupedByAnimal[animal.slug] = {};
                    }

                    // 2. Group by Type (taste, age, etc.)
                    if (!groupedByAnimal[animal.slug][attr.type]) {
                        groupedByAnimal[animal.slug][attr.type] = [];
                    }

                    // 3. Add attribute
                    groupedByAnimal[animal.slug][attr.type].push({
                        id: attr.id,
                        slug: attr.slug,
                        name: attr.name
                    });
                });
            }
        });

        return groupedByAnimal;
    });

    // ────────────── API Actions ──────────────

    const fetchAnimals = async () => {
        loading.value = true;
        try {
            const res = await axios.get('/reference/animals');
            animals.value = res.data;
        } catch (error) {
            console.error('Error fetching animals:', error);
        } finally {
            loading.value = false;
        }
    };

    const fetchBrands = async () => {
        loading.value = true;
        try {
            // API باید روابط animals را برگرداند
            const res = await axios.get('/reference/brands');
            rawBrands.value = res.data;
        } catch (error) {
            console.error('Error fetching brands:', error);
        } finally {
            loading.value = false;
        }
    };

    const fetchAttributes = async () => {
        loading.value = true;
        try {
            // API باید روابط animals را برگرداند
            const res = await axios.get('/reference/attributes');
            rawAttributes.value = res.data;
        } catch (error) {
            console.error('Error fetching attributes:', error);
        } finally {
            loading.value = false;
        }
    };

    /**
     * Fetches all reference data at once
     */
    const fetchAll = async () => {
        if (fetched.value) return; // Prevent duplicate calls

        loading.value = true;
        try {
            // Fetch all data in parallel
            await Promise.all([
                fetchAnimals(),
                fetchBrands(),
                fetchAttributes()
            ]);
            fetched.value = true;
        } catch (error) {
            console.error('Error fetching reference data:', error);
        } finally {
            loading.value = false;
        }
    };

    return {
        // State
        animals,
        brands, // Computed property with Mock-like structure
        attributes, // Computed property with Mock-like structure
        loading,
        fetched,

        // Actions
        fetchAnimals,
        fetchBrands,
        fetchAttributes,
        fetchAll
    };
});