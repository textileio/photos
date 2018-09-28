import { Platform } from 'react-native'
import StackTrace from 'stacktrace-js'
import { Crashlytics } from 'react-native-fabric'

const originalHandler = ErrorUtils.getGlobalHandler()

export function initErrorHandler () {
  if (__DEV__) {
    return
  }
  ErrorUtils.setGlobalHandler(errorHandler)
}

export function errorHandler (error: any, isFatal?: boolean) {
  if (__DEV__) {
    return
  }
  const e = new Error()
  if (typeof error === 'string') {
    e.name = error
    e.message = error
  } else if (typeof error === 'number') {
    e.name = error.toString()
    e.message = error.toString()
  } else if (error instanceof Error) {
    e.name = error.name
    e.message = error.message
    e.stack = error.stack
  } else {
    e.name = 'unknown'
    e.message = 'unknown'
  }
  StackTrace.fromError(e, { offline: true }).then((frames) => {
    // Crashlytics.recordCustomExceptionName(e.message, e.message, frames)
    const updatedFrames = frames.map((row) =>  ({
      lineNumber: row.lineNumber,
      columnNumber: row.columnNumber,
      functionName: row.functionName,
      fileName: `${row.fileName}:${row.lineNumber || 0}:${row.columnNumber || 0}`
    }))
    Crashlytics.recordCustomExceptionName(e.message, e.message, updatedFrames)
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
      setTimeout(() => { originalHandler(error, isFatal) }, 500)
    }
  }
}
