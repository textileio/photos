import { StyleSheet } from 'react-native'
import { BentonSansBold } from '../../../util/fonts'

export default StyleSheet.create({
  container: {
    backgroundColor: '#FAFCFE',
    flex: 1
  },
  toolBarRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  toolbarBack: {
    paddingVertical: 20
  },
  toolbarBackIcon: {
    height: 16,
    width: 40
  },
  toolbarUserName: {
    fontFamily: 'BentonSans',
    fontSize: 24,
    marginBottom: 8
  },
  toolbarThreadsQty: {
    flexDirection: 'row',
    fontFamily: 'BentonSans',
    fontSize: 13,
    flex: 1
  },
  toolbarBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 11,
    marginBottom: 10
  },
  toolbarImage: {
    borderRadius: 20,
    marginTop: 36
  },
  strong: {
    ...BentonSansBold()
  },
  title: {
    fontFamily: 'BentonSans',
    fontSize: 14,
    color: '#9b9b9b',
    marginBottom: 17
  },
  contentContainer: {
    paddingLeft: 16
  },
  listItemFirst: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ECEDEE'
  },
  listItem: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: '#ECEDEE'
  },
  listText: {
    fontFamily: 'BentonSans',
    fontSize: 14
  },
  warning: {
    color: '#D0021B'
  },
  servers: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 25
  },
  serversText: {
    fontFamily: 'BentonSans',
    color: '#4A4A4A'
  },
  activeIcon: {
    height: 10,
    width: 10,
    backgroundColor: '#6FC110',
    borderRadius: 20,
    marginRight: 4
  },
  inActiveIcon: {
    height: 10,
    width: 10,
    backgroundColor: '#ff1c3f',
    borderRadius: 20,
    marginRight: 4
  },
  activatingIcon: {
    height: 10,
    width: 10,
    backgroundColor: '#ffce00',
    borderRadius: 20,
    marginRight: 4
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 30
  },
  versionDescription: {
    fontFamily: 'BentonSans',
    fontSize: 12,
    marginTop: 8,
    color: 'rgb(200,200,200)'
  },
  subScreen: {
    backgroundColor: '#FAFCFE',
    paddingTop: 75,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100
  },
  headerImage: {
    width: 159,
    height: 146,
    marginBottom: 16
  },
  subScreenText: {
    fontFamily: 'BentonSans',
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
    paddingHorizontal: 52,
    marginBottom: 24
  }
})
