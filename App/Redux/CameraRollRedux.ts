import { createAction, ActionType, getType } from 'typesafe-actions'
import * as TextileTypes from '../Models/TextileTypes'
import {UploadingImage} from './UploadingImagesRedux'
import {AddResult} from '../Models/TextileTypes'

const actions = {
  initialzePhotos: createAction('INITIALIZE_PHOTOS', resolve => {
    return (ids: string[]) => resolve({ ids })
  }),
  updateQuerying:  createAction('UPDATE_QUERYING', resolve => {
    return (querying: boolean) => resolve({ querying })
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
  }),
  imagePickerSuccess: createAction('IMAGE_PICKER_SUCCESS', resolve => {
    return (threadId: string, image: TextileTypes.SharedImage) => resolve({ threadId, image })
  }),
  addComment: createAction('ADD_IMAGE_PICKER_COMMENT', resolve => {
    return (threadId: string, image: TextileTypes.SharedImage, caption: string) => resolve({ threadId, image, caption })
  }),
  localPinSuccess: createAction('LOCAL_PIN_SUCCESS', resolve => {
    return (threadId: string, image: TextileTypes.SharedImage, addResult: TextileTypes.AddResult) => resolve({ threadId, image, addResult })
  }),
  remotePinSuccess: createAction('REMOTE_PIN_SUCCESS', resolve => {
    return (threadId: string, image: TextileTypes.SharedImage) => resolve({ threadId, image })
  }),
  imagePinError: createAction('IMAGE_PICKER_PIN_ERROR', resolve => {
    return (threadId: string, image: TextileTypes.SharedImage) => resolve({ threadId, image })
  }),
  cancelShare: createAction('CANCEL_IMAGE_PICKER_SHARE', resolve => {
    return (threadId: string, image: TextileTypes.SharedImage) => resolve({ threadId, image })
  })
}

export type CameraRollAction = ActionType<typeof actions>

export type QueriedPhotosMap = {
  readonly [key: string]: true
}

export type CameraRollState = {
  readonly initialized: boolean
  readonly querying: boolean
  readonly queriedPhotos: QueriedPhotosMap,
  // A map of threads and their pending images from pendingImageShares
  readonly pendingShares: { [index:string] : Array<TextileTypes.SharedImage> }
}

export const initialState: CameraRollState = {
  initialized: false,
  querying: false,
  queriedPhotos: {},
  pendingShares: {}
}

export const cameraRollSelectors = {
  initialized: state => state.cameraRoll.initialized as boolean,
  queriedPhotos: state => state.cameraRoll.queriedPhotos as QueriedPhotosMap
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
    case getType(actions.imagePickerSuccess):
      const { image } = action.payload
      const threadShares = state.pendingShares

      if (threadShares[action.payload.threadId] === undefined) {
        // add the image uir to the thread's pending shares
        threadShares[action.payload.threadId] = [image]
      } else {
        if (state.pendingShares[action.payload.threadId].find((img) => img.origURL === image.origURL)) {
          // if the image already exists as a pending invite to the thread... skip it
          return state
        } else {
          // add the image to the thread's pending shares
          threadShares[action.payload.threadId].push(image)
        }
      }
      return {...state, pendingShares: threadShares}
    case getType(actions.addComment):
      if (state.pendingShares[action.payload.threadId] === undefined) {
        return state
      }
      const existing = state.pendingShares[action.payload.threadId].find(img=>img.origURL === action.payload.image.origURL)
      if (!existing || existing.caption !== undefined) {
        return state
      }
      existing.caption = action.payload.caption

      const thread = state.pendingShares[action.payload.threadId].filter((img) => img.origURL !== action.payload.image.origURL)
      thread.push(existing)

      return {
        ...state,
        pendingShares: {
          ...state.pendingShares,
          [action.payload.threadId]: thread
        }
      }
    case getType(actions.localPinSuccess):
      if (state.pendingShares[action.payload.threadId] === undefined) {
        return state
      }
      const partial = state.pendingShares[action.payload.threadId].find(img=>img.origURL === action.payload.image.origURL)
      if (!partial || partial.addResult !== undefined) {
        return state
      }
      partial.addResult = action.payload.addResult

      const ps = state.pendingShares[action.payload.threadId].filter((img) => img.origURL !== action.payload.image.origURL)
      ps.push(partial)

      return {
        ...state,
        pendingShares: {
          ...state.pendingShares,
          [action.payload.threadId]: ps
        }}
    case getType(actions.remotePinSuccess):
    case getType(actions.imagePinError):
      if (state.pendingShares[action.payload.threadId] === undefined) {
        return state
      }

      const filteredShares = state.pendingShares
      const newArray = filteredShares[action.payload.threadId].filter((img) => img.origURL !== action.payload.image.origURL)
      if (newArray.length > 0) {
        filteredShares[action.payload.threadId] = newArray
      } else {
        // remove the key from the object if array=0
        delete filteredShares[action.payload.threadId]
      }
      return {...state, pendingShares: filteredShares}
    case getType(actions.cancelShare):
      if (state.pendingShares[action.payload.threadId] === undefined) {
        return state
      }
      const filteredArray = state.pendingShares[action.payload.threadId].filter((img) => img.origURL !== action.payload.image.origURL)
      if (filteredArray.length < 1) {
        const pendingShares = state.pendingShares
        delete pendingShares[action.payload.threadId]
        return {...state, pendingShares}
      } else {
        return {
          ...state,
          pendingShares: {
            ...state.pendingShares,
            [action.payload.threadId]: filteredArray
          }
        }
      }
    default:
      return state
  }
}

export default actions
