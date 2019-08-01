import { RootState } from './Types'
import { ThreadData, ThreadThumbs } from './PhotoViewingRedux'
import Textile, { IContact, IFiles, Thread } from '@textile/react-native-sdk'
import { accountSelectors } from '../features/account'
import Config from 'react-native-config'
import { contactsSelectors } from '../features/contacts'

// temporary filter until we stop getting them from textile-go
export const BLACKLIST = ['avatars', 'account']

export interface SharedPhoto {
  type: 'photo'
  photo: IFiles
  id: string
  original: string
}

export interface GroupAuthors {
  readonly id: string
  readonly name: string
  readonly size: number
  readonly members: IContact[]
  readonly memberCount: number
  readonly valid: boolean
  readonly thumb?: IFiles
}

export function defaultThreadData(state: RootState): ThreadData | undefined {
  return Object.keys(state.photoViewing.threads)
    .map(key => state.photoViewing.threads[key]!)
    .find(
      threadData => threadData.key === Config.RN_TEXTILE_CAMERA_ROLL_THREAD_KEY
    )
}

export function threadDataByThreadId(
  state: RootState,
  id: string
): ThreadData | undefined {
  const threadData = state.photoViewing.threads[id]
  return threadData
}

export function allThreadIds(state: RootState): string[] {
  return Object.keys(state.photoViewing.threads)
}

export function photoAndComment(state: RootState) {
  return {
    photo: state.photoViewing.viewingPhoto,
    comment: state.photoViewing.authoringComment
  }
}

export function cameraRollThread(state: RootState) {
  const cameraRollThread = Object.keys(state.photoViewing.threads)
    .map(key => state.photoViewing.threads[key]!)
    .find(thread => thread.key === Config.RN_TEXTILE_CAMERA_ROLL_THREAD_KEY)
  return cameraRollThread
}

export function getSharedThreads(
  state: RootState,
  sortBy?: 'name' | 'date'
): ReadonlyArray<ThreadData> {
  const result = Object.keys(state.photoViewing.threads)
    .map(key => state.photoViewing.threads[key]!)
    .filter(thread => {
      return (
        thread.key !== Config.RN_TEXTILE_CAMERA_ROLL_THREAD_KEY &&
        BLACKLIST.indexOf(thread.name) < 0
      )
    })

  switch (sortBy) {
    case 'name':
      return result.sort((a, b) => {
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
      return result.sort((a, b) => {
        const aLast =
          Boolean(a.photos.length) &&
          Textile.util.timestampToDate(a.photos[0].date)
        const bLast =
          Boolean(b.photos.length) &&
          Textile.util.timestampToDate(b.photos[0].date)
        return !aLast || aLast < bLast ? 1 : -1
      })
    default:
      return result
  }
}

export function getThreadsAndMembers(
  state: RootState,
  limit: number
): GroupAuthors[] {
  const memberLimit = limit || 8
  const ownAddress = accountSelectors.getAddress(state.account)
  const profile = accountSelectors.getProfile(state.account)
  const threads = getSharedThreads(state, 'date').map(thread => {
    const selector = contactsSelectors.makeByThreadId(thread.id)
    const allMembers = selector(state.contacts)

    // Focus just on contacts with avatars. Ideally should show, "2+ others" or something
    const members = allMembers
      .filter(contact => contact.avatar !== '')
      .filter(contact => contact.address !== ownAddress)

    // Include our own avatar first if still room in the array
    if (profile && members.length < memberLimit) {
      members.unshift(profile)
    }

    const thumb = thread.photos.length ? thread.photos[0] : undefined
    return {
      id: thread.id,
      name: thread.name,
      // total number of images in the thread
      size: thread.photos.length,
      // required to ensure up to date index
      members: [...members],
      memberCount: allMembers.length,
      thumb,
      valid: thread.valid
    }
  })
  return threads
}

export function getSharedPhotos(
  state: RootState,
  sortBy?: 'date'
): SharedPhoto[] {
  const selfAddress = accountSelectors.getAddress(state.account)
  const photos = getSharedThreads(state)
    .map(thread =>
      thread.photos
        .filter(photo => photo.user.address === selfAddress)
        .map(
          (photo): SharedPhoto => {
            const file = photo.files[0]
            const thumb = file.links.thumb
            // Types say this thumb is always defined, but we had a fallback
            // to photo.block here for a reason so I'll leave it
            const original = thumb ? thumb.checksum : photo.block
            return { type: 'photo', photo, id: photo.block, original }
          }
        )
    )
    .reduce((accumulator, currentValue) => accumulator.concat(currentValue), [])
  const filtered = photos.filter((s1, pos, arr) => {
    return (
      arr.findIndex(s2 => {
        return s2.original === s1.original
      }) === pos
    )
  })
  switch (sortBy) {
    case 'date':
      return filtered.sort((a: SharedPhoto, b: SharedPhoto) => {
        if (a.photo.date.seconds > b.photo.date.seconds) {
          return -1
        }
        return 1
      })
    default:
      return filtered
  }
}

export function getThreadThumbs(
  state: RootState,
  byAddres: string,
  sortBy?: 'name' | 'date'
): ReadonlyArray<ThreadThumbs> {
  return getSharedThreads(state, sortBy)
    .filter(thread => thread.photos.some(p => p.user.address === byAddres))
    .map(thread => {
      return {
        id: thread.id,
        thumb:
          thread.photos.length > 0
            ? thread.photos[thread.photos.length - 1]
            : undefined,
        name: thread.name
      }
    })
}

function isDirectMessageThread(
  address: string
): (thread: ThreadData) => boolean {
  return thread => {
    return (
      thread.whitelist.indexOf(address) !== -1 &&
      thread.whitelist.length === 1 &&
      thread.sharing === Thread.Sharing.SHARED &&
      thread.type === Thread.Type.OPEN
    )
  }
}

// Returns the thread object or undefined if it isn't found
export function getDirectMessageThread(state: RootState, address: string) {
  return getSharedThreads(state).find(isDirectMessageThread(address))
}

export function shouldNavigateToNewThread(state: RootState) {
  return state.photoViewing.navigateToNewThread
}

export function shouldSelectNewThread(state: RootState) {
  return state.photoViewing.selectToShare
}

export function photoToShareToNewThread(state: RootState) {
  return state.photoViewing.shareToNewThread
}
