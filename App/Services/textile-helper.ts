import Textile, {
  IMobilePreparedFiles,
  IBlock
} from '@textile/react-native-sdk'
import { call, put } from 'redux-saga/effects'

import { fileSyncActions } from '../features/file-sync'
import { uploadFile } from '../Sagas/UploadFile'

export function* prepareAndAdd(
  path: string,
  threadId: string,
  caption?: string
) {
  const preparedFiles: IMobilePreparedFiles = yield call(
    Textile.files.prepareByPath,
    path,
    threadId
  )
  const block: IBlock = yield call(
    Textile.files.add,
    preparedFiles.dir,
    threadId,
    caption
  )
  for (const key of Object.keys(preparedFiles.pin)) {
    const path = preparedFiles.pin[key]
    yield put(fileSyncActions.begin(block.id, key))
    yield call(uploadFile, key, path)
  }
  return block
}
