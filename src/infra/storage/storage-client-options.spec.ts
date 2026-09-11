import { describe, expect, it } from 'vitest';
import { getStorageClientOptions } from './storage-client-options';

describe('storage client options', () => {
  it('uses the local S3-compatible endpoint with path-style requests', () => {
    expect(
      getStorageClientOptions({
        accountId: 'local',
        accessKeyId: 'minioadmin',
        secretAccessKey: 'minioadmin',
        endpoint: 'http://localhost:9000',
      }),
    ).toEqual({
      endpoint: 'http://localhost:9000',
      forcePathStyle: true,
      region: 'auto',
      credentials: {
        accessKeyId: 'minioadmin',
        secretAccessKey: 'minioadmin',
      },
    });
  });

  it('uses the Cloudflare R2 endpoint when no custom endpoint is configured', () => {
    expect(
      getStorageClientOptions({
        accountId: 'account-id',
        accessKeyId: 'access-key',
        secretAccessKey: 'secret-key',
      }),
    ).toEqual({
      endpoint: 'https://account-id.r2.cloudflarestorage.com',
      forcePathStyle: false,
      region: 'auto',
      credentials: {
        accessKeyId: 'access-key',
        secretAccessKey: 'secret-key',
      },
    });
  });
});
