import { RootState } from './Types'
import { ThreadData } from './PhotoViewingRedux'
import { ThreadId, ThreadName } from '../Models/TextileTypes'

export function defaultThreadData (state: RootState): ThreadData | undefined {
  const defaultThreadName: ThreadName = 'default' as any
  return Object.keys(state.photoViewing.threads)
    .map((key) => state.photoViewing.threads[key]!)
    .find((threadData) => threadData.name === defaultThreadName)
}

export function threadDataByThreadId (state: RootState, id: ThreadId): ThreadData | undefined {
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

export function shouldNavigateToNewThread (state: RootState) {
  return state.photoViewing.navigateToNewThread
}

export function shouldSelectNewThread (state: RootState) {
  return state.photoViewing.selectToShare
}

export function photoToShareToNewThread (state: RootState) {
  return state.photoViewing.shareToNewThread
}
