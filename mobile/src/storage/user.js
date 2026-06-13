import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_ID_KEY = 'timorize_userId';

export async function getUserId() {
  return AsyncStorage.getItem(USER_ID_KEY);
}

export async function setUserId(userId) {
  await AsyncStorage.setItem(USER_ID_KEY, userId);
}

export async function clearUserId() {
  await AsyncStorage.removeItem(USER_ID_KEY);
}
