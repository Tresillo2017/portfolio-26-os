/// <reference types="@cloudflare/workers-types" />

// Cloudflare Pages Function to list all photography images from R2
interface Env {
    PORTFOLIO_BUCKET: R2Bucket;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { env } = context;
    
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
};
