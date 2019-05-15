import { PhotosState } from './reducer'
import { Item } from './models'
import Textile from '@textile/react-native-sdk'

export const lastQueriedTime = (state: PhotosState) => state.queryData.lastQueriedTime

export const makeProcessingPhoto = (id: string) => (state: PhotosState) => state.processingPhotos[id]

export const items = (state: PhotosState) => {
  const filesItems = state.photosData.items
    .map((files): Item => {
      return { type: 'files', files }
    })

  const processingItems = Object.keys(state.processingPhotos).map((key): Item => {
    const processingPhoto = state.processingPhotos[key]
    return { type: 'processingItem', processingPhoto }
  })

  const items = filesItems.concat(processingItems)

  items
    .sort((a, b) => {
      const aDate = a.type === 'files' ? Textile.util.timestampToDate(a.files.date) : new Date(a.processingPhoto.photo.creationDate)
      const bDate = b.type === 'files' ? Textile.util.timestampToDate(b.files.date) : new Date(b.processingPhoto.photo.creationDate)
      return aDate.getTime() - bDate.getTime()
    })

  return items
}
