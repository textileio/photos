import {
    getPhotos,
    chooseProfilePhoto,
    launchCamera,
    launchImageLibrary
} from '../CameraRoll'

describe('camera roll', () => {
    describe('getPhotos', () => {
      it('get an arry of uris', async () => {
          expect(getPhotos(1)).resolves.toMatchSnapshot()
      })
    })
    describe('launchCamera', () => {
        it('should successfully launch', async () => {
            const result = await launchCamera()
            expect(result).toMatchSnapshot()
        })
    })
    describe('launchImageLibrary', () => {
        it('should successfully launch', async () => {
            expect(launchImageLibrary()).resolves.toMatchSnapshot()
        })
    })
    describe('chooseProfilePhoto', () => {
        it('should get a valid photo response, user cancel, and error', async () => {
            // Success
            expect(chooseProfilePhoto()).resolves.toMatchSnapshot()
            // User cancel
            expect(chooseProfilePhoto()).rejects.toEqual(new Error('user cancelled'))
            // Camera error
            expect(chooseProfilePhoto()).rejects.toEqual(new Error('mock error'))
        })
    })
})
