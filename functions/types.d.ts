/// <reference types="@cloudflare/workers-types" />

// Type definitions for Cloudflare Pages Functions

interface Env {
    PORTFOLIO_BUCKET: R2Bucket;
}

type PagesFunction<EnvType = unknown> = (
    context: EventContext<EnvType, any, Record<string, unknown>>
) => Response | Promise<Response>;
