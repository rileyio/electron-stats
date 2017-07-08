declare module 'uuid' {
  export function v5<T>(name: Array<T> | string, namespace?: Array<T> | string, buf?: any, offset?: number): string
  export function v5(name: string, namespace?: string, buf?: any, offset?: number): string

}
