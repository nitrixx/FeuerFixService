export function createError(message, status) {
  let err = new Error(message);
  err.status = status || 500;
  return err;
}
