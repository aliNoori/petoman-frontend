import type { ComputedRef, MaybeRef } from 'vue'
export type LayoutKey = "chat" | "default" | "pharmacy" | "print" | "user"
declare module 'nuxt/app' {
  interface PageMeta {
    layout?: MaybeRef<LayoutKey | false> | ComputedRef<LayoutKey | false>
  }
}