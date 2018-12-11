import {
    getPhotos,
    chooseProfilePhoto,
    launchCamera,
    launchImageLibrary
} from '../CameraRoll'

describe('camera roll', () => {
    describe('getPhotos', () => {
      it('get an arry of uris', async () => {
        await expect(getPhotos(1)).resolves.toMatchSnapshot()
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
            const result = await launchImageLibrary()
            expect(result).toMatchSnapshot()
        })
    })
    describe('chooseProfilePhoto', () => {
        it('should get a valid phto response, user cancel, and error', async () => {
            // User cancel
            await expect(chooseProfilePhoto()).rejects.toEqual(new Error('user canceled'))
            // Camera error
            await expect(chooseProfilePhoto()).rejects.toEqual(new Error('mock error'))
            // Success
            await expect(chooseProfilePhoto()).resolves.toMatchSnapshot()
        })
    })
})
