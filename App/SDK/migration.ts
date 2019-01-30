import RNFS from 'react-native-fs'

export default class Migration {
  requiresFileMigration = async (repoPath: string): Promise<boolean> => {
    const repoPathExists: boolean = await RNFS.exists(repoPath)
    if (!repoPathExists) {
      return true
    }
    return false
  }

  runFileMigration = async (repoPath: string): Promise<void> => {
    const repoPathExists: boolean = await RNFS.exists(repoPath)
    if (!repoPathExists) {
      await RNFS.mkdir(repoPath)
      await this.moveTextileFiles(repoPath)
    }
  }

  moveTextileFiles = async (repoPath: string): Promise<void> => {
    const files = await RNFS.readDir(RNFS.DocumentDirectoryPath)
    for (const file of files) {
      if (file.path !== repoPath && file.name !== 'RCTAsyncLocalStorage_V1') {
        await RNFS.moveFile(file.path, `${repoPath}/${file.name}`)
      }
    }
  }
}
