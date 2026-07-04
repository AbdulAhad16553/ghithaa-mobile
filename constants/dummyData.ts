import type { PlanId } from './content';
import type { MealSlot } from './mealSlots';

export type Locale = 'en' | 'ar';

export type Localized = { en: string; ar: string };

export type MenuCategory = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export type MenuItem = {
  id: string;
  name: Localized;
  category: MenuCategory;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  tags: Localized[];
  image: string;
  featured?: boolean;
};

export type OrderStatus = 'delivered' | 'out_for_delivery' | 'preparing' | 'scheduled' | 'cancelled';

export type DeliveryOrder = {
  id: string;
  date: string;
  dayLabel: Localized;
  mealId: string;
  status: OrderStatus;
  deliveryWindow: Localized;
  slot?: MealSlot;
};

export type PlanPricing = {
  planId: PlanId;
  priceMonthly: number;
  priceWeekly: number;
  mealsPerDay: number;
  caloriesRange: Localized;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: Localized;
  excerpt: Localized;
  date: string;
  readMinutes: number;
};

export const DEMO_CREDENTIALS = {
  email: 'demo@ghithaa.com',
  password: 'demo1234',
};

export const DEMO_USER = {
  id: 'usr_demo_001',
  name: 'Ahmed Al-Harbi',
  nameAr: 'أحمد الحربي',
  email: DEMO_CREDENTIALS.email,
  phone: '+966 55 123 4567',
  activePlan: undefined as PlanId | undefined,
  caloriesTarget: 1800,
  memberSince: '2025-09-12',
  address: {
    en: 'Al Rawdah District, Jeddah',
    ar: 'حي الروضة، جدة',
    building: '12',
    unit: '4B',
  },
  deliveryWindow: {
    en: '6:00 AM – 8:00 AM',
    ar: '6:00 ص – 8:00 ص',
  },
  paymentMethod: {
    brand: 'Visa',
    last4: '4242',
    expiry: '09/27',
  },
};

export const PLAN_PRICING: PlanPricing[] = [
  {
    planId: 'lose_weight',
    priceMonthly: 899,
    priceWeekly: 249,
    mealsPerDay: 3,
    caloriesRange: { en: '1,200 – 1,500 cal/day', ar: '1,200 – 1,500 سعرة/يوم' },
  },
  {
    planId: 'lifestyle',
    priceMonthly: 999,
    priceWeekly: 279,
    mealsPerDay: 3,
    caloriesRange: { en: '1,600 – 2,000 cal/day', ar: '1,600 – 2,000 سعرة/يوم' },
  },
  {
    planId: 'gain_muscle',
    priceMonthly: 1199,
    priceWeekly: 329,
    mealsPerDay: 4,
    caloriesRange: { en: '2,200 – 2,800 cal/day', ar: '2,200 – 2,800 سعرة/يوم' },
  },
];

