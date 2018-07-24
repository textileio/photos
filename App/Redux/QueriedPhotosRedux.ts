import { createAction, ActionType, getType } from 'typesafe-actions'

const actions = {
  initialzePhotos: createAction('INITIALIZE_PHOTOS', resolve => {
    return (ids: string[]) => resolve({ ids })
  }),
  trackPhoto: createAction('TRACK_PHOTO', resolve => {
    return (id: string) => resolve({ id })
  }),
  trackPhotos: createAction('TRACK_PHOTOS', resolve => {
    return (ids: string[]) => resolve({ ids })
  }),
  untrackPhoto: createAction('UNTRACK_PHOTO', resolve => {
    return (id: string) => resolve({ id })
  }),
  untrackPhotos: createAction('UNTRACK_PHOTOS', resolve => {
    return (ids: string[]) => resolve({ ids })
  })
}

export type QueriedPhotosAction = ActionType<typeof actions>

export type QueriedPhotosMap = {
  readonly [key: string]: true
}

export type QueriedPhotosState = {
  readonly initialized: boolean
  readonly queriedPhotos: QueriedPhotosMap
}

export const initialState: QueriedPhotosState = {
  initialized: false,
  queriedPhotos: {}
}

export const quieriedPhotosSelectors = {
  initialized: state => state.queriedPhotos.initialized
}

export function reducer (state: QueriedPhotosState = initialState, action: QueriedPhotosAction): QueriedPhotosState {
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
