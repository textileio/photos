import { createAction, getType, ActionType } from 'typesafe-actions'
import { IMobilePreparedFiles } from '../NativeModules/Textile/pb/textile-go'

const actions = {
  migrationNeeded: createAction('@migration/MIGRATION_NEEDED'),
  requestMigration: createAction('@migration/REQUEST_MIGRATION'),
  cancelMigration: createAction('@migration/CANCEL_MIGRATION'),
  migrationStarted: createAction('@migration/MIGRATION_STARTED'),
  migrationComplete: createAction('@migration/MIGRATION_COMPLETE'),
  migrationMetadata: createAction(
    '@migration/MIGRATION_METADATA',
    (resolve) => (photosCount: number, threadsCount: number) => resolve({ photosCount, threadsCount })
  ),
  requestRunRecurringMigrationTasks: createAction('@migration/REQUEST_RECURRING_MIGRATION'),
  peerAnnouncement: createAction(
    '@migration/PEER_ANNOUNCEMENT',
    (resolve) => (peerDetails: PeerDetails) => resolve({ peerDetails })
  ),
  photoMigration: createAction(
    '@migration/PHOTO_MIGRATION_SETUP',
    (resolve) => (photos: MigrationPhoto[]) => resolve({ photos })
  ),
  photoMigrationError: createAction('@migration/PHOTO_MIGRATION_ERROR'),
  photoMigrationSuccess: createAction(
    '@migration/PHOTO_MIGRATION_SUCCESS',
    (resolve) => () => resolve()
  ),
  peerAnnouncementSuccess: createAction('@migration/PEER_ANNOUNCEMENT_SUCCESS'),
  connectToPeers: createAction(
    '@migration/CONNECT_TO_PEERS',
    (resolve) => (peers: string[]) => resolve({ peers })
  ),
  connectionSuccess: createAction(
    '@migration/CONNECTION_SUCCESS',
    (resolve) => (peer: string) => resolve({ peer })
  ),
  insertDownload: createAction(
    '@migration/INSERT_DOWNLOAD',
    (resolve) => (photoId: string, path: string) => resolve({ photoId, path })
  ),
  downloadStarted: createAction(
    '@migration/DOWNLOAD_STARTED',
    (resolve) => (photoId: string, statusCode: number, contentLength: number) => resolve({ photoId, statusCode, contentLength })
  ),
  downloadProgress: createAction(
    '@migration/DOWNLOAD_PROGRESS',
    (resolve) => (photoId: string, bytesWritten: number) => resolve({ photoId, bytesWritten })
  ),
  downloadComplete: createAction(
    '@migration/DOWNLOAD_COMPLETE',
    (resolve) => (photoId: string, statusCode: number, bytesWritten: number) => resolve({ photoId, statusCode, bytesWritten })
  ),
  downloadError: createAction(
    '@migration/DOWNLOAD_ERROR',
    (resolve) => (photoId: string, error: any) => resolve({ photoId, error })
  ),
  insertLocalProcessingTask: createAction(
    '@migration/INSERT_LOCAL_PROCESSING_TASK',
    (resolve) => (photoId: string) => resolve({ photoId })
  ),
  localProcessingTaskComplete: createAction(
    '@migration/INSERT_LOCAL_PROCESSING_TASK_COMPLETE',
    (resolve) => (photoId: string, preparedFiles: IMobilePreparedFiles) => resolve({ photoId, preparedFiles })
  ),
  localProcessingTaskError: createAction(
    '@migration/INSERT_LOCAL_PROCESSING_TASK_ERROR',
    (resolve) => (photoId: string, error: any) => resolve({ photoId, error })
  )
}

export type MigrationAction = ActionType<typeof actions>

export interface MigrationPhoto {
  id: string,
  key: string
}

export interface PhotoDownload {
  readonly photoId: string
  readonly path: string
  readonly contentLength?: number
  readonly bytesWritten: number
  readonly statusCode?: number
  readonly error?: string
  readonly status: 'pending' | 'downloading' | 'complete' | 'error'
}

export interface PhotoDownloads {
  readonly [key: string]: PhotoDownload
}

export interface LocalProcessingTask {
  readonly photoId: string
  readonly preparedFiles?: IMobilePreparedFiles
  readonly status: 'processing' | 'complete' | 'error'
  readonly error?: string
}

export interface LocalProcessingTasks {
  readonly [key: string]: LocalProcessingTask
}

export interface PeerDetails {
  readonly currentPeerId: string,
  readonly previousPeerId: string,
  readonly currentAddress: string,
  readonly previousUsername?: string
}

