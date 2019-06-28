import { IPickerImage } from '../App/Services/CameraRoll'

export default {
  showImagePicker: jest
    .fn()
    // User cancelled
    .mockImplementationOnce(
      (options: any, callback: (response: any) => void) => {
        const response = {
          didCancel: true
        }
        callback(response)
      }
    )
    // Error
    .mockImplementationOnce(
      (options: any, callback: (response: any) => void) => {
        const response = {
          error: 'mock error'
        }
        callback(response)
      }
    )
    // Successful
    .mockImplementationOnce(
      (options: any, callback: (response: any) => void) => {
        const response = {
          uri: 'uri',
          path: 'some/path',
          height: 200,
          width: 200,
          isVertical: false,
          origURL: 'uri',
          didCancel: false
        }
        callback(response)
      }
    ),
  launchCamera: jest.fn(
    (options: any, callback: (result: IPickerImage) => void) => {
      const result = {
        uri: 'uri',
        path: 'some/path',
        canDelete: false,
        height: 200,
        width: 200,
        isVertical: false,
        origURL: 'uri',
        didCancel: false
      }
      callback(result)
    }
  ),
  launchImageLibrary: jest.fn(
    (options: any, callback: (result: IPickerImage) => void) => {
      const result = {
        uri: 'uri',
        path: 'some/path',
        canDelete: false,
        height: 200,
        width: 200,
        isVertical: false,
        origURL: 'uri',
        didCancel: false
      }
      callback(result)
    }
  )
}
