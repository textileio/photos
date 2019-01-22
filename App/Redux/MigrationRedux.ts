import { createAction, getType, ActionType } from 'typesafe-actions'
import { Protobufs } from '@textile/react-native-sdk'
import { ContactInfo } from '@textile/react-native-sdk'

const actions = {
  migrationNeeded: createAction('@migration/MIGRATION_NEEDED'),
  requestMigration: createAction('@migration/REQUEST_MIGRATION'),
  cancelMigration: createAction('@migration/CANCEL_MIGRATION'),
  retryMigration: createAction('@migration/RETRY_MIGRATION'),
  migrationStarted: createAction('@migration/MIGRATION_STARTED'),
  migrationComplete: createAction('@migration/MIGRATION_COMPLETE'),
  migrationError: createAction('@migration/MIGRATION_ERROR', (resolve) => (error: any) => resolve({ error })),
  requestRunRecurringMigrationTasks: createAction('@migration/REQUEST_RECURRING_MIGRATION'),
  peerAnnouncement: createAction(
    '@migration/PEER_ANNOUNCEMENT',
    (resolve) => (peerDetails: PeerDetails) => resolve({ peerDetails })
  ),
  photoMigration: createAction(
    '@migration/PHOTO_MIGRATION_SETUP',
    (resolve) => (photos: MigrationPhoto[]) => resolve({ photos })
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
    (resolve) => (photoId: string, preparedFiles: Protobufs.IMobilePreparedFiles) => resolve({ photoId, preparedFiles })
  ),
  localProcessingTaskError: createAction(
    '@migration/INSERT_LOCAL_PROCESSING_TASK_ERROR',
    (resolve) => (photoId: string, error: any) => resolve({ photoId, error })
  ),
  insertUpload: createAction(
    '@migration/INSERT_UPLOAD',
    (resolve) => (photoId: string, path: string, totalBytesExpectedToSend: number) => resolve({ photoId, path, totalBytesExpectedToSend })
  ),
  uploadStarted: createAction(
    '@migration/UPLOAD_STARTED',
    (resolve) => (photoId: string) => resolve({ photoId })
  ),
  uploadProgress: createAction(
    '@migration/UPLOAD_PROGRESS',
    (resolve) => (photoId: string, totalBytesExpectedToSend: number, totalBytesSent: number) => resolve({ photoId, totalBytesExpectedToSend, totalBytesSent })
  ),
  uploadComplete: createAction(
    '@migration/UPLOAD_COMPLETE',
    (resolve) => (photoId: string, statusCode: number) => resolve({ photoId, statusCode })
  ),
  uploadError: createAction(
    '@migration/UPLOAD_ERROR',
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
  readonly preparedFiles?: Protobufs.IMobilePreparedFiles
  readonly status: 'processing' | 'complete' | 'error'
  readonly error?: string
}

export interface LocalProcessingTasks {
  readonly [key: string]: LocalProcessingTask
}

export interface PhotoUpload {
  readonly photoId: string
  readonly path: string
  readonly statusCode?: number
  readonly totalBytesExpectedToSend: number
  readonly totalBytesSent: number
  readonly error?: string
  readonly status: 'pending' | 'uploading' | 'complete' | 'error'
}

export interface PhotoUploads {
  readonly [key: string]: PhotoUpload
}

export interface PeerDetails {
  readonly previousPeerId: string,
  readonly previousUsername?: string,
  readonly currentContactInfo?: ContactInfo
}

export interface MigrationState {
  readonly status: 'none' | 'pending' | 'processing' | 'complete' | 'cancelled'
  readonly peerAnnouncement?: {
    readonly peerDetails: PeerDetails,
    readonly status: 'pending' | 'complete'
  }
  readonly network?: ReadonlyArray<string>,
  readonly migrationPhotos?: ReadonlyArray<MigrationPhoto>
  readonly photoDownloads?: PhotoDownloads
  readonly localProcessingTasks?: LocalProcessingTasks
  readonly photoUploads?: PhotoUploads
  readonly error?: string
}

const initialState: MigrationState = {
  status: 'none'
}

export function reducer(state: MigrationState = initialState, action: MigrationAction): MigrationState {
  switch (action.type) {
    case getType(actions.migrationNeeded):
      return { ...state, status: 'pending' }
    case getType(actions.cancelMigration):
      return { ...state, status: 'cancelled' }
    case getType(actions.retryMigration):
      return { status: 'pending' }
    case getType(actions.migrationStarted):
      return { ...state, status: 'processing' }
    case getType(actions.migrationComplete):
      return { ...state, status: 'complete' }
    case getType(actions.migrationError): {
      const { error } = action.payload
      const message = error.message as string || error as string || 'unknown error'
      return { ...state, error: message }
    }
    case getType(actions.peerAnnouncement): {
      const { peerDetails } = action.payload
      return { ...state, peerAnnouncement: { peerDetails, status: 'pending' } }
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
    case getType(actions.insertUpload): {
      const { photoId, path, totalBytesExpectedToSend } = action.payload
      const photoUploads: PhotoUploads = { ...state.photoUploads, [photoId]: { photoId, path, totalBytesExpectedToSend, totalBytesSent: 0, status: 'pending' }}
      return { ...state, photoUploads }
    }
    case getType(actions.uploadStarted): {
      const { photoId } = action.payload
      const upload = state.photoUploads![photoId]
      const updatedUpload: PhotoUpload = { ...upload, status: 'uploading' }
      const photoUploads: PhotoUploads = { ...state.photoUploads, [photoId]: updatedUpload }
      return { ...state, photoUploads }
    }
    case getType(actions.uploadProgress): {
      const { photoId, totalBytesExpectedToSend, totalBytesSent } = action.payload
      const upload = state.photoUploads![photoId]
      const updatedUpload: PhotoUpload = { ...upload, totalBytesExpectedToSend, totalBytesSent }
      const photoUploads: PhotoUploads = { ...state.photoUploads, [photoId]: updatedUpload }
      return { ...state, photoUploads }
    }
    case getType(actions.uploadComplete): {
      const { photoId, statusCode } = action.payload
      const upload = state.photoUploads![photoId]
      const updatedUpload: PhotoUpload = { ...upload, statusCode, status: 'complete' }
      const photoUploads: PhotoUploads = { ...state.photoUploads, [photoId]: updatedUpload }
      return { ...state, photoUploads }
    }
    case getType(actions.uploadError): {
      const { photoId, error } = action.payload
      const upload = state.photoUploads![photoId]
      const message = error.message as string || error as string || 'unknown error'
      const updatedUpload: PhotoUpload = { ...upload, error: message, status: 'error' }
      const photoUploads: PhotoUploads = { ...state.photoUploads, [photoId]: updatedUpload }
      return { ...state, photoUploads }
    }
    default:
      return state
  }
}

export default actions
