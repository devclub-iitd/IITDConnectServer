/* eslint-disable @typescript-eslint/no-explicit-any */
interface ErrorImpl {
  e: Error;
  status: number;
}

export const createResponse = (
  message: string,
  data: any
): { message: string; data: any } => {
  return { message, data };
};

export const createError = (
  status: number,
  name: string,
  message: string
): ErrorImpl => {
  const e = new Error();
  // (e as any).status = status;
  e.name = name;
  e.message = message;
  return { status, e };
};
