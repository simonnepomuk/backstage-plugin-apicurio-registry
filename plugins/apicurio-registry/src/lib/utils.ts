export const capitalize = (str: string | undefined) =>
  str?.charAt(0)?.toUpperCase() + str?.slice(1).toLowerCase();

export const isJsonString = (value: unknown): boolean => {
  if (typeof value !== 'string') {
    return false;
  }

  if (value.trim() === '') {
    return false;
  }

  try {
    JSON.parse(value);
    return true;
  } catch (error) {
    return false;
  }
};
