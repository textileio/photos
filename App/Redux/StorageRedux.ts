import { createAction, ActionType, getType } from 'typesafe-actions'
import {AddResult, BlockId, ILocalPhotoResult, PhotoId} from '../Models/TextileTypes'
import { RootState } from './Types'

const actions = {
  newLocalPhoto: createAction('processingImages/NEW_LOCAL_PHOTO', (resolve) => {
    return (photo: ILocalPhotoResult) => resolve({ photo })
  }),
  localPinSuccess: createAction('processingImages/LOCAL_PIN_SUCCESS', (resolve) => {
    return (addResult: AddResult) => resolve({ addResult })
  }),
  remotePinSuccess: createAction('processingImages/REMOTE_PIN_SUCCESS', (resolve) => {
    return (addResult: AddResult) => resolve({ addResult })
  }),
  refreshLocalImagesRequest: createAction('REFRESH_LOCAL_IMAGES_REQUEST', (resolve) => {
    return () => resolve()
  }),
  setLocalPhotoRefreshEpoch: createAction('processingImages/SET_LOCAL_PHOTO_UPDATE_EPOCH', (resolve) => {
    return (epoch: number) => resolve({ epoch })
  })
}

export type StorageAction = ActionType<typeof actions>

export interface StorageState {
  readonly lastPhotoRefresh: number // epoch in seconds
  readonly refreshingImages: boolean
  readonly pinnedPhotos: ReadonlyArray<AddResult>
}

export const initialState: StorageState = {
  lastPhotoRefresh: (new Date()).getDate(),
  refreshingImages: false,
  pinnedPhotos: []
}

export const StorageSelectors = {
  lastPhotoRefresh: (state: RootState) => state.storage.lastPhotoRefresh,
  pinnedPhoto: (state: RootState, photoId: PhotoId) => state.storage.pinnedPhotos.find(p => p.id === photoId)
}

export function reducer(state: StorageState = initialState, action: StorageAction): StorageState {
  switch (action.type) {
    case getType(actions.setLocalPhotoRefreshEpoch): {
      return { ...state, lastPhotoRefresh: action.payload.epoch, refreshingImages: false}
    }
    case getType(actions.localPinSuccess): {
      const {addResult} = action.payload
      const pins = [...state.pinnedPhotos, addResult]
      return { ...state, pinnedPhotos: pins}
    }
    case getType(actions.remotePinSuccess): {
      const {addResult} = action.payload
      // An alternative would be to just drop the row entirely...
      const pins = state.pinnedPhotos.filter(p => p.id !== addResult.id)
      return { ...state, pinnedPhotos: pins}
    }
    case getType(actions.refreshLocalImagesRequest):
      return { ...state, refreshingImages: true }
    default:
      return state
  }
}

export default actions
