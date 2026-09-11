interface StorageClientOptionsInput {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  endpoint?: string;
}

export function getStorageClientOptions({
  accountId,
  accessKeyId,
  secretAccessKey,
  endpoint,
}: StorageClientOptionsInput) {
  return {
    endpoint: endpoint ?? `https://${accountId}.r2.cloudflarestorage.com`,
    forcePathStyle: Boolean(endpoint),
    region: 'auto' as const,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  };
}
