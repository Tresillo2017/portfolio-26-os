/// <reference types="@cloudflare/workers-types" />

// Cloudflare Pages Function to serve photography images from R2
interface Env {
    PORTFOLIO_BUCKET: R2Bucket;
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const { request, env, params } = context;
    
    // Get the path segments (e.g., ["photo.jpg"] or ["photography", "photo.jpg"])
    const pathSegments = params.path as string[];
    const filename = pathSegments[pathSegments.length - 1];
    
    // Construct the R2 object key
    const objectKey = `photography/${filename}`;
    
    try {
        // Fetch the object from R2
        const object = await env.PORTFOLIO_BUCKET.get(objectKey);
        
        if (!object) {
            return new Response('Image not found', { status: 404 });
        }
        
        // Return the image with appropriate headers
        const headers = new Headers();
        headers.set('Content-Type', object.httpMetadata?.contentType || 'image/jpeg');
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        headers.set('ETag', object.httpEtag);
        
        return new Response(object.body, { headers });
    } catch (error) {
        console.error('Error fetching image from R2:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
};
