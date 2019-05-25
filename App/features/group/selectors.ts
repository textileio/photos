import { GroupState } from './reducer'
import { Item } from './models'
import { feedSelectors } from './feed'
import { addPhotoSelectors } from './add-photo'

export const groupItems = (
  state: GroupState,
  groupId: string
): ReadonlyArray<Item> => {
  const feed = feedSelectors.feedItems(state.feed, groupId)
  const processingImages = addPhotoSelectors.getProcessingImages(
    state.addPhoto,
    groupId
  )
  const items: Item[] = []
  const withProcessing = items.concat(processingImages)
  const withFeed = withProcessing.concat(feed)
  return withFeed
}

export { feedSelectors, addPhotoSelectors }
