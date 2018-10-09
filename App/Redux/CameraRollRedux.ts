import { createAction, ActionType, getType } from 'typesafe-actions'
import { RootState } from './Types'

const actions = {
  initialzePhotos: createAction('INITIALIZE_PHOTOS', (resolve) => {
    return (ids: string[]) => resolve({ ids })
  }),
  updateQuerying:  createAction('UPDATE_QUERYING', (resolve) => {
    return (querying: boolean) => resolve({ querying })
  }),
  trackPhoto: createAction('TRACK_PHOTO', (resolve) => {
    return (id: string) => resolve({ id })
  }),
  trackPhotos: createAction('TRACK_PHOTOS', (resolve) => {
    return (ids: string[]) => resolve({ ids })
  }),
  untrackPhoto: createAction('UNTRACK_PHOTO', (resolve) => {
    return (id: string) => resolve({ id })
  }),
  untrackPhotos: createAction('UNTRACK_PHOTOS', (resolve) => {
    return (ids: string[]) => resolve({ ids })
  })
}

export type CameraRollAction = ActionType<typeof actions>

export interface QueriedPhotosMap {
  readonly [key: string]: true
}

export interface CameraRollState {
  readonly initialized: boolean
  readonly querying: boolean
  readonly queriedPhotos: QueriedPhotosMap
}

export const initialState: CameraRollState = {
  initialized: false,
  querying: false,
  queriedPhotos: {}
}

export const cameraRollSelectors = {
  initialized: (state: RootState) => state.cameraRoll.initialized,
  queriedPhotos: (state: RootState) => state.cameraRoll.queriedPhotos
}

export function reducer (state: CameraRollState = initialState, action: CameraRollAction): CameraRollState {
  switch (action.type) {
    case getType(actions.initialzePhotos): {
      const queriedPhotos = action.payload.ids.reduce(
        (previous, current) => {
          const queriedPhotos: QueriedPhotosMap = { ...previous, [current]: true }
          return queriedPhotos
        },
        state.queriedPhotos
      )
      return { ...state, initialized: true, queriedPhotos }
    }
    case getType(actions.updateQuerying):
      const { querying } = action.payload
      return { ...state, querying }
    case getType(actions.trackPhoto):
      return { ...state, queriedPhotos: { ...state.queriedPhotos, [action.payload.id]: true } }
    case getType(actions.trackPhotos): {
      const queriedPhotos = action.payload.ids.reduce(
        (previous, current) => {
          const queriedPhotos: QueriedPhotosMap = { ...previous, [current]: true }
          return queriedPhotos
        },
        state.queriedPhotos
      )
      return { ...state, queriedPhotos }
    }
    case getType(actions.untrackPhoto): {
      const { [action.payload.id]: removed, ...queriedPhotos } = state.queriedPhotos
      return { ...state, queriedPhotos }
    }
    case getType(actions.untrackPhotos): {
      const queriedPhotos = action.payload.ids.reduce(
        (previous, current) => {
          const { [current]: removed, ...queriedPhotos } = previous
          return queriedPhotos
        },
        state.queriedPhotos
      )
      return { ...state, queriedPhotos }
    }
    default:
      return state
  }
}

export default actions