const IMG = (id: string) => `https://ghithaa.com/upload/other/${id}.png`;

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'meal_01',
    name: { en: 'Grilled Chicken Bowl', ar: 'وعاء دجاج مشوي' },
    category: 'lunch',
    calories: 420,
    protein: 38,
    carbs: 32,
    fat: 12,
    tags: [{ en: 'High Protein', ar: 'عالي البروتين' }, { en: 'Gluten Free', ar: 'خالي من الغلوتين' }],
    image: IMG('f18bde8c-cdda-489a-af70-4b4b4a45963e'),
    featured: true,
  },
  {
    id: 'meal_02',
    name: { en: 'Salmon & Quinoa', ar: 'سلمون وكينوا' },
    category: 'dinner',
    calories: 480,
    protein: 32,
    carbs: 38,
    fat: 18,
    tags: [{ en: 'Omega-3', ar: 'أوميغا 3' }],
    image: IMG('92dad577-95d0-44b1-94f8-dcecd6bed2cc'),
    featured: true,
  },
  {
    id: 'meal_03',
    name: { en: 'Beef Stir Fry', ar: 'لحم بقري مقلي' },
    category: 'lunch',
    calories: 510,
    protein: 35,
    carbs: 42,
    fat: 16,
    tags: [{ en: 'High Protein', ar: 'عالي البروتين' }],
    image: IMG('4578d306-5768-4c22-bb8c-73dd1b252c66'),
    featured: true,
  },
  {
    id: 'meal_04',
    name: { en: 'Mediterranean Salad', ar: 'سلطة متوسطية' },
    category: 'lunch',
    calories: 320,
    protein: 18,
    carbs: 22,
    fat: 14,
    tags: [{ en: 'Low Carb', ar: 'قليل الكربوهيدرات' }, { en: 'Vegetarian', ar: 'نباتي' }],
    image: IMG('4c2773a3-2272-48eb-8287-ad8a115e9826'),
  },
  {
    id: 'meal_05',
    name: { en: 'Turkey Wrap', ar: 'لفافة ديك رومي' },
    category: 'lunch',
    calories: 390,
    protein: 28,
    carbs: 36,
    fat: 10,
    tags: [{ en: 'Balanced', ar: 'متوازن' }],
    image: IMG('aa439796-57b1-404c-a123-485f8b15419b'),
  },
  {
    id: 'meal_06',
    name: { en: 'Protein Pancakes', ar: 'بان كيك بروتين' },
    category: 'breakfast',
    calories: 350,
    protein: 22,
    carbs: 40,
    fat: 8,
    tags: [{ en: 'Breakfast', ar: 'فطور' }],
    image: IMG('ebde7ea3-c871-4f4f-96b8-5a46e875c5b3'),
    featured: true,
  },
  {
    id: 'meal_07',
    name: { en: 'Egg White Omelette', ar: 'أومليت بياض البيض' },
    category: 'breakfast',
    calories: 280,
    protein: 26,
    carbs: 8,
    fat: 14,
    tags: [{ en: 'Low Cal', ar: 'قليل السعرات' }],
    image: IMG('bcd79bdb-9e2c-4886-a373-54e417810294'),
  },
  {
    id: 'meal_08',
    name: { en: 'Shrimp Caesar Bowl', ar: 'وعاء سيزر بالروبيان' },
    category: 'dinner',
    calories: 440,
    protein: 34,
    carbs: 28,
    fat: 16,
    tags: [{ en: 'Seafood', ar: 'مأكولات بحرية' }],
    image: IMG('e06e7ed4-0331-48d4-966b-845361c421ec'),
  },
  {
    id: 'meal_09',
    name: { en: 'Greek Yogurt Parfait', ar: 'بارفيه زبادي يوناني' },
    category: 'snacks',
    calories: 220,
    protein: 14,
    carbs: 28,
    fat: 6,
    tags: [{ en: 'Snack', ar: 'وجبة خفيفة' }],
    image: IMG('cd897bc4-b1e0-477f-8bd6-5e7265fbc417'),
  },
  {
    id: 'meal_10',
    name: { en: 'Lean Beef Burger Bowl', ar: 'وعاء برجر لحم قليل الدهن' },
    category: 'dinner',
    calories: 520,
    protein: 40,
    carbs: 35,
    fat: 18,
    tags: [{ en: 'Muscle Gain', ar: 'بناء عضلات' }],
    image: IMG('f18bde8c-cdda-489a-af70-4b4b4a45963e'),
  },
  {
    id: 'meal_11',
    name: { en: 'Overnight Oats', ar: 'شوفان ليلي' },
    category: 'breakfast',
    calories: 310,
    protein: 12,
    carbs: 48,
    fat: 8,
    tags: [{ en: 'Fiber Rich', ar: 'غني بالألياف' }],
    image: IMG('92dad577-95d0-44b1-94f8-dcecd6bed2cc'),
  },
  {
    id: 'meal_12',
    name: { en: 'Tuna Poke Bowl', ar: 'وعاء بوكي تونة' },
    category: 'lunch',
    calories: 410,
    protein: 36,
    carbs: 30,
    fat: 12,
    tags: [{ en: 'Fresh', ar: 'طازج' }],
    image: IMG('4578d306-5768-4c22-bb8c-73dd1b252c66'),
  },
  {
    id: 'meal_13',
    name: { en: 'Spinach Feta Wrap', ar: 'لفافة سبانخ وفيتا' },
    category: 'breakfast',
    calories: 330,
    protein: 16,
    carbs: 34,
    fat: 12,
    tags: [{ en: 'Vegetarian', ar: 'نباتي' }],
    image: IMG('bcd79bdb-9e2c-4886-a373-54e417810294'),
  },
  {
    id: 'meal_14',
    name: { en: 'Avocado Toast & Egg', ar: 'توست أفوكادو وبيض' },
    category: 'breakfast',
    calories: 360,
    protein: 18,
    carbs: 30,
    fat: 18,
    tags: [{ en: 'Healthy Fats', ar: 'دهون صحية' }],
    image: IMG('ebde7ea3-c871-4f4f-96b8-5a46e875c5b3'),
  },
  {
    id: 'meal_15',
    name: { en: 'Chicken Shawarma Bowl', ar: 'وعاء شاورما دجاج' },
    category: 'lunch',
    calories: 470,
    protein: 39,
    carbs: 36,
    fat: 15,
    tags: [{ en: 'High Protein', ar: 'عالي البروتين' }],
    image: IMG('f18bde8c-cdda-489a-af70-4b4b4a45963e'),
  },
  {
    id: 'meal_16',
    name: { en: 'Falafel Quinoa Plate', ar: 'طبق فلافل وكينوا' },
    category: 'lunch',
    calories: 430,
    protein: 20,
    carbs: 52,
    fat: 16,
    tags: [{ en: 'Vegan', ar: 'نباتي صرف' }],
    image: IMG('4c2773a3-2272-48eb-8287-ad8a115e9826'),
  },
  {
    id: 'meal_17',
    name: { en: 'Grilled Sea Bass', ar: 'قاروص مشوي' },
    category: 'dinner',
    calories: 450,
    protein: 38,
    carbs: 20,
    fat: 22,
    tags: [{ en: 'Omega-3', ar: 'أوميغا 3' }],
    image: IMG('e06e7ed4-0331-48d4-966b-845361c421ec'),
  },
  {
    id: 'meal_18',
    name: { en: 'Teriyaki Chicken & Rice', ar: 'دجاج ترياكي وأرز' },
    category: 'dinner',
    calories: 540,
    protein: 42,
    carbs: 48,
    fat: 14,
    tags: [{ en: 'Muscle Gain', ar: 'بناء عضلات' }],
    image: IMG('4578d306-5768-4c22-bb8c-73dd1b252c66'),
  },
  {
    id: 'meal_19',
    name: { en: 'Protein Energy Balls', ar: 'كرات الطاقة بالبروتين' },
    category: 'snacks',
    calories: 180,
    protein: 10,
    carbs: 20,
    fat: 7,
    tags: [{ en: 'Snack', ar: 'وجبة خفيفة' }],
    image: IMG('cd897bc4-b1e0-477f-8bd6-5e7265fbc417'),
  },
  {
    id: 'meal_20',
    name: { en: 'Mixed Nuts & Fruit Cup', ar: 'مكسرات وفواكه' },
    category: 'snacks',
    calories: 210,
    protein: 7,
    carbs: 22,
    fat: 12,
    tags: [{ en: 'Fiber Rich', ar: 'غني بالألياف' }],
    image: IMG('92dad577-95d0-44b1-94f8-dcecd6bed2cc'),
  },
  {
    id: 'meal_21',
    name: { en: 'Hummus & Veggie Sticks', ar: 'حمص وخضار' },
    category: 'snacks',
    calories: 160,
    protein: 8,
    carbs: 18,
    fat: 8,
    tags: [{ en: 'Vegan', ar: 'نباتي صرف' }],
    image: IMG('4c2773a3-2272-48eb-8287-ad8a115e9826'),
  },
  {
    id: 'meal_22',
    name: { en: 'Cottage Cheese & Berries', ar: 'جبن قريش وتوت' },
    category: 'snacks',
    calories: 190,
    protein: 18,
    carbs: 16,
    fat: 5,
    tags: [{ en: 'High Protein', ar: 'عالي البروتين' }],
    image: IMG('cd897bc4-b1e0-477f-8bd6-5e7265fbc417'),
  },
  {
    id: 'meal_23',
    name: { en: 'Dark Chocolate Protein Bar', ar: 'لوح بروتين بالشوكولاتة' },
    category: 'snacks',
    calories: 220,
    protein: 20,
    carbs: 18,
    fat: 9,
    tags: [{ en: 'Snack', ar: 'وجبة خفيفة' }],
    image: IMG('ebde7ea3-c871-4f4f-96b8-5a46e875c5b3'),
  },
];

