import { RootState } from './Types'
import { ThreadData } from './PhotoViewingRedux'

export function defaultThreadData (state: RootState): ThreadData | undefined {
  return Object.keys(state.photoViewing.threads)
    .map((key) => state.photoViewing.threads[key]!)
    .find((threadData) => threadData.name === 'default')
}

export function threadDataByThreadId (state: RootState, id: string): ThreadData | undefined {
  const threadData = state.photoViewing.threads[id]
  return threadData
}

export function photoAndComment (state: RootState) {
  return {
    photo: state.photoViewing.viewingPhoto,
    comment: state.photoViewing.authoringComment
  }
}

export function getThreads (state: RootState): ReadonlyArray<ThreadData> {
  return Object.keys(state.photoViewing.threads)
    .map((key) => state.photoViewing.threads[key]!)
}

export function shouldNavigateToNewThread (state: RootState): boolean {
  return state.photoViewing.navigateToNewThread
}
