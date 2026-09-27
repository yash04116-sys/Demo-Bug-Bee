export const products = [
  { slug: "field-kit", name: "The Field Kit", category: "ESSENTIALS", price: 48, tone: "olive", number: "01", description: "The tools you reach for every day, ready to go wherever ideas find you.", details: ["Heavyweight canvas zip pouch", "Pocket notebook, 64 pages", "Two graphite pencils"] },
  { slug: "trail-lamp", name: "The Trail Lamp", category: "LIGHTING", price: 86, tone: "clay", number: "02", description: "A warm, portable light for late evenings and early starts.", details: ["Warm dimmable light", "Rechargeable battery", "Aluminum carrying handle"] },
  { slug: "desk-flask", name: "The Desk Flask", category: "DRINKWARE", price: 34, tone: "blue", number: "03", description: "Your familiar cup of something good, kept at just the right temperature.", details: ["Double wall stainless steel", "Leak resistant lid", "12 oz capacity"] },
] as const;
export type Product = (typeof products)[number];
export function findProduct(slug: string) { return products.find((product) => product.slug === slug); }
