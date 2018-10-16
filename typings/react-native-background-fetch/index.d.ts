declare module 'react-native-background-fetch' {
  export interface Configuration {
    minimumFetchInterval?: number
    stopOnTerminate?: boolean
    startOnBoot?: boolean
    forceReload?: boolean
    enableHeadless?: boolean
  }

  export function configure(config: Configuration, callbackFn: () => void, failureFn: (error: any) => void): void

  export const STATUS_RESTRICTED = 0
  export const STATUS_DENIED = 1
  export const STATUS_AVAILABLE = 2

  export function status(callbackFn: (status: number) => void): void

  export const FETCH_RESULT_NEW_DATA = 0
  export const FETCH_RESULT_NO_DATA = 1
  export const FETCH_RESULT_FAILED = 2

  export function finish(fetchResult: number): void

  export function start(successFn: () => void, failureFn: () => void): void

  export function stop(successFn: () => void, failureFn: () => void): void
}
