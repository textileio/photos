import { take, put, call, all } from 'redux-saga/effects'
import RNFS from 'react-native-fs'
// import AccountActions from '../../Redux/AccountRedux'
import {
  cafeSessions,
  refreshCafeSession,
  peerId,
  profile,
  setAvatar as updateAvatar,
  setUsername as username,
  ContactInfo,
  CafeSession
} from '@textile/react-native-sdk'

export const REPO_PATH = `${RNFS.DocumentDirectoryPath}/textile-go`

export default class Migration {
  requiresFileMigration = async (): Promise<boolean> => {
    const repoPathExists: boolean = await RNFS.exists(REPO_PATH)
    if (!repoPathExists) {
      return true
    }
    return false
  }

  runFileMigration = async (): Promise<void> => {
    const repoPathExists: boolean = await RNFS.exists(REPO_PATH)
    if (!repoPathExists) {
      await RNFS.mkdir(REPO_PATH)
      await this.moveTextileFiles()
    }
  }

  moveTextileFiles = async (): Promise<void> => {
    const files = await RNFS.readDir(RNFS.DocumentDirectoryPath)
    for (const file of files) {
      if (file.path !== REPO_PATH && file.name !== 'RCTAsyncLocalStorage_V1') {
        await RNFS.moveFile(file.path, `${REPO_PATH}/${file.name}`)
      }
    }
  }
}
