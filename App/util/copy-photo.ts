import { call } from 'redux-saga/effects'
import RNFS from 'react-native-fs'

import AppConfig from '../Config/app-config'

interface PathContaining {
  path: string
}

export default function* copyPhoto<T extends PathContaining>(obj: T) {
  try {
    const parts = obj.path.split('/')
    const fileName = parts[parts.length - 1]
    const path = `${AppConfig.addingPhotosPath}/${fileName}`
    const destExists: boolean = yield call(
      RNFS.exists,
      AppConfig.addingPhotosPath
    )
    if (!destExists) {
      yield call(RNFS.mkdir, AppConfig.addingPhotosPath)
    }
    yield call(RNFS.copyFile, obj.path, path)
    const updated: T = {
      ...obj,
      path
    }
    return updated
  } catch (e) {
    return undefined
  }
}
