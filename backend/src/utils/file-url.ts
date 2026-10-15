export const getFileUrl = (filePath: string | null) => {
  if (!filePath) return null;

  return `${process.env.APP_URL}${filePath}`;
};
