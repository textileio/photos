declare module 'react-native-background-fetch' {
  export interface Configuration {
    minimumFetchInterval?: number
    stopOnTerminate?: boolean
    startOnBoot?: boolean
    forceReload?: boolean
    enableHeadless?: boolean
  }

  export function configure(config: Configuration, callbackFn: () => void, failureFn: (error: any) => void): void

  export enum Status {
    STATUS_RESTRICTED = 0,
    STATUS_DENIED = 1,
    STATUS_AVAILABLE = 2
  }

  export function status(callbackFn: (status: Status) => void): void

  export enum FetchResult {
    FETCH_RESULT_NEW_DATA = 0,
    FETCH_RESULT_NO_DATA = 1,
    FETCH_RESULT_FAILED = 2
  }

  export function finish(fetchResult: FetchResult): void

  export function start(successFn: () => void, failureFn: () => void): void

  export function stop(successFn: () => void, failureFn: () => void): void
}
