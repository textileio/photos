import { PhotosState } from './reducer'

export const lastQueriedTime = (state: PhotosState) => state.queryData.lastQueriedTime

export const makeProcessingPhoto = (id: string) => (state: PhotosState) => state.processingPhotos[id]
