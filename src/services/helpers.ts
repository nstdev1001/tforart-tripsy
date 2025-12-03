/* eslint-disable @typescript-eslint/no-explicit-any */

export const parseDate = (field: any): Date => {
  if (!field) return new Date();
  if (field.toDate && typeof field.toDate === "function") {
    return field.toDate();
  }
  if (field instanceof Date) return field;
  return new Date(field);
};
