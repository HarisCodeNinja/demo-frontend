export const CreateQueryParams = (obj: { [key: string]: any }): string => {
  const queryParams: string[] = [];

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

    const value = obj[key];

    if (value === undefined || value === null || value === '') continue;

    queryParams.push(`${key}=${value}`);
  }

  return queryParams.join('&');
};