import { Platform, ErrorUtils } from 'react-native'
import StackTrace from 'stacktrace-js'
import { Crashlytics } from 'react-native-fabric'

export function initErrorHandler () {
  // if (__DEV__) {
  //   return
  // }
  const originalHandler = ErrorUtils.getGlobalHandler()
  function errorHandler (error: any, isFatal?: boolean) {
    if (!(error instanceof Error)) {
      return
    }
    StackTrace.fromError(error, {offline: true}).then(frames => {
      const frameData = frames.map(frame => {
        return { ...frame, fileName: `${frame.fileName}:${frame.lineNumber || 0}:${frame.columnNumber || 0}` }
      })
      Crashlytics.recordCustomExceptionName(error.message, error.message, frameData)
    })
    if (originalHandler) {
      if (Platform.OS === 'ios') {
        originalHandler(error, isFatal)
      } else {
        // On Android, throwing the original exception immediately results in the
        // recordCustomExceptionName() not finishing before the app crashes and therefore not logged
        // Add a delay to give it time to log the custom JS exception before crashing the app.
        // The user facing effect of this delay is that separate JS errors will appear as separate
        // issues in the Crashlytics dashboard.
        setTimeout(() => {
          originalHandler(error, isFatal)
        }, 500)
      }
    }
  }
  ErrorUtils.setGlobalHandler(errorHandler)
}
