/// <reference types="vite/client" />

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
