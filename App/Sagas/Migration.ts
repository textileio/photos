import FS from 'react-native-fs'
import { all, call, put } from 'redux-saga/effects'
import { Dispatch } from 'redux'
import { keepScreenOn, letScreenSleep } from '../NativeModules/ScreenControl'
import MigrationActions from '../Redux/MigrationRedux'

const PHOTOS_FILE_PATH = `${FS.DocumentDirectoryPath}/migration005_default_photos.ndjson`
const THREADS_FILE_PATH = `${FS.DocumentDirectoryPath}/migration005_threads.ndjson`
const IMAGE_URL = (id: string, key: string) => `https://cafe.textile.io/ipfs/${id}/photo?key=${key}`
const MIGRATION_IMAGES_PATH = `${FS.DocumentDirectoryPath}/migration_images`
const IMAGE_PATH = (id: string) => `${MIGRATION_IMAGES_PATH}/${id}.jpg`

interface PhotoItem {
  id: string,
  key: string
}

interface ThreadItem {
  id: string,
  sk: string
}

export function * migrate(dispatch: Dispatch) {
  console.log('axh', 'migration ')
  // Take some sort of action to start the migration
  yield call(keepScreenOn)
  yield call(FS.mkdir, MIGRATION_IMAGES_PATH)
  const photoItems: PhotoItem[] = yield call(getItems, PHOTOS_FILE_PATH)
  const threadItems: ThreadItem[] = yield call(getItems, THREADS_FILE_PATH)
  yield put(MigrationActions.migrationMetadata(photoItems.length, threadItems.length))
  const downloadEffects = photoItems.map((item) => call(downloadPhoto, item, dispatch))
  yield all(downloadEffects)
  yield call(letScreenSleep)
  console.log('axh', 'migration done ')
}

function * downloadPhoto(item: PhotoItem, dispatch: Dispatch) {
  const options: FS.DownloadFileOptions = {
    fromUrl: IMAGE_URL(item.id, item.key),
    toFile: IMAGE_PATH(item.id),
    connectionTimeout: 5000,
    readTimeout: 5000,
    begin: (begin) => {
      const { jobId, statusCode, contentLength } = begin
      dispatch(MigrationActions.downloadStarted(jobId, statusCode, contentLength))
    },
    progress: (progress) => {
      const { jobId, bytesWritten } = progress
      dispatch(MigrationActions.downloadProgress(jobId, bytesWritten))
    }
  }
  const result: FS.DownloadResult = yield call(startDownload, options, dispatch)
  const { jobId, statusCode, bytesWritten } = result
  yield put(MigrationActions.downloadComplete(jobId, statusCode, bytesWritten))
}

// function * upload() {
//   const options: FS.UploadFileOptions = {
//     toUrl: 'aurl',
//     files: [],
//     headers: {

//     },
//     begin: (begin) => console.log(begin),
//     progress: (progress) => console.log(progress)
//   }
//   FS.uploadFiles(options)
// }

async function getItems<T>(path: string) {
  if (await FS.exists(path)) {
    const content = await FS.readFile(path)
    const lines = content.split('\n')
    const items = lines
      .filter((line) => line.length > 0)
      .map((line) => JSON.parse(line) as T)
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

function startDownload(options: FS.DownloadFileOptions, dispatch: Dispatch) {
  const result = FS.downloadFile(options)
  dispatch(MigrationActions.insertDownload(result.jobId, options.toFile))
  return result.promise
}
