import { CameraRoll, Platform, PermissionsAndroid } from 'react-native'
import ImagePicker from 'react-native-image-picker'

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

export async function getPhotos(first: number = -1): Promise<string[]> {
  const result = await CameraRoll.getPhotos({ first })
  const items = result.edges.map(edge => edge.node.image.uri)
  return items
}

export async function chooseProfilePhoto(): Promise<{
  image: IPickerImage
  data: string
}> {
  return new Promise<{ image: IPickerImage; data: string }>(
    (resolve, reject) => {
      const options = {
        title: 'Choose a Profile Picture',
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.75,
        cameraType: 'front' as 'front' | 'back' | undefined,
        noData: false // just making this explicit
      }
      ImagePicker.showImagePicker(options, response => {
        if (response.didCancel) {
          reject(new Error('user canceled'))
        } else if (response.error) {
          reject(new Error(response.error))
        } else {
          // You can also display the image using data:
          // let source = { uri: 'data:image/jpeg;base64,' + response.data };
          let path: string
          let canDelete: boolean
          if (Platform.OS === 'ios') {
            path = response.uri ? response.uri.replace('file://', '') : ''
            canDelete = true
          } else {
            path = response.path!
            // currently needs a fix in Android to store in temp via https://github.com/react-native-community/react-native-image-picker/pull/1063
            canDelete = false
          }

          const image: IPickerImage = {
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
          const { data } = response
          resolve({ image, data })
        }
      })
    }
  )
}

export async function launchCamera(): Promise<IPickerImage> {
  return new Promise<IPickerImage>((resolve, reject) => {
    const options = {
      title: 'Camera',
      mediaType: 'photo' as 'photo',
      noData: true
    }

    ImagePicker.launchCamera(options, response => {
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

export async function launchImageLibrary(): Promise<IPickerImage> {
  return new Promise<IPickerImage>((resolve, reject) => {
    const options = {
      title: 'Camera',
      mediaType: 'photo' as 'photo',
      noData: true,
      storageOptions: {
        path: 'test123'
      }
    }

    ImagePicker.launchImageLibrary(options, response => {
      console.log('RESP:', response)
      if (response.error) {
        reject(response.error)
      }
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

export async function cameraPermissionsTrigger() {
  // Will trigger a camera permission request
  if (Platform.OS === 'android') {
    return await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Textile Photos Photos Permission',
        message:
          'Textile accesses your photo storage to import any new photos you take after you install the app.',
        buttonPositive: 'Ok'
      }
    )
  } else {
    return await getPhotos(1)
  }
}