export const UPCOMING_DELIVERIES: DeliveryOrder[] = [
  {
    id: 'ord_up_01',
    date: '2026-07-01',
    dayLabel: { en: 'Tuesday, Jul 1', ar: 'الثلاثاء ١ يوليو' },
    mealId: 'meal_01',
    status: 'out_for_delivery',
    deliveryWindow: { en: '6:00 – 8:00 AM', ar: '6:00 – 8:00 ص' },
  },
  {
    id: 'ord_up_02',
    date: '2026-07-02',
    dayLabel: { en: 'Wednesday, Jul 2', ar: 'الأربعاء ٢ يوليو' },
    mealId: 'meal_06',
    status: 'preparing',
    deliveryWindow: { en: '6:00 – 8:00 AM', ar: '6:00 – 8:00 ص' },
  },
  {
    id: 'ord_up_03',
    date: '2026-07-03',
    dayLabel: { en: 'Thursday, Jul 3', ar: 'الخميس ٣ يوليو' },
    mealId: 'meal_02',
    status: 'scheduled',
    deliveryWindow: { en: '6:00 – 8:00 AM', ar: '6:00 – 8:00 ص' },
  },
  {
    id: 'ord_up_04',
    date: '2026-07-04',
    dayLabel: { en: 'Friday, Jul 4', ar: 'الجمعة ٤ يوليو' },
    mealId: 'meal_04',
    status: 'scheduled',
    deliveryWindow: { en: '6:00 – 8:00 AM', ar: '6:00 – 8:00 ص' },
  },
  {
    id: 'ord_up_05',
    date: '2026-07-05',
    dayLabel: { en: 'Saturday, Jul 5', ar: 'السبت ٥ يوليو' },
    mealId: 'meal_03',
    status: 'scheduled',
    deliveryWindow: { en: '6:00 – 8:00 AM', ar: '6:00 – 8:00 ص' },
  },
];

