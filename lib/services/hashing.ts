/**
 * Cryptographic SHA-256 Hashing Service for NYAYAVAULT
 * Uses Web Crypto API for secure browser-side / node-side calculation.
 */

export async function calculateSHA256(fileOrBuffer: File | ArrayBuffer | Blob): Promise<string> {
  let arrayBuffer: ArrayBuffer;

  if (fileOrBuffer instanceof File || fileOrBuffer instanceof Blob) {
    arrayBuffer = await fileOrBuffer.arrayBuffer();
  } else {
    arrayBuffer = fileOrBuffer;
  }

  // Use Web Crypto API
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hexHash;
}

export function formatHashShort(hash: string, chars: number = 8): string {
  if (!hash) return '';
  if (hash.length <= chars * 2) return hash;
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
}
