export type PlanId = 'lose_weight' | 'lifestyle' | 'gain_muscle';

export type Plan = {
  id: PlanId;
  number: string;
  image: string;
};

export type Meal = {
  id: string;
  image: string;
};

export type Review = {
  id: string;
  name: string;
  rating: number;
  text: { en: string; ar: string };
};

export type Feature = {
  id: string;
  icon: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
};

export const PLANS: Plan[] = [
  {
    id: 'lose_weight',
    number: '01',
    image: 'https://ghithaa.com/static/frontend/appiq/assets/images/how1.png',
  },
  {
    id: 'lifestyle',
    number: '02',
    image: 'https://ghithaa.com/static/frontend/appiq/assets/images/how2.png',
  },
  {
    id: 'gain_muscle',
    number: '03',
    image: 'https://ghithaa.com/static/frontend/appiq/assets/images/how3.png',
  },
];

export const MEALS: Meal[] = [
  { id: '1', image: 'https://ghithaa.com/upload/other/f18bde8c-cdda-489a-af70-4b4b4a45963e.png' },
  { id: '2', image: 'https://ghithaa.com/upload/other/92dad577-95d0-44b1-94f8-dcecd6bed2cc.png' },
  { id: '3', image: 'https://ghithaa.com/upload/other/4578d306-5768-4c22-bb8c-73dd1b252c66.png' },
  { id: '4', image: 'https://ghithaa.com/upload/other/4c2773a3-2272-48eb-8287-ad8a115e9826.png' },
  { id: '5', image: 'https://ghithaa.com/upload/other/aa439796-57b1-404c-a123-485f8b15419b.png' },
  { id: '6', image: 'https://ghithaa.com/upload/other/ebde7ea3-c871-4f4f-96b8-5a46e875c5b3.png' },
  { id: '7', image: 'https://ghithaa.com/upload/other/bcd79bdb-9e2c-4886-a373-54e417810294.png' },
  { id: '8', image: 'https://ghithaa.com/upload/other/e06e7ed4-0331-48d4-966b-845361c421ec.png' },
  { id: '9', image: 'https://ghithaa.com/upload/other/cd897bc4-b1e0-477f-8bd6-5e7265fbc417.png' },
];

export const FEATURES: Feature[] = [
  { id: 'quality', icon: 'restaurant-outline' },
  { id: 'delivery', icon: 'snow-outline' },
  { id: 'app', icon: 'phone-portrait-outline' },
  { id: 'support', icon: 'headset-outline' },
];

export const REVIEWS: Review[] = [
  {
    id: '1',
    name: 'رائد عبدالعزيز',
    rating: 5,
    text: {
      ar: 'الأكل نظيف و القائمة متنوعة و مندوب التوصيل ممتاز جداً و متعاون بشكل كبير👍',
      en: 'Clean food, varied menu, and an excellent, very cooperative delivery driver 👍',
    },
  },
  {
    id: '2',
    name: 'فاطمه المسعودي',
    rating: 5,
    text: {
      ar: 'التجربه مع غذاء جدا رائعه حيث الجوده ونظافة الاكل ، ثالث اشتراك معاكم بدون ملل من التكرار ولانكم مميزين ومحل ثقة',
      en: 'My experience with Ghithaa is wonderful — quality and clean food. Third subscription with you, never bored of repetition because you are trusted and distinctive.',
    },
  },
  {
    id: '3',
    name: 'Sarah Al-Rashid',
    rating: 5,
    text: {
      en: 'Ghithaa changed my relationship with food. Convenient, tasty, and perfectly portioned every day.',
      ar: 'غذاء غيّر علاقتي بالطعام. مريح ولذيذ وبحصص مثالية كل يوم.',
    },
  },
];

export const SUPPORT = {
  whatsapp: '+966920031961',
  whatsappUrl: 'https://wa.me/966920031961',
  email: 'support@ghithaa.com',
  phone: '+966920031961',
};

export const BRAND_LINKS = {
  website: 'https://ghithaa.com',
  about: 'https://ghithaa.com/about-us',
  terms: 'https://ghithaa.com/terms-and-conditions',
  privacy: 'https://ghithaa.com/privacy-policy',
  contact: 'https://ghithaa.com/contact-us',
} as const;

export const HERO_TAGLINES = {
  en: [
    'Meals delivered right to your doorstep',
    'A variety of daily meals',
    'Morning or evening delivery options',
  ],
  ar: [
    'وجبات تُوصّل لباب منزلك',
    'تنوع يومي في الوجبات',
    'خيارات توصيل صباحية أو مسائية',
  ],
};
