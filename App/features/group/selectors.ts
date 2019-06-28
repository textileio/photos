import { GroupState } from './reducer'
import { Item } from './models'
import { feedSelectors } from './feed'
import { addPhotoSelectors } from './add-photo'
import { fileSyncSelectors } from './file-sync'

export const groupItems = (
  state: GroupState,
  groupId: string
): ReadonlyArray<Item> => {
  const feed = feedSelectors
    .feedItems(state.feed, groupId)
    .map(feedItemData => ({
      ...feedItemData,
      status: fileSyncSelectors.makeStatusForId(feedItemData.block)(
        state.fileSync
      )
    }))
  const processingImages = addPhotoSelectors.getProcessingImages(
    state.addPhoto,
    groupId
  )
  const items: Item[] = []
  const withProcessing = items.concat(processingImages)
  const withFeed = withProcessing.concat(feed)
  return withFeed
}

export { feedSelectors, addPhotoSelectors, fileSyncSelectors }
