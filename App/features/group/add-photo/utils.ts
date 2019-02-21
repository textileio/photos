import { UploadData } from './models'

export function allComplete(uploadData: UploadData) {
  if (Object.keys(uploadData).length < 1) {
    return false
  }
  let allUploadsComplete = true
  for (const id in uploadData) {
    if (uploadData[id]) {
      if (uploadData[id].status !== 'complete') {
        allUploadsComplete = false
      }
    }
  }
  return allUploadsComplete
}
