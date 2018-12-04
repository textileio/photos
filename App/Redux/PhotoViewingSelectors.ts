import { RootState } from './Types'
import { ThreadData, ThreadPreviewData, ThreadThumbs } from './PhotoViewingRedux'

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

// TODO: replace with contacts api
export function getActivePeers (state: RootState): {[key: string]: string} {
  const peers: {[key: string]: string} = {}
  Object.keys(state.photoViewing.threads)
    .map((key) => state.photoViewing.threads[key]!)
    .filter((thread) => thread.name !== 'default')
    .forEach((thread) => {
      // tmp contact stuff
      for (const photo of thread.photos) {
        const id: string = photo.author_id !== undefined ? photo.author_id : ''
        if (state.preferences.profile && photo.author_id === state.preferences.profile.address) {
          continue
        }
        if (photo.author_id) {
          peers[photo.author_id] = peers[photo.author_id] || photo.username || ''
        }
      }
    })
  return peers
}

export function getThreads (state: RootState, sortBy?: string): ReadonlyArray<ThreadData> {
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

export function getThreadThumbs (state: RootState, byPeerId: string): ReadonlyArray<ThreadThumbs> {
  return Object.keys(state.photoViewing.threads)
    .map((key) => state.photoViewing.threads[key]!)
    .filter((thread) => thread.photos.some((p) => p.author_id === byPeerId))
    .map((thread) => {
      return {
        id: thread.id,
        thumb: thread.photos.length > 0 ? thread.photos[0] : undefined,
        name: thread.name
      }
    })
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
