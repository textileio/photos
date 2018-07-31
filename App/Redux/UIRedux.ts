import { createAction, ActionType, getType } from 'typesafe-actions'

const actions = {
  chooseProfilePhotoRequest: createAction('CHOOSE_PROFILE_PHOTO_REQUEST'),
  chooseProfilePhotoSuccess: createAction('CHOOSE_PROFILE_PHOTO_SUCCESS', resolve => {
    return (uri: string, data: string) => resolve({ uri, data })
  }),
  chooseProfilePhotoError: createAction('CHOOSE_PROFILE_PHOTO_ERROR', resolve => {
    return (error: Error) => resolve({ error })
  }),
  selectProfilePicture: createAction('SELECT_PROFILE_PICTURE', resolve => {
    return (uri: string) => resolve({ uri })
  }),
  viewPhotoRequest: createAction('VIEW_PHOTO_REQUEST', resolve => {
    return (photoId: string, threadId: string) => resolve({ photoId, threadId })
  }),
  switchViewdPhoto: createAction('SWITCH_VIEWED_PHOTO', resolve => {
    return (photoId: string) => resolve(photoId)
  }),
  dismissViewedPhoto: createAction('DISMISS_VIEWED_PHOTO', resolve => {
    return () => resolve()
  }),
  authorPhotoShareRequest: createAction('AUTHOR_PHOTO_SHARE_REQUEST', resolve => {
    return (hash: string) => resolve(hash)
  }),
  cancelAuthoringPhotoShare: createAction('CANCEL_AUTHORING_PHOTO_SHARE', resolve => {
    return () => resolve()
  }),
  updateSelectedThreads: createAction('UPDATE_SELECTED_THREADS', resolve => {
    return (threadIds: ReadonlyMap<string, boolean>) => resolve({ threadIds })
  }),
  updateComment: createAction('UPDATE_COMMENT', resolve => {
    return (comment: string) => resolve(comment)
  }),
  sharePhotoRequest: createAction('SHARE_PHOTO_REQUEST', resolve => {
    return (id: string, threadIds: [string], caption?: string) => resolve({ id, threadIds, caption })
  }),
  getPublicLink: createAction('GET_PUBLIC_LINK', resolve => {
    return (photoId: string) => resolve({ photoId })
  }),
  imageSharingError: createAction('IMAGE_SHARING_ERROR', resolve => {
    return (error: Error) => resolve(error)
  })
}

export type UIAction = ActionType<typeof actions>

export type UIState = {
  readonly chosenProfilePhoto: {
    readonly uri?: string,
    readonly data?: string
    readonly error?: Error
  }
  readonly viewingPhoto: {
    readonly active: boolean
    readonly photoId?: string
    readonly threadId?: string
  },
  readonly sharingPhoto: {
    readonly active: boolean,
    readonly hash?: string,
    readonly selectedThreads: ReadonlyMap<string, boolean>,
    readonly comment?: string
  }
}

export const initialState: UIState = {
  chosenProfilePhoto: {},
  viewingPhoto: {
    active: false
  },
  sharingPhoto: {
    active: false,
    selectedThreads: new Map<string, boolean>()
  }
}

export function reducer (state: UIState = initialState, action: UIAction): UIState {
  switch (action.type) {
    case getType(actions.chooseProfilePhotoSuccess):
    case getType(actions.chooseProfilePhotoError):
      return { ...state, chosenProfilePhoto: { ...state.chosenProfilePhoto, ...action.payload } }
    case getType(actions.viewPhotoRequest):
      const { photoId, threadId } = action.payload
      return { ...state, viewingPhoto: { ...state.viewingPhoto, active: true, photoId, threadId } }
    case getType(actions.switchViewdPhoto):
      return { ...state, viewingPhoto: { ...state.viewingPhoto, photoId: action.payload } }
    case getType(actions.dismissViewedPhoto):
      return { ...state, viewingPhoto: { ...state.viewingPhoto, active: false } }
    case getType(actions.authorPhotoShareRequest):
      return { ...state, sharingPhoto: { ...state.sharingPhoto, active: true, hash: action.payload, selectedThreads: new Map<string, boolean>() } }
    case getType(actions.cancelAuthoringPhotoShare):
      return { ...state, sharingPhoto: { ...state.sharingPhoto, active: false } }
    case getType(actions.updateSelectedThreads):
      return { ...state, sharingPhoto: { ...state.sharingPhoto, selectedThreads: action.payload.threadIds } }
    case getType(actions.updateComment):
      return { ...state, sharingPhoto: { ...state.sharingPhoto, comment: action.payload } }
    default:
      return state
  }
}

export default actions
