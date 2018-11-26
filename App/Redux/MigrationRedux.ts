import { createAction, getType, ActionType } from 'typesafe-actions'

const actions = {
  migrationMetadata: createAction(
    '@migration/MIGRATION_METADATA',
    (resolve) => (photosCount: number, threadsCount: number) => resolve({ photosCount, threadsCount })
  ),
  insertDownload: createAction(
    '@migration/INSERT_DOWNLOAD',
    (resolve) => (jobId: number, path: string) => resolve({ jobId, path })
  ),
  downloadStarted: createAction(
    '@migration/DOWNLOAD_STARTED',
    (resolve) => (jobId: number, statusCode: number, contentLength: number) => resolve({ jobId, statusCode, contentLength })
  ),
  downloadProgress: createAction(
    '@migration/DOWNLOAD_PROGRESS',
    (resolve) => (jobId: number, bytesWritten: number) => resolve({ jobId, bytesWritten })
  ),
  downloadComplete: createAction(
    '@migration/DOWNLOAD_COMPLETE',
    (resolve) => (jobId: number, statusCode: number, bytesWritten: number) => resolve({ jobId, statusCode, bytesWritten })
  ),
  insertAdd: createAction(
    '@migration/INSERT_ADD',
    (resolve) => (sourcePath: string) => resolve({ sourcePath })
  ),
  startAdd: createAction(
    '@migration/ADD',
    (resolve) => (id: string) => resolve({ id })
  ),
  addComplete: createAction(
    '@migration/ADD_COMPLETE',
    (resolve) => (id: string, payloadPath?: string, hash?: string) => resolve({ id, payloadPath, hash })
  )
}

export type MigrationAction = ActionType<typeof actions>

export interface PhotoDownload {
  readonly jobId: number
  readonly path: string
  readonly contentLength?: number
  readonly bytesWritten: number
  readonly statusCode?: number
  readonly error?: string
}

export interface PhotoDownloads {
  readonly [key: number]: PhotoDownload
}

export interface PhotoAdd {
  readonly sourcePath: string
  readonly status: 'pending' | 'adding' | 'complete'
  readonly payloadPath?: string
  readonly hash?: string
}

export interface PhotoAdds {
  readonly [key: string]: PhotoAdd
}

export interface MigrationState {
  readonly photosCount?: number
  readonly threadsCount?: number
  readonly photoDownloads: PhotoDownloads
  readonly photoAdds: PhotoAdds
}

const initialState: MigrationState = {
  photoDownloads: {},
  photoAdds: {}
}

export function reducer(state: MigrationState = initialState, action: MigrationAction): MigrationState {
  switch (action.type) {
    case getType(actions.migrationMetadata): {
      const { photosCount, threadsCount } = action.payload
      return { ...state, photosCount, threadsCount }
    }
    case getType(actions.insertDownload): {
      const { jobId, path } = action.payload
      const photoDownloads: PhotoDownloads = { ...state.photoDownloads, [jobId]: { jobId, path, bytesWritten: 0 }}
      return { ...state, photoDownloads }
    }
    case getType(actions.downloadStarted): {
      const { jobId, statusCode, contentLength } = action.payload
      const download = state.photoDownloads[jobId]
      const updatedDownload: PhotoDownload = { ...download, statusCode, contentLength }
      const photoDownloads: PhotoDownloads = { ...state.photoDownloads, [jobId]: updatedDownload }
      return { ...state, photoDownloads }
    }
    case getType(actions.downloadProgress): {
      const { jobId, bytesWritten } = action.payload
      const download = state.photoDownloads[jobId]
      const updatedDownload: PhotoDownload = { ...download, bytesWritten }
      const photoDownloads: PhotoDownloads = { ...state.photoDownloads, [jobId]: updatedDownload }
      return { ...state, photoDownloads }
    }
    case getType(actions.downloadComplete): {
      const { jobId, statusCode, bytesWritten } = action.payload
      const download = state.photoDownloads[jobId]
      const updatedDownload: PhotoDownload = { ...download, statusCode, bytesWritten }
      const photoDownloads: PhotoDownloads = { ...state.photoDownloads, [jobId]: updatedDownload }
      return { ...state, photoDownloads }
    }
    case getType(actions.insertAdd): {
      const { sourcePath } =  action.payload
      return { ...state, photoAdds: { ...state.photoAdds, [sourcePath]: { sourcePath, status: 'pending' } } }
    }
    case getType(actions.startAdd): {
      const { id } = action.payload
      const addData = state.photoAdds[id]
      const updated: PhotoAdd = { ...addData, status: 'adding' }
      return { ...state, photoAdds: { ...state.photoAdds, [id]: updated } }
    }
    case getType(actions.addComplete): {
      const { id, payloadPath, hash } = action.payload
      const addData = state.photoAdds[id]
      const updated: PhotoAdd = { ...addData, status: 'complete', payloadPath, hash }
      return { ...state, photoAdds: { ...state.photoAdds, [id]: updated } }
    }
    default:
      return state
  }
}

export default actions
