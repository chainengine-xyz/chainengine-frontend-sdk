export abstract class LocalStorage {
  static setValue(key: string, value: any) {
    if (typeof window === 'undefined') {
      console.error(
        `Tried setting localStorage key “${key}” even though environment is not a client`
      );
    }

    try {
      if (typeof value === 'string') {
        window.localStorage.setItem(key, value);
      } else {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
      window.dispatchEvent(new Event('local-storage'));
    } catch (error: any) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  }

  static getValue(key: string, defaultValue?: any) {
    if (typeof window === 'undefined') {
      console.error(
        `Tried setting localStorage key “${key}” even though environment is not a client`
      );
    }

    const storedValue = window.localStorage.getItem(key);

    return storedValue ?? defaultValue ?? null;
  }

  static removeValue(key: string) {
    if (typeof window === 'undefined') {
      console.error(
        `Tried remove localStorage key “${key}” even though environment is not a client`
      );
    }

    window.localStorage.removeItem(key);
  }
}
