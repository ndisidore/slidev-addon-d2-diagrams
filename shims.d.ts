/// <reference types="vite/client" />

// Slidev build-time globals (injected by Vite)
declare const __DEV__: boolean
declare const __SLIDEV_HAS_SERVER__: boolean
declare const __SLIDEV_HASH_ROUTE__: boolean
declare const __SLIDEV_FEATURE_DRAWINGS_PERSIST__: boolean
declare const __SLIDEV_FEATURE_EDITOR__: boolean

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

// Slidev client module augmentation
declare module '@slidev/client' {
  import type { Ref } from 'vue'

  export function useDark(): {
    isDark: Ref<boolean>
    toggleDark: () => void
  }

  export function onSlideEnter(callback: () => void): void
  export function onSlideLeave(callback: () => void): void
}
