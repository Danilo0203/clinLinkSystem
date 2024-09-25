import { Demo } from '@/types';

export const ProductService = {
    async getProductsSmall() {
        const res = await fetch('/demo/data/products-small.json', { headers: { 'Cache-Control': 'no-cache' } });
        const d = await res.json();
        return d.data as Demo.Product[];
    },

    async getProducts() {
        const res = await fetch('/demo/data/products.json', { headers: { 'Cache-Control': 'no-cache' } });
        const d = await res.json();
        return d.data as Demo.Product[];
    },

    async getProductsWithOrdersSmall() {
        const res = await fetch('/demo/data/products-orders-small.json', { headers: { 'Cache-Control': 'no-cache' } });
        const d = await res.json();
        return d.data as Demo.Product[];
    }
};
