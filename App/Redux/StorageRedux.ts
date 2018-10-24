import { createAction, ActionType, getType } from 'typesafe-actions'
import {ILocalPhotoResult, NodeOverview} from '../Models/TextileTypes'
import { RootState } from './Types'

const actions = {
  newLocalPhoto: createAction('processingImages/NEW_LOCAL_PHOTO', (resolve) => {
    return (photo: ILocalPhotoResult) => resolve({ photo })
  }),
  setLocalPhotoRefreshEpoch: createAction('processingImages/SET_LOCAL_PHOTO_UPDATE_EPOCH', (resolve) => {
    return (epoch: number) => resolve({ epoch })
  }),
  refreshLocalImagesRequest: createAction('REFRESH_LOCAL_IMAGES_REQUEST', (resolve) => {
    return () => resolve()
  }),
  storeOverview: createAction('STORE_OVERVIEW', (resolve) => {
    return (overview: NodeOverview) => resolve({ overview })
  })
}

export type StorageAction = ActionType<typeof actions>

export interface StorageState {
  readonly lastPhotoRefresh: number // epoch in seconds
  readonly refreshingImages: boolean
  readonly overview?: NodeOverview
}

export const initialState: StorageState = {
  lastPhotoRefresh: (new Date()).getDate(),
  refreshingImages: false
}

export const StorageSelectors = {
  lastPhotoRefresh: (state: RootState) => state.storage.lastPhotoRefresh
}

export function reducer(state: StorageState = initialState, action: StorageAction): StorageState {
  switch (action.type) {
    case getType(actions.setLocalPhotoRefreshEpoch): {
      return { ...state, lastPhotoRefresh: action.payload.epoch, refreshingImages: false}
    }
    case getType(actions.refreshLocalImagesRequest):
      // TODO: There is not success action that sets this back to false
      return { ...state, refreshingImages: true }
      case getType(actions.storeOverview):
        return { ...state, overview: action.payload.overview }
    default:
      return state
  }
}

export default actions
