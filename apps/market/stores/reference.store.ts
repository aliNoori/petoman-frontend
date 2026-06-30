import { defineStore } from 'pinia';
import { ref } from 'vue';
import {ReferenceService} from "../services/reference.service";

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
    animalSlug?: string;
}

export interface Attribute {
    id: string;
    slug: string;
    name: string;
    type: string;
    animalSlug?: string;
}

export const useReferenceStore = defineStore('referenceStore', () => {
    // ────────────── State ──────────────
    const animals = ref<Animal[]>([]);
    const brands = ref<Brand[]>([]); // Flat list from API (with relations)
    const attributes = ref<Attribute[]>([]); // Flat list from API (with relations)
    // ────────────── Computed (Transform API Data to Mock Structure) ──────────────
    const fetchBrands = async () => {

        brands.value = await ReferenceService.fetchBrands();

    }
    const fetchAnimals = async () => {

        animals.value = await ReferenceService.fetchAnimals();

    }

    const fetchAttributes = async () => {

        attributes.value = await ReferenceService.fetchAttributes();

    }


    return {
        // State
        animals,
        brands, // Computed property with Mock-like structure
        attributes, // Computed property with Mock-like structure

        // Actions
        fetchAnimals,
        fetchBrands,
        fetchAttributes,
    };
});