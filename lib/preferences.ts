import AsyncStorage from '@react-native-async-storage/async-storage';

const CITY_KEY = 'ghithaa_city';

export type SavedCity = { en: string; ar: string };

export async function getSavedCity(): Promise<SavedCity | null> {
  const raw = await AsyncStorage.getItem(CITY_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function saveCity(city: SavedCity): Promise<void> {
  await AsyncStorage.setItem(CITY_KEY, JSON.stringify(city));
}
