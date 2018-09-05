import { RootState } from './Types'
import { ThreadData } from './PhotoViewingRedux'

export function defaultThreadData (state: RootState): ThreadData | undefined {
  return Object.keys(state.photoViewing.threads)
    .map((key) => state.photoViewing.threads[key] )
    .find((threadData) => threadData.thread.name === 'default')
}

export function threadDataByThreadId (state: RootState, id: string) {
  const threadData = state.photoViewing.threads[id]
  return threadData
}

export function photoAndComment (state: RootState) {
  return {
    photo: state.photoViewing.viewingPhoto,
    comment: state.photoViewing.authoringComment
  }
}

export function getThreads (state: RootState) {
  return Object.keys(state.photoViewing.threads)
    .map((key) => state.photoViewing.threads[key].thread )
}
