/// <reference types="@cloudflare/workers-types" />

// Cloudflare Pages Function to serve photography images from R2
interface Env {
    PORTFOLIO_BUCKET: R2Bucket;
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const { request, env, params } = context;
    const url = new URL(request.url);
    
    // Check if this is a request for the photos list endpoint
    if (url.pathname === '/api/photography/photos' && request.method === 'GET') {
        try {
            // List all objects in the photography folder
            const listed = await env.PORTFOLIO_BUCKET.list({
                prefix: 'photography/',
                delimiter: '/',
            });
            
            // Extract just the filenames (without the photography/ prefix)
            const filenames = listed.objects
                .map((obj: R2Object) => obj.key.replace('photography/', ''))
                .filter((name: string) => name.length > 0) // Filter out the directory itself
                .sort(); // Sort alphabetically
            
            // Return as JSON
            return new Response(JSON.stringify(filenames), {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
                },
            });
        } catch (error) {
            console.error('Error listing images from R2:', error);
            return new Response(JSON.stringify({ error: 'Failed to list images' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    }
    
    // Otherwise, serve as an image file
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
