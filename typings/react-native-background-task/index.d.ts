declare module 'react-native-background-task' {
  
  export function define(callback: () => void): void

  type BackgroundTaskSchedulingOptions = {
    period?: number,
    timeout?: number
  }
  export function schedule(options: BackgroundTaskSchedulingOptions): void

  export function finish(): void

  export function cancel(): void

  type Status = {
    available: boolean,
    unavailableReason?: 'restricted' | 'denied'
  }
  export function statusAsync(): Promise<Status>

}