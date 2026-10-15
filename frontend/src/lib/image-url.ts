const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";

export function getImageUrl(path?: string | null) {
  if (!path) return "";

  // Agar already full URL hai
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // /uploads/... ko backend URL ke saath join karega
  return `${SERVER_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
