import { defineStore } from 'pinia';
import { inject, ref, computed } from 'vue';
import { type AxiosInstance } from 'axios';
import { axiosKey } from "../../plugins/axiosPlugins";

// ────────────── Types & Interfaces ──────────────

export interface Category {
    id: string;
    title: string; // API returns 'title'
    slug: string;
    parentId: string | null;
    isActive: boolean;
    children?: Category[]; // For the tree structure
}

export const useCategoryStore = defineStore('categoryStore', () => {
    // ────────────── State ──────────────
    const rawCategories = ref<Category[]>([]); // Flat list from API
    const loading = ref(false);
    const fetched = ref(false);

    const axios = inject<AxiosInstance>(axiosKey);
    if (!axios) throw new Error('Axios instance not injected');

    // ────────────── Computed (Transform Flat API Data to Tree Structure) ──────────────

    /**
     * Transforms the flat category list into a nested tree structure.
     * Structure: { id, name: title, children: [...] }
     */
    const categories = computed(() => {
        // 1. Create a map for quick lookup
        const categoryMap: Record<string, Category> = {};
        rawCategories.value.forEach(cat => {
            categoryMap[cat.id] = {
                id: cat.id,
                name: cat.title, // Map 'title' to 'name' to match Mock structure
                slug: cat.slug,
                parentId: cat.parentId,
                isActive: cat.isActive,
                children: []
            };
        });

        const tree: Category[] = [];

        // 2. Build the tree by linking children to parents
        rawCategories.value.forEach(cat => {
            const node = categoryMap[cat.id];
            if (cat.parentId && categoryMap[cat.parentId]) {
                // If it has a parent, add it to the parent's children array
                categoryMap[cat.parentId].children!.push(node);
            } else {
                // If it has no parent, it's a root node
                tree.push(node);
            }
        });

        return tree;
    });

    // ────────────── API Actions ──────────────

    const fetchCategories = async () => {
        loading.value = true;
        try {
            const res = await axios.get('/market/categories/list');
            // API returns a flat list
            rawCategories.value = res.data;
            fetched.value = true;
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            loading.value = false;
        }
    };

    return {
        // State (Computed)
        categories, // Returns the tree structure
        loading,
        fetched,

        // Actions
        fetchCategories,
    };
});