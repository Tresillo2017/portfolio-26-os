import type { Fetcher, R2Bucket, R2Object, Request as WorkerRequest, Response as WorkerResponse } from '@cloudflare/workers-types';

export interface Env {
    ASSETS: Fetcher;
    PORTFOLIO_BUCKET: R2Bucket;
}

const PHOTOS_PREFIX = 'photography/';
const IMAGE_EXTENSION = /\.(jpg|jpeg|png|gif|webp|bmp|tiff)$/i;

async function listPhotos(bucket: R2Bucket): Promise<string[]> {
    const objects: R2Object[] = [];
    let cursor: string | undefined;

    do {
        const listed = await bucket.list({ prefix: PHOTOS_PREFIX, cursor });
        objects.push(...listed.objects);
        cursor = listed.truncated ? listed.cursor : undefined;
    } while (cursor);

    return objects
        .filter(o => IMAGE_EXTENSION.test(o.key))
        .sort((a, b) => b.uploaded.getTime() - a.uploaded.getTime())
        .map(o => o.key.slice(PHOTOS_PREFIX.length));
}

export default {
    async fetch(request: WorkerRequest, env: Env): Promise<WorkerResponse> {
        const url = new URL(request.url);

        if (url.pathname === '/api/photos') {
            const filenames = await listPhotos(env.PORTFOLIO_BUCKET);
            return new Response(JSON.stringify(filenames), {
                headers: {
                    'content-type': 'application/json',
                    'cache-control': 'public, max-age=300',
                },
            }) as unknown as WorkerResponse;
        }

        return env.ASSETS.fetch(request);
    },
};
