import { CameraRoll } from 'react-native'
import RNFS from 'react-native-fs'
import ImagePicker from 'react-native-image-picker'
import TextileNode from '../../TextileNode'

export async function getPhotos (first: number = -1): Promise<string[]> {
  const result = await CameraRoll.getPhotos({ first })
  const items = result.edges.map(edge => edge.node.image.uri)
  return items
}

export async function getPhotoPath (uri: string): Promise<string> {
  const fullDir = RNFS.DocumentDirectoryPath + '/images/full/'
  const fullExists = await RNFS.exists(fullDir)
  if (!fullExists) {
    await RNFS.mkdir(fullDir)
  }
  // iOS method
  if (uri.includes('assets-library://')) {
    const regex = /[?&]([^=#]+)=([^&#]*)/g
    let match: RegExpExecArray | null
    const params = new Map<string, string>()
    while (match = regex.exec(uri)) {
      if (!match) {
        continue
      }
      const key = match[1]
      const value = match[2]
      params.set(key, value)
    }
    const path = fullDir + params.get('id') + '.JPG'
    await RNFS.copyAssetsFileIOS(uri, path, 0, 0)
    return path
  }
  // Android Method
  else if (uri.includes('content://media')) {
    const path = await TextileNode.getFilePath(uri)
    return path
  }
  else {
    throw new Error('unable to determine photo path.')
  }
}

export async function chooseProfilePhoto(): Promise<{ uri: string, data: string}> {
  return new Promise<{ uri: string, data: string}>((resolve, reject) => {
    const options = {
      title: 'Choose a Profile Picture',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    }
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        reject(new Error('user canceled'))
      }
      else if (response.error) {
        reject(new Error(response.error))
      }
      else {
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        const { uri, data } = response
        resolve({ uri, data })
      }
    })
  })
}
