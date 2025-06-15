export function getPublicPhotoUrl(fullPath: string): string {
  const publicIndex = fullPath.indexOf('public');
  if (publicIndex === -1) return fullPath;

  let relativePath = fullPath.substring(publicIndex + 6).replace(/\\/g, '/');
  if (!relativePath.startsWith('/')) {
    relativePath = '/' + relativePath;
  }

  console.log(relativePath);
  return relativePath;
}