import { CameraRoll, Platform } from 'react-native'
import RNFS from 'react-native-fs'
import ImagePicker from 'react-native-image-picker'
import TextileNode from './TextileNode'

export interface IPickerImage {
  uri: string
  path: string
  canDelete: boolean
  height: number
  width: number
  isVertical: boolean
  origURL?: string
  didCancel?: boolean
  customButton?: string
  error?: string
}

export async function getPhotos (first: number = -1): Promise<string[]> {
  const result = await CameraRoll.getPhotos({ first })
  const items = result.edges.map((edge) => edge.node.image.uri)
  return items
}

export async function getPhotoPath (uri: string): Promise<string> {
  const fullDir = `${RNFS.DocumentDirectoryPath}/images/full/`
  const fullExists = await RNFS.exists(fullDir)
  if (!fullExists) {
    await RNFS.mkdir(fullDir)
  }
  // iOS method
  if (uri.includes('assets-library://')) {
    const regex = /[?&]([^=#]+)=([^&#]*)/g
    let match: RegExpExecArray | null
    const params = new Map<string, string>()

    do {
      match = regex.exec(uri)
      if (match) {
        const key = match[1]
        const value = match[2]
        params.set(key, value)
      }
    } while (match)

    const path = `${fullDir}${params.get('id')}.JPG`
    await RNFS.copyAssetsFileIOS(uri, path, 0, 0)
    return path
  }
  if (uri.includes('content://media')) {
    // Android Method
    const path = await TextileNode.getFilePath(uri)
    return path
  }
  throw new Error('unable to determine photo path.')
}

export async function chooseProfilePhoto(): Promise<{ uri: string, data: string}> {
  return new Promise<{ uri: string, data: string}>((resolve, reject) => {
    const options = {
      title: 'Choose a Profile Picture',
      maxWidth: 1200,
      maxHeight: 1200,
      quality: 0.75,
      cameraType: 'front' as 'front' | 'back' | undefined,
      storageOptions: {
        skipBackup: true,
        path: 'images',
        waitUntilSaved: true
      }
    }
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        reject(new Error('user canceled'))
      } else if (response.error) {
        reject(new Error(response.error))
      } else {
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        const { uri, data } = response
        resolve({ uri, data })
      }
    })
  })
}

export async function launchCamera (): Promise<IPickerImage> {
  return new Promise<IPickerImage>((resolve, reject) => {
    const options = {
      title: 'Camera',
      mediaType: 'photo' as 'photo',
      noData: true,
      storageOptions: {
        path: 'images',
        skipBackup: true,
        waitUntilSaved: true
      }
    }
    ImagePicker.launchCamera(options, (response) => {
      let path: string
      let canDelete: boolean
      if (Platform.OS === 'ios') {
        path = response.uri ? response.uri.replace('file://', '') : ''
        canDelete = true
      } else {
        path = response.path!
        canDelete = false
      }
      const result: IPickerImage = {
        uri: response.uri,
        path,
        canDelete,
        height: response.height,
        width: response.width,
        isVertical: response.isVertical,
        origURL: response.origURL,
        didCancel: response.didCancel,
        customButton: response.customButton,
        error: response.error
      }
      resolve(result)
    })
  })
}

export async function launchImageLibrary (): Promise<IPickerImage> {
  return new Promise<IPickerImage>((resolve, reject) => {
    const options = {
      title: 'Camera',
      mediaType: 'photo' as 'photo',
      noData: true,
      storageOptions: {
        path: 'images',
        skipBackup: true,
        waitUntilSaved: true
      }
    }
    ImagePicker.launchImageLibrary(options, (response) => {
      let path: string
      let canDelete: boolean
      if (Platform.OS === 'ios') {
        path = response.uri ? response.uri.replace('file://', '') : ''
        canDelete = true
      } else {
        path = response.path!
        canDelete = false
      }
      const result: IPickerImage = {
        uri: response.uri,
        path,
        canDelete,
        height: response.height,
        width: response.width,
        isVertical: response.isVertical,
        origURL: response.origURL,
        didCancel: response.didCancel,
        customButton: response.customButton,
        error: response.error
      }
      resolve(result)
    })
  })
}