export interface MigrationState {
  readonly status: 'none' | 'pending' | 'processing' | 'complete'
  readonly peerAnnouncement?: {
    readonly peerDetails: PeerDetails,
    readonly status: 'pending' | 'complete'
  }
  readonly network?: ReadonlyArray<string>,
  readonly photosCount?: number
  readonly threadsCount?: number
  readonly username?: string
  readonly migrationPhotos?: ReadonlyArray<MigrationPhoto>
  readonly photoDownloads?: PhotoDownloads
  readonly localProcessingTasks?: LocalProcessingTasks
}

const initialState: MigrationState = {
  status: 'none'
}

export function reducer(state: MigrationState = initialState, action: MigrationAction): MigrationState {
  switch (action.type) {
    case getType(actions.migrationNeeded):
      return { ...state, status: 'pending' }
    case getType(actions.cancelMigration):
      return { ...state, status: 'none' }
    case getType(actions.migrationStarted):
      return { ...state, status: 'processing' }
    case getType(actions.migrationComplete):
      return { ...state, status: 'pending' } // TODO: change to complete
    case getType(actions.migrationMetadata): {
      const { photosCount, threadsCount } = action.payload
      return { ...state, photosCount, threadsCount }
    }
    case getType(actions.peerAnnouncement): {
      const { peerDetails } = action.payload
      const { previousUsername } = peerDetails
      return { ...state, peerAnnouncement: { peerDetails, status: 'pending' }, username: previousUsername }
    }
    case getType(actions.peerAnnouncementSuccess): {
      return { ...state, peerAnnouncement: { ...state.peerAnnouncement!, status: 'complete' } }
    }
    case getType(actions.connectToPeers): {
      const network = action.payload.peers
      return { ...state, network }
    }
    case getType(actions.connectionSuccess): {
      const { peer } = action.payload
      if (!state.network) {
        return state
      }
      const peers = state.network.filter((p) => p !== peer)
      return { ...state, network: peers }
    }
    case getType(actions.photoMigration): {
      const { photos } = action.payload
      return { ...state, migrationPhotos: photos }
    }
    case getType(actions.photoMigrationSuccess): {
      return { ...state, migrationPhotos: undefined }
    }
    case getType(actions.insertDownload): {
      const { photoId, path } = action.payload
      const photoDownloads: PhotoDownloads = { ...state.photoDownloads, [photoId]: { photoId, path, bytesWritten: 0, status: 'pending' }}
      return { ...state, photoDownloads }
    }
    case getType(actions.downloadStarted): {
      const { photoId, statusCode, contentLength } = action.payload
      const download = state.photoDownloads![photoId]
      const updatedDownload: PhotoDownload = { ...download, statusCode, contentLength, status: 'downloading' }
      const photoDownloads: PhotoDownloads = { ...state.photoDownloads, [photoId]: updatedDownload }
      return { ...state, photoDownloads }
    }
    case getType(actions.downloadProgress): {
      const { photoId, bytesWritten } = action.payload
      const download = state.photoDownloads![photoId]
      const updatedDownload: PhotoDownload = { ...download, bytesWritten }
      const photoDownloads: PhotoDownloads = { ...state.photoDownloads, [photoId]: updatedDownload }
      return { ...state, photoDownloads }
    }
    case getType(actions.downloadComplete): {
      const { photoId, statusCode, bytesWritten } = action.payload
      const download = state.photoDownloads![photoId]
      const updatedDownload: PhotoDownload = { ...download, statusCode, bytesWritten, status: 'complete' }
      const photoDownloads: PhotoDownloads = { ...state.photoDownloads, [photoId]: updatedDownload }
      return { ...state, photoDownloads }
    }
    case getType(actions.downloadError): {
      const { photoId, error } = action.payload
      const download = state.photoDownloads![photoId]
      const message = error.message as string || error as string || 'unknown error'
      const updatedDownload: PhotoDownload = { ...download, error: message, status: 'error' }
      const photoDownloads: PhotoDownloads = { ...state.photoDownloads, [photoId]: updatedDownload }
      return { ...state, photoDownloads }
    }
    case getType(actions.insertLocalProcessingTask): {
      const { photoId } =  action.payload
      return { ...state, localProcessingTasks: { ...state.localProcessingTasks, [photoId]: { photoId, status: 'processing' } } }
    }
    case getType(actions.localProcessingTaskComplete): {
      const { photoId, preparedFiles } = action.payload
      const taskData = state.localProcessingTasks![photoId]
      const updated: LocalProcessingTask = { ...taskData, status: 'complete', preparedFiles }
      return { ...state, localProcessingTasks: { ...state.localProcessingTasks, [photoId]: updated } }
    }
    case getType(actions.localProcessingTaskError): {
      const { photoId, error } = action.payload
      const taskData = state.localProcessingTasks![photoId]
      const message = error.message as string || error as string || 'unknown error'
      const updated: LocalProcessingTask = { ...taskData, status: 'error', error: message }
      return { ...state, localProcessingTasks: { ...state.localProcessingTasks, [photoId]: updated } }
    }
    default:
      return state
  }
}

export default actions
