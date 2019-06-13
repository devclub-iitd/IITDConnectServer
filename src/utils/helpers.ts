export const createResponse = (message: string, data: any) => {
  return { message, data };
};

export const createError = (status: number, name: string, message: string) => {
  const err = new Error(message);
  err.name = name;
  return { status, err };
};
