import { RootState } from './Types'

export function overallDownloadProgress(state: RootState) {
  let totalSize = 0
  let totalDownloaded = 0
  for (const jobId in state.migration.photoDownloads) {
    if (state.migration.photoDownloads[jobId]) {
      const download = state.migration.photoDownloads[jobId]
      totalSize = totalSize + (download.contentLength || 0)
      totalDownloaded = totalDownloaded + download.bytesWritten
    }
  }
  return totalDownloaded / totalSize
}
