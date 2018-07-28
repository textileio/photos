import { StyleSheet } from 'react-native'
import { BentonSansBold } from '../../../util/fonts'

export default StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: '#FAFCFE',
    flex: 1
  },
  toolbarLeft: {
    height: 16,
    width: 40
  },
  toolBarRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  toolbarBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 11,
    marginBottom: 10
  },
  toolbarImage: {
    height: 59,
    width: 59
  },
  toolbarUserName: {
    fontFamily: 'BentonSans',
    fontSize: 24,
    marginBottom: 8
  },
  toolbarThreadsQty: {
    fontFamily: 'BentonSans',
    fontSize: 13
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
    paddingTop: 25,
  },
  serversText: {
    color: '#4A4A4A'
  },
  activeIcon: {
    height: 10,
    width: 10,
    backgroundColor: '#6FC110',
    borderRadius: 20,
    marginRight: 4
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 90
  }
})