import { createAction, ActionType, getType } from 'typesafe-actions'
import * as TextileTypes from '../Models/TextileTypes'
import {UploadingImage} from './UploadingImagesRedux'

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
  imagePinSuccess: createAction('IMAGE_PICKER_PIN_SUCCESS', resolve => {
    return (threadId: string, image: TextileTypes.SharedImage) => resolve({ threadId, image })
  }),
  imageShareSuccess: createAction('IMAGE_PICKER_SHARE_SUCCESS', resolve => {
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
  queriedPhotos: state => state.cameraRoll.queriedPhotos as QueriedPhotosMap,
  pendingSharesById: (state, id: string) => {
    let output: { [index:string] : string } = {}
    for (let threadId of Object.keys(state.cameraRoll.pendingShares)) {
      const existing = state.cameraRoll.pendingShares[threadId].find((img: TextileTypes.SharedImage) => {
        return img.addResult && img.addResult.id === id
      })
      if (existing) {
        output[threadId] = existing
      }
    }
    return output
  },
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

      // todo: remove and uncomment
      threadShares[action.payload.threadId] = [image]
      // if (threadShares[action.payload.threadId] === undefined) {
      //   // add the image uir to the thread's pending shares
      //   threadShares[action.payload.threadId] = [image]
      // } else {
      //   if (state.pendingShares[action.payload.threadId].find((img) => img.origURL === image.origURL)) {
      //     // if the image already exists as a pending invite to the thread... skip it
      //     return state
      //   } else {
      //     // add the image to the thread's pending shares
      //     threadShares[action.payload.threadId].push(image)
      //   }
      // }
      return {...state, pendingShares: threadShares}
    case getType(actions.addComment):
      if (state.pendingShares[action.payload.threadId] === undefined) {
        console.log('no thread')
        return state
      }
      const existing = state.pendingShares[action.payload.threadId].find(img=>img.origURL === action.payload.image.origURL)
      if (!existing || existing.caption !== undefined) {
        console.log('no existing or comment', existing)
        return state
      }
      existing.caption = action.payload.caption

      const shares = state.pendingShares
      shares[action.payload.threadId] = shares[action.payload.threadId].filter((img) => img.origURL !== action.payload.image.origURL)
      shares[action.payload.threadId].push(existing)

      console.log('updating pending share', action.payload.threadId, existing)
      return {...state, pendingShares: shares}
    case getType(actions.imagePinSuccess):
      if (state.pendingShares[action.payload.threadId] === undefined) {
        return state
      }
      if (!state.pendingShares[action.payload.threadId].find(img=>img.origURL === action.payload.image.origURL)) {
        console.log('no existing or comment')
        return state
      }

      const pending = state.pendingShares
      pending[action.payload.threadId] = pending[action.payload.threadId].filter((img) => img.origURL !== action.payload.image.origURL)
      pending[action.payload.threadId].push(action.payload.image)

      console.log('updating pending share', action.payload.threadId, action.payload.image)
      return {...state, pendingShares: pending}

    case getType(actions.imagePinSuccess):
      if (state.pendingShares[action.payload.threadId] === undefined) {
        return state
      }

      const filteredShares = state.pendingShares
      filteredShares[action.payload.threadId] = filteredShares[action.payload.threadId].filter((img) => {
        img.origURL !== image.origURL
      })
      return {...state, pendingShares: filteredShares}
    case getType(actions.cancelShare):
      if (state.pendingShares[action.payload.threadId] === undefined) {
        return state
      }
      const pendingShares = state.pendingShares
      pendingShares[action.payload.threadId] = pendingShares[action.payload.threadId].filter((img) => img.origURL !== action.payload.image.origURL)
      return {...state, pendingShares}
    default:
      return state
  }
}

export default actions
