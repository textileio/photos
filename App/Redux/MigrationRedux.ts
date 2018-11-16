import { createAction, getType, ActionType } from 'typesafe-actions'

const actions = {
  migrationMetadata: createAction(
    'MIGRATION_METADATA',
    (resolve) => (photosCount: number, threadsCount: number) => resolve({ photosCount, threadsCount })
  ),
  insertDownload: createAction(
    'INSERT_DOWNLOAD',
    (resolve) => (jobId: number, path: string) => resolve({ jobId, path })
  ),
  downloadStarted: createAction(
    'DOWNLOAD_STARTED',
    (resolve) => (jobId: number, statusCode: number, contentLength: number) => resolve({ jobId, statusCode, contentLength })
  ),
  downloadProgress: createAction(
    'DOWNLOAD_PROGRESS',
    (resolve) => (jobId: number, bytesWritten: number) => resolve({ jobId, bytesWritten })
  ),
  downloadComplete: createAction(
    'DOWNLOAD_COMPLETE',
    (resolve) => (jobId: number, statusCode: number, bytesWritten: number) => resolve({ jobId, statusCode, bytesWritten })
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

export interface MigrationState {
  readonly photosCount?: number
  readonly threadsCount?: number
  readonly photoDownloads: PhotoDownloads
}

const initialState: MigrationState = {
  photoDownloads: {}
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
    default:
      return state
  }
}

export default actions
