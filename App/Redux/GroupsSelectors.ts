import { RootState } from './Types'
import { ThreadData } from './GroupsRedux'
import { IContact, Thread } from '@textile/react-native-sdk'
import { accountSelectors } from '../features/account'
import Config from 'react-native-config'
import { contactsSelectors } from '../features/contacts'

// temporary filter until we stop getting them from textile-go
export const BLACKLIST = ['avatars', 'account']

export interface GroupAuthors {
  readonly id: string
  readonly name: string
  readonly size: number
  readonly members: IContact[]
  readonly memberCount: number
  readonly valid: boolean
  readonly thumb?: string
}

export function defaultThreadData(state: RootState): ThreadData | undefined {
  return Object.keys(state.groups.threads)
    .map(key => state.groups.threads[key]!)
    .find(
      threadData => threadData.key === Config.RN_TEXTILE_CAMERA_ROLL_THREAD_KEY
    )
}

export function threadDataByThreadId(
  state: RootState,
  id: string
): ThreadData | undefined {
  const threadData = state.groups.threads[id]
  return threadData
}

export function allThreadIds(state: RootState): string[] {
  return Object.keys(state.groups.threads)
}

export function cameraRollThread(state: RootState) {
  const cameraRollThread = Object.keys(state.groups.threads)
    .map(key => state.groups.threads[key]!)
    .find(thread => thread.key === Config.RN_TEXTILE_CAMERA_ROLL_THREAD_KEY)
  return cameraRollThread
}

export function getSharedThreads(
  state: RootState,
  sortBy?: 'name' | 'date'
): ReadonlyArray<ThreadData> {
  const result = Object.keys(state.groups.threads)
    .map(key => state.groups.threads[key]!)
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
        return !a.updated ? 1 : !b.updated ? -1 : a.updated < b.updated ? 1 : -1
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
    // TODO: This method should probably just become a query to the node.
    // Along the lines of, select contacts from thread where thread_id = {id} order by active date limit 8"
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

    // const thumb = thread.photos.length ? thread.photos[0] : undefined
    return {
      id: thread.id,
      name: thread.name,
      // total number of images in the thread
      size: thread.size,
      // required to ensure up to date index
      members: [...members],
      memberCount: allMembers.length,
      thumb: thread.thumb,
      valid: thread.valid
    }
  })
  return threads
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
  return state.groups.navigateToNewThread
}

export function shouldSelectNewThread(state: RootState) {
  return state.groups.selectToShare
}

export function photoToShareToNewThread(state: RootState) {
  return state.groups.shareToNewThread
}
