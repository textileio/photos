import { createAction, getType, ActionType } from 'typesafe-actions'

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
  announceMigration: createAction(
    '@migration/ANNOUNCE',
    (resolve) => (peerId: string, previousId: string, address: string, username?: string) => resolve({ peerId, address, username, previousId })
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
  announceSuccess: createAction(
    '@migration/ANNOUNCE_SUCCESS',
    (resolve) => () => resolve()
  ),
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

export interface MigrationPhoto {
  id: string,
  key: string
}

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

export interface PeerDetails {
  readonly peerId: string,
  readonly previousId: string,
  readonly address: string,
  readonly username?: string
}

export interface MigrationState {
  readonly status: 'none' | 'pending' | 'processing' | 'complete'
  readonly photosCount?: number
  readonly threadsCount?: number
  readonly photoDownloads: PhotoDownloads
  readonly photoAdds: PhotoAdds
  readonly announcement?: PeerDetails
  readonly network?: ReadonlyArray<string>
  readonly username?: string
  readonly migrationPhotos?: ReadonlyArray<MigrationPhoto>
}

const initialState: MigrationState = {
  status: 'none',
  photoDownloads: {},
  photoAdds: {}
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
      return { ...state, status: 'complete' }
    case getType(actions.migrationMetadata): {
      const { photosCount, threadsCount } = action.payload
      return { ...state, photosCount, threadsCount }
    }
    case getType(actions.announceMigration): {
      const announcement: PeerDetails = action.payload
      const { username } = action.payload
      return { ...state, announcement, username }
    }
    case getType(actions.announceSuccess): {
      return { ...state, announcement: undefined }
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
