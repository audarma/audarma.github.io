/**
 * Cloudflare environment bindings
 * Extends CloudflareEnv for @cloudflare/next-on-pages
 */

/// <reference types="@cloudflare/workers-types" />

declare module '@cloudflare/next-on-pages' {
  interface CloudflareEnv {
    STATS_KV: KVNamespace;
    CEREBRAS_API_KEY: string;
  }

  export function getRequestContext<
    CfProperties extends Record<string, unknown> = IncomingRequestCfProperties,
    Context = ExecutionContext
  >(): {
    env: CloudflareEnv;
    cf: CfProperties;
    ctx: Context;
  };

  export function getOptionalRequestContext<
    CfProperties extends Record<string, unknown> = IncomingRequestCfProperties,
    Context = ExecutionContext
  >(): {
    env: CloudflareEnv;
    cf: CfProperties;
    ctx: Context;
  } | undefined;
}