export const PAST_ORDERS: DeliveryOrder[] = [
  {
    id: 'ord_past_01',
    date: '2026-06-30',
    dayLabel: { en: 'Monday, Jun 30', ar: 'الاثنين ٣٠ يونيو' },
    mealId: 'meal_08',
    status: 'delivered',
    deliveryWindow: { en: '6:42 AM', ar: '6:42 ص' },
  },
  {
    id: 'ord_past_02',
    date: '2026-06-29',
    dayLabel: { en: 'Sunday, Jun 29', ar: 'الأحد ٢٩ يونيو' },
    mealId: 'meal_05',
    status: 'delivered',
    deliveryWindow: { en: '7:15 AM', ar: '7:15 ص' },
  },
  {
    id: 'ord_past_03',
    date: '2026-06-28',
    dayLabel: { en: 'Saturday, Jun 28', ar: 'السبت ٢٨ يونيو' },
    mealId: 'meal_07',
    status: 'delivered',
    deliveryWindow: { en: '6:58 AM', ar: '6:58 ص' },
  },
  {
    id: 'ord_past_04',
    date: '2026-06-27',
    dayLabel: { en: 'Friday, Jun 27', ar: 'الجمعة ٢٧ يونيو' },
    mealId: 'meal_09',
    status: 'cancelled',
    deliveryWindow: { en: '—', ar: '—' },
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog_01',
    slug: 'How-Nutrition-Affects-Sleep-Quality-What-to-Eat-and-Avoid',
    title: {
      en: 'How Nutrition Affects Sleep Quality',
      ar: 'كيف يؤثر التغذية على جودة النوم',
    },
    excerpt: {
      en: 'Discover which foods help you sleep better and what to avoid before bedtime.',
      ar: 'اكتشف الأطعمة التي تساعدك على النوم بشكل أفضل وما يجب تجنبه قبل النوم.',
    },
    date: '2025-01-27',
    readMinutes: 5,
  },
  {
    id: 'blog_02',
    slug: 'How-Ready-to-Eat-Healthy-Meals-Help-You-Achieve-Your-Health-Goals',
    title: {
      en: 'How Ready-to-Eat Meals Help Your Goals',
      ar: 'كيف تساعدك الوجبات الجاهزة على تحقيق أهدافك',
    },
    excerpt: {
      en: 'Meal prep saves time and keeps you on track with your health targets.',
      ar: 'تحضير الوجبات يوفر الوقت ويبقيك على المسار الصحيح لأهدافك.',
    },
    date: '2025-01-26',
    readMinutes: 4,
  },
  {
    id: 'blog_03',
    slug: 'The-Benefits-of-Healthy-Eating-Small-Steps-Big-Changes',
    title: {
      en: 'Small Steps, Big Changes',
      ar: 'خطوات صغيرة، تغييرات كبيرة',
    },
    excerpt: {
      en: 'Healthy eating habits start with simple daily choices.',
      ar: 'عادات الأكل الصحي تبدأ بخيارات يومية بسيطة.',
    },
    date: '2025-01-26',
    readMinutes: 3,
  },
];

