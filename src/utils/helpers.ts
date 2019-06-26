/* eslint-disable @typescript-eslint/no-explicit-any */
export const createResponse = (
  message: string,
  data: any
): { message: string; data: any } => {
  return { message, data };
};

export const createError = (
  _status: number,
  name: string,
  message: string
): Error => {
  const e = new Error();
  // (e as any).status = status;
  e.name = name;
  e.message = message;
  return e;
};
