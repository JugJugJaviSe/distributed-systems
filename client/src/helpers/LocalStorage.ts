function SaveValueByKey(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Failed to save item to localStorage. Key="${key}", Error="${error}"`);
    return false;
  }
}

function ReadValueByKey(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Failed to read item from localStorage. Key="${key}", Error="${error}"`);
    return null;
  }
}

function DeleteValueByKey(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Failed to delete item from localStorage. Key="${key}", Error="${error}"`);
    return false;
  }
}

export { SaveValueByKey, ReadValueByKey, DeleteValueByKey };