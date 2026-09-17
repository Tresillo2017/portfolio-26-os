const fs = require('fs');
const path = require('path');
const { AwsClient } = require('aws4fetch');

const OUTPUT_JSON = path.join(__dirname, '..', 'public', 'photography', 'photos.json');
const PREFIX = 'photography/';
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'];

// Lists objects directly from the R2 bucket so photos.json no longer needs manual updates.
async function listAllObjects() {
    const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME } = process.env;

    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
        console.warn('⚠️  R2 credentials not set (R2_ACCOUNT_ID/R2_ACCESS_KEY_ID/R2_SECRET_ACCESS_KEY/R2_BUCKET_NAME) — skipping photos.json regeneration, keeping existing file.');
        return null;
    }

    const client = new AwsClient({
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
    });

    const endpoint = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}`;
    const objects = [];
    let cursor = null;

    do {
        const url = new URL(endpoint);
        url.searchParams.set('list-type', '2');
        url.searchParams.set('prefix', PREFIX);
        if (cursor) url.searchParams.set('continuation-token', cursor);

        const res = await client.fetch(url.toString());
        if (!res.ok) {
            throw new Error(`R2 list request failed: ${res.status} ${await res.text()}`);
        }
        const xml = await res.text();

        for (const match of xml.matchAll(/<Contents>([\s\S]*?)<\/Contents>/g)) {
            const block = match[1];
            const key = block.match(/<Key>(.*?)<\/Key>/)?.[1];
            const lastModified = block.match(/<LastModified>(.*?)<\/LastModified>/)?.[1];
            if (key) objects.push({ key, lastModified });
        }

        cursor = xml.match(/<NextContinuationToken>(.*?)<\/NextContinuationToken>/)?.[1] || null;
    } while (cursor);

    return objects;
}

async function main() {
    const objects = await listAllObjects();
    if (!objects) return;

    const filenames = objects
        .map(o => ({ filename: o.key.slice(PREFIX.length), lastModified: o.lastModified }))
        .filter(o => o.filename && IMAGE_EXTENSIONS.includes(path.extname(o.filename).toLowerCase()))
        .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
        .map(o => o.filename);

    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(filenames, null, 4));
    console.log(`✅ Wrote ${filenames.length} photos to ${OUTPUT_JSON}`);
}

main().catch(err => {
    console.error('❌ Failed to fetch photos from R2:', err.message);
    process.exit(1);
});
