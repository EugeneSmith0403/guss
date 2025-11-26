import 'vite/client'

declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL?: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }

  interface FetchEvent extends Event {
    request: Request
    respondWith(response: Promise<Response> | Response): void
  }

  interface ExtendableEvent extends Event {
    waitUntil(promise: Promise<any>): void
  }

  interface SyncEvent extends ExtendableEvent {
    tag: string
    lastChance: boolean
  }

  interface ServiceWorkerRegistration {
    sync?: {
      register(tag: string): Promise<void>
      getTags(): Promise<string[]>
    }
  }
}

export {}

