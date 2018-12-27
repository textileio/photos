import { RootState } from './Types'
import { PeerDetails, MigrationPhoto, PhotoDownload, LocalProcessingTask } from './MigrationRedux'

export function overallUploadProgress(state: RootState) {
  let totalSize = 0
  let totalUploaded = 0
  if (state.migration.photoUploads) {
    for (const photoId in state.migration.photoUploads) {
      if (state.migration.photoUploads[photoId]) {
        const upload = state.migration.photoUploads[photoId]
        totalSize = totalSize + (upload.totalBytesExpectedToSend || 0)
        totalUploaded = totalUploaded + (upload.totalBytesSent || 0)
      }
    }
  }
  if (totalSize > 0) {
    return totalUploaded / totalSize
  } else {
    return undefined
  }
}

export function completeLocalProcessingTasks(state: RootState) {
  return Object.keys(state.migration.localProcessingTasks || {})
    .map((key) => state.migration.localProcessingTasks![key] as LocalProcessingTask)
    .filter((task) => task.status === 'complete')
}

export function completeLocalProcessingTasksCount(state: RootState) {
  return Object.keys(state.migration.localProcessingTasks || {})
    .map((key) => state.migration.localProcessingTasks![key] as LocalProcessingTask)
    .filter((task) => task.status === 'complete' || task.status === 'error')
    .length
}

export function localProcessingTasksCount(state: RootState) {
  return Object.keys(state.migration.localProcessingTasks || {}).length
}

export function completeDownloads(state: RootState) {
  return Object.keys(state.migration.photoDownloads || {})
    .map((key) => state.migration.photoDownloads![key] as PhotoDownload)
    .filter((download) => download.status === 'complete')
}

export function completeDownloadsCount(state: RootState) {
  return Object.keys(state.migration.photoDownloads || {})
    .map((key) => state.migration.photoDownloads![key] as PhotoDownload)
    .filter((download) => download.status === 'complete' || download.status === 'error')
    .length
}

export function downloadsCount(state: RootState) {
  return Object.keys(state.migration.photoDownloads || {}).length
}

export function getAnnouncement(state: RootState) {
  return state.migration.peerAnnouncement
}

export function getNetwork(state: RootState): ReadonlyArray<string> {
  return state.migration.network || []
}

export function getMigrationPhotos(state: RootState): ReadonlyArray<MigrationPhoto> {
  return state.migration.migrationPhotos || []
}
