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
    .map(feedItemData => {
      // console.log('LOOKING FOR:', feedItemData.block)
      // console.log('CURRENT STATE:', state.fileSync.groups)
      // const hasIt = Object.keys(state.fileSync.groups).indexOf(feedItemData.block)
      // const status = fileSyncSelectors.makeStatusForId(feedItemData.block)(
      //   state.fileSync
      // )
      // console.log('INCLUDES IT:', feedItemData.block, hasIt, status)
      const syncStatus = fileSyncSelectors.makeStatusForId(feedItemData.block)(
        state.fileSync
      )
      return {
        ...feedItemData,
        syncStatus
      }
    })
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
