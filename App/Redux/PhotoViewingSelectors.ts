import { RootState } from './Types'
import { ThreadData, ThreadThumb } from './PhotoViewingRedux'

export function defaultThreadData (state: RootState): ThreadData | undefined {
  const defaultThreadName: string = 'default' as any
  return Object.keys(state.photoViewing.threads)
    .map((key) => state.photoViewing.threads[key]!)
    .find((threadData) => threadData.name === defaultThreadName)
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

export function getThreads (state: RootState, sortBy?: 'name' | 'date'): ReadonlyArray<ThreadData> {
  const result = Object.keys(state.photoViewing.threads)
    .map((key) => state.photoViewing.threads[key]!)
    .filter((thread) => thread.name !== 'default') // TODO: filter by real account thread

  switch (sortBy) {
    case 'name':
      return result
        .sort((a, b) => {
          if (a.name === null || a.name === '') {
            return 1
          } else if (b.name === null || b.name === '') {
            return -1
          }
          const A = a.name.toString().toUpperCase()
          const B = b.name.toString().toUpperCase()
          if (A === B) {
            return 0
          } else {
            return A < B ? -1 : 1
          }
        })
    case 'date':
      return result
        .sort((a, b) => {
          const aLast = a.photos.length && a.photos[0].date ? Date.parse(a.photos[0].date) : 0
          const bLast = b.photos.length && b.photos[0].date ? Date.parse(b.photos[0].date) : 0

          return !aLast || aLast < bLast ? 1 : -1
        })
    default:
      return result
  }
}

export function getThreadThumb (state: RootState, threadId: string): ThreadThumb | undefined {
  const thread = Object.keys(state.photoViewing.threads)
  .map((key) => state.photoViewing.threads[key]!)
  .find((thread) => thread.id === threadId)
  if (!thread) {
    return
  }
  return {
    id: thread.id,
    thumb: thread.photos.length > 0 ? thread.photos[0] : undefined,
    name: thread.name
  }
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
