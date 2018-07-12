import { createAction, ActionType, getType } from 'typesafe-actions'

const actions = {
  viewPhotoRequest: createAction('VIEW_PHOTO_REQUEST', resolve => {
    return (index: number, thread: string) => resolve({ index, thread })
  }),
  switchViewdPhoto: createAction('SWITCH_VIEWED_PHOTO', resolve => {
    return (index: number) => resolve(index)
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
    return (threads: ReadonlyMap<string, boolean>) => resolve({ threads })
  }),
  updateComment: createAction('UPDATE_COMMENT', resolve => {
    return (comment: string) => resolve(comment)
  }),
  sharePhotoRequest: createAction('SHARE_PHOTO_REQUEST', resolve => {
    return (threads: [string], hash: string, caption?: string) => resolve({ threads, hash, caption })
  }),
  imageSharingError: createAction('IMAGE_SHARING_ERROR', resolve => {
    return (error: Error) => resolve(error)
  })
}

export type UIAction = ActionType<typeof actions>

export type UIState = {
  readonly viewingPhoto: {
    readonly active: boolean
    readonly index?: number
    readonly thread?: string
  },
  readonly sharingPhoto: {
    readonly active: boolean,
    readonly hash?: string,
    readonly selectedThreads: ReadonlyMap<string, boolean>,
    readonly comment?: string
  }
}

export const initialState: UIState = {
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
    case getType(actions.viewPhotoRequest):
      return { ...state, viewingPhoto: { ...state.viewingPhoto, active: true, index: action.payload.index, thread: action.payload.thread } }
    case getType(actions.switchViewdPhoto):
      return { ...state, viewingPhoto: { ...state.viewingPhoto, index: action.payload } }
    case getType(actions.dismissViewedPhoto):
      return { ...state, viewingPhoto: { ...state.viewingPhoto, active: false } }
    case getType(actions.authorPhotoShareRequest):
      return { ...state, sharingPhoto: { ...state.sharingPhoto, active: true, hash: action.payload, selectedThreads: new Map<string, boolean>() } }
    case getType(actions.cancelAuthoringPhotoShare):
      return { ...state, sharingPhoto: { ...state.sharingPhoto, active: false } }
    case getType(actions.updateSelectedThreads):
      return { ...state, sharingPhoto: { ...state.sharingPhoto, selectedThreads: action.payload.threads } }
    case getType(actions.updateComment):
      return { ...state, sharingPhoto: { ...state.sharingPhoto, comment: action.payload } }
    default:
      return state
  }
}

export default actions
