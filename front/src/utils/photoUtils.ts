export function getPublicPhotoUrl(fullPath: string): string {
    const publicIndex = fullPath.indexOf('public');
    if (publicIndex === -1) return fullPath;
    const relativePath = fullPath.substring(publicIndex + 6).replace(/\\/g, '/');
    return relativePath.startsWith('/') ? relativePath : '/' + relativePath;
  }
  