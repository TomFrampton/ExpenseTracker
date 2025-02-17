export const getFromLocalStorage =  <T,>(key: string): T => {
    const savedParams = window.localStorage.getItem(key);
    return savedParams ? JSON.parse(savedParams) as T : null;
}

export const saveToLocalStorage =  <T,>(key: string, item: T): void => {
    window.localStorage.setItem(key, JSON.stringify(item));
}