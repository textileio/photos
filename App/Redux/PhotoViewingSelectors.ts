import { RootState } from './Types'
import { ThreadData, ThreadThumbs } from './PhotoViewingRedux'
import { ThreadFilesInfo } from '../NativeModules/Textile'
import { getPeerId } from './AccountSelectors'
import Config from 'react-native-config'

// temporary filter until we stop getting them from textile-go
export const BLACKLIST = ['avatars', 'account']

export interface FeedPhoto {
  type: 'processingItem' | 'photo'
  block: string
  photo?: ThreadFilesInfo
  threadId?: string
  threadName?: string
  props?: any
}

export interface SharedPhoto {
  type: 'photo'
  photo: ThreadFilesInfo
  id: string
  original: string
}

export function defaultThreadData (state: RootState): ThreadData | undefined {
  return Object.keys(state.photoViewing.threads)
    .map((key) => state.photoViewing.threads[key]!)
    .find((threadData) => threadData.key === Config.RN_TEXTILE_CAMERA_ROLL_THREAD_KEY)
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
    .filter((thread) => {
      return thread.key !== Config.RN_TEXTILE_CAMERA_ROLL_THREAD_KEY &&
             BLACKLIST.indexOf(thread.name) < 0
    })

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
export function getPhotoFeed (state: RootState): ReadonlyArray<FeedPhoto> {
  return getThreads(state)
  .map((thread) => thread.photos
    .map((photo): FeedPhoto => {
      return { type: 'photo', photo, block: photo.block, threadId: thread.id, threadName: thread.name }
    })
  )
  .reduce((accumulator, currentValue) => accumulator.concat(currentValue), [])
  .sort((a, b) => {
    if (!a.photo) {
      return 1
    } else if (!b.photo) {
      return -1
    } else {
      return (new Date(b.photo.date)).getTime() - (new Date(a.photo.date)).getTime()
    }
  })
}

export function getSharedPhotos (state: RootState): ReadonlyArray<SharedPhoto> {
  const selfId = getPeerId(state)
  const photos = getThreads(state)
    .map((thread) => thread.photos
      .filter((photo) => photo.author_id === selfId)
      .map((photo): SharedPhoto => {
        const files = photo.files.length ? photo.files[0] : undefined
        const original = files && files.links ? files.links.exif.checksum : photo.block
        return { type: 'photo', photo, id: photo.block, original }
      })
    )
    .reduce((accumulator, currentValue) => accumulator.concat(currentValue), [])
  return photos.filter((s1, pos, arr) => {
    return arr.findIndex((s2) => {
      return s2.original === s1.original
    }) === pos
  })
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
