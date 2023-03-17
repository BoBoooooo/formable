export const omit = (obj: Record<string, any>, fields: string[]) => {
  const result = { ...obj };
  fields.forEach((prop) => {
    delete result[prop];
  });
  return result;
};
