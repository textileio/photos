import FS from 'react-native-fs'
import { all, call } from 'redux-saga/effects'
import { keepScreenOn, letScreenSleep } from '../NativeModules/ScreenControl'

interface PhotoItem {
  id: string,
  key: string
}

interface ThreadItem {
  id: string,
  sk: string
}

const PHOTOS_FILE_PATH = `${FS.DocumentDirectoryPath}/migration005_default_photos.ndjson`
const THREADS_FILE_PATH = `${FS.DocumentDirectoryPath}/migration005_threads.ndjson`
const IMAGE_URL = (id: string, key: string) => `https://cafe.textile.io/ipfs/${id}?key=${key}`
const MIGRATION_IMAGES_PATH = `${FS.DocumentDirectoryPath}/migration_images`
const IMAGE_PATH = (id: string) => `${MIGRATION_IMAGES_PATH}/${id}.jpg`

export function * migrate() {
  // Take some sort of action to start the migration
  yield call(keepScreenOn)
  yield call(FS.mkdir, MIGRATION_IMAGES_PATH)
  const photoItems: PhotoItem[] = yield call(getItems, PHOTOS_FILE_PATH)
  const downloadOptionsItems = photoItems.map((item): FS.DownloadFileOptions => ({
    fromUrl: IMAGE_URL(item.id, item.key),
    toFile: IMAGE_PATH(item.id),
    progress: (progress) => {
      console.log(`progress ${progress.jobId}: ${progress.bytesWritten / progress.contentLength}`)
    }
  }))
  const downloadEffects = downloadOptionsItems.map((item) => call(startDownload, item))
  yield all(downloadEffects)
  yield call(letScreenSleep)
}

async function getItems<T>(path: string) {
  if (await FS.exists(path)) {
    const content = await FS.readFile(path)
    const lines = content.split('\n')
    const items = lines.map((item) => JSON.parse(item) as T)
    return items
  } else {
    return []
  }
}

async function deleteFile(path: string) {
  if (await FS.exists(path)) {
    await FS.unlink(path)
  }
}

function startDownload(options: FS.DownloadFileOptions) {
  const result = FS.downloadFile(options)
  return result.promise
}

function reportProgress(progress: FS.DownloadProgressCallbackResult) {

}
