export type MiddlewareKey = "auth" | "guest" | "panel-access" | "pharmacy-auth"
declare module 'nitropack' {
  interface NitroRouteConfig {
    appMiddleware?: MiddlewareKey | MiddlewareKey[] | Record<MiddlewareKey, boolean>
  }
}