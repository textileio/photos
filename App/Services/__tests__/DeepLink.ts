import DeepLink from '../DeepLink'
import { pb } from '@textile/react-native-sdk'
import { NavigationService } from '../NavigationService'
import {
    NavigationContainerComponent,
    NavigationParams
  } from 'react-navigation'

const params = 'id=QmdNgTtH468cqZFzXCi4sVSWTbJMWQbhYb8cBVyikP9LzW&key=VsHHHz8bC8fu9k78RaX8ujQsUzGzaUxwKJyLFKKDacUZoWJaouGnzUQwgmh5&inviter=andrew-dev&name=TRT%20Dev&referral=SOMETHING'
const link = `www.textile.photos/invites/new#${params}`
const invite: pb.INewInvite = {
    id: 'QmdNgTtH468cqZFzXCi4sVSWTbJMWQbhYb8cBVyikP9LzW',
    key: 'VsHHHz8bC8fu9k78RaX8ujQsUzGzaUxwKJyLFKKDacUZoWJaouGnzUQwgmh5',
    inviter: 'andrew-dev'
}
const threadName: string = 'TRT Dev'

let navigateTo: string
const navigationMock: NavigationService = {
    navigate: (routeName: string, params?: NavigationParams) => {
        navigateTo = routeName
    },
    setTopLevelNavigator: (navigatorRef: NavigationContainerComponent) => {},
    goBack: () => {}
}

describe('deeplink', () => {
  describe('getData', () => {
    it('should parse a HTTP link', () => {
        const protocol = 'https'
        expect(DeepLink.getData(`${protocol}://${link}`)).toMatchSnapshot()
    })
    it('should parse a Dev link', () => {
        const protocol = 'textile-dev'
        expect(DeepLink.getData(`${protocol}://${link}`)).toMatchSnapshot()
    })
    it('should parse a Beta link', () => {
        const protocol = 'textile-beta'
        expect(DeepLink.getData(`${protocol}://${link}`)).toMatchSnapshot()
    })
    it('should parse a Production link', () => {
        const protocol = 'textile'
        expect(DeepLink.getData(`${protocol}://${link}`)).toMatchSnapshot()
    })
  })
  describe('getParams', () => {
    it('should parse a Production link', () => {
        expect(DeepLink.getParams(`${params}`)).toMatchSnapshot()
    })
  })
  describe('createInviteLink', () => {
    it('should create a valid invite link', () => {
        expect(DeepLink.createInviteLink(invite, threadName)).toMatchSnapshot()
    })
  })
  describe('route', () => {
    it('should route to invites', () => {
        DeepLink.route(`https://${link}`, navigationMock)
        expect(navigateTo).toEqual('ThreadInvite')
    })
  })
})