export const HOME_STATS = {
  caloriesConsumedToday: 1240,
  caloriesTarget: 1800,
  deliveryStreak: 47,
  nextDeliveryMealId: 'meal_01',
};

export const CATEGORY_LABELS: Record<MenuCategory, Localized> = {
  breakfast: { en: 'Breakfast', ar: 'فطور' },
  lunch: { en: 'Lunch', ar: 'غداء' },
  dinner: { en: 'Dinner', ar: 'عشاء' },
  snacks: { en: 'Snacks', ar: 'وجبات خفيفة' },
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, Localized> = {
  delivered: { en: 'Delivered', ar: 'تم التوصيل' },
  out_for_delivery: { en: 'Out for delivery', ar: 'في الطريق' },
  preparing: { en: 'Preparing', ar: 'قيد التحضير' },
  scheduled: { en: 'Scheduled', ar: 'مجدول' },
  cancelled: { en: 'Cancelled', ar: 'ملغي' },
};

export function loc(text: Localized, locale: Locale): string {
  return text[locale];
}

export function getMenuItem(id: string): MenuItem | undefined {
  return MENU_ITEMS.find((m) => m.id === id);
}

export function getPlanPricing(planId: PlanId): PlanPricing | undefined {
  return PLAN_PRICING.find((p) => p.planId === planId);
}

export function getFeaturedMeals(): MenuItem[] {
  return MENU_ITEMS.filter((m) => m.featured);
}

export function getMealsByCategory(category: MenuCategory): MenuItem[] {
  return MENU_ITEMS.filter((m) => m.category === category);
}
