import { GroupState } from './reducer'
import { Item } from './models'
import { feedSelectors } from './feed'
import { addPhotoSelectors } from './add-photo'
import { fileSyncSelectors } from './file-sync'
import { FeedItemType, IFiles } from '@textile/react-native-sdk'

const groupFeed = (state: GroupState, groupId: string): ReadonlyArray<Item> => {
  return feedSelectors.feedItems(state.feed, groupId).map(feedItemData => {
    const syncStatus = fileSyncSelectors.makeStatusForId(feedItemData.block)(
      state.fileSync
    )
    return {
      ...feedItemData,
      syncStatus
    }
  })
}
export const groupItems = (
  state: GroupState,
  groupId: string
): ReadonlyArray<Item> => {
  const feed = groupFeed(state, groupId)
  const processingImages = addPhotoSelectors.getProcessingImages(
    state.addPhoto,
    groupId
  )
  const items: Item[] = []
  const withProcessing = items.concat(processingImages)
  const withFeed = withProcessing.concat(feed)
  return withFeed
}

export const groupPhoto = (
  state: GroupState,
  groupId: string,
  block: string
): IFiles | undefined => {
  return groupFeed(state, groupId)
    .map(item => {
      switch (item.type) {
        case FeedItemType.Files: {
          return item.value
        }
        default:
          return undefined
      }
    })
    .find(item => (item && item.block === block) || false)
}

export { feedSelectors, addPhotoSelectors, fileSyncSelectors }
