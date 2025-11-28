// src/data/productsdata.ts
export type Product = {
id: string;
name: string;
price: number;
type: "Patch Pack" | "Sample Pack" | "Wavetable";
platform: string[];
paid: boolean;
bundle: boolean;
image: string;
gumroadUrl: string;
date: string;
demoUrl?: string; // オプショナル
};