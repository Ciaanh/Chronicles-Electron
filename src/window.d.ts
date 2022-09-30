import type { DatabaseApi } from './preload'

declare global {
  interface Window {
    database: DatabaseApi
  }
}