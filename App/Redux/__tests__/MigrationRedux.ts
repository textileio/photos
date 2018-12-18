import actions, { reducer } from '../MigrationRedux'
import { getAnnouncement, getNetwork } from '../MigrationSelectors'
import { PeerDetails, MigrationState } from '../MigrationRedux'
import { RootState } from '../Types'

const initialState = reducer(undefined, {} as any)
const profile: MigrationState = {
  photosCount: 0,
  threadsCount: 0,
  photoDownloads: {},
  photoAdds: {}
}

const peerDetails: PeerDetails = {
  peerId: 'ABC-DEF-GHI',
  previousId: 'XYZ-UVW-RST',
  address: '123-456-789',
  username: 'jest test'
}

const network: string[] = [
  'AAA',
  'BBB',
  'CCC'
]

describe('migration', () => {
  describe('initial state', () => {
    it('should match snapshot', () => {
      expect(initialState).toMatchSnapshot()
    })
  })
  describe('migration', () => {
    let migrationState = initialState
    it('should store peer details to migration', () => {
      migrationState =  reducer(
        migrationState,
        actions.announceMigration(
          peerDetails.peerId,
          peerDetails.address,
          peerDetails.username,
          peerDetails.previousId
        )
      )
      expect(migrationState.announcement).toEqual(peerDetails)
    })
    it('should select correct announcement details', () => {
      const selected = getAnnouncement({migration: migrationState} as RootState)
      expect(selected).toEqual(peerDetails)
    })
    it('should store network details for migration', () => {
      migrationState =  reducer(
        migrationState,
          actions.connectToPeers(
            network
          )
        )
      expect(migrationState.network).toEqual(network)
    })
    it('should select correct network details', () => {
      const selected = getNetwork({migration: migrationState} as RootState)
      expect(selected).toEqual(network)
    })
  })
})
