import { StyleSheet, ImageStyle, ViewStyle, TextStyle } from 'react-native'
import { bentonSansBold } from '../../../util/fonts'

interface Styles {
  contentContainer: ViewStyle
  link: TextStyle
  inactive: TextStyle
  header: ViewStyle
  headerTitle: ViewStyle
  title: TextStyle
  small: TextStyle
  subtitle: TextStyle
  selectedContact: ImageStyle
  selectedContactList: ViewStyle
  selectedContactIcon: ImageStyle
  contactIcon: ImageStyle
  body: ViewStyle
  searchBoxContainer: ViewStyle
  searchBoxPlaceholder: ViewStyle
  searchBoxIcon: ImageStyle
  searchBoxInput: TextStyle
  contactList: ViewStyle
  inviteItem: ViewStyle
  inviteLink: TextStyle
  inviteLessImage: ImageStyle
  inviteLess: ViewStyle
  contactItem: ViewStyle
  contactName: TextStyle
  contactSelectRadio: ViewStyle
  linkIcon: ImageStyle
  linkText: TextStyle
}

export default StyleSheet.create<Styles>({
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingHorizontal: 18,
    paddingTop: 25
  },
  link: {
    ...bentonSansBold(),
    fontSize: 16,
    color: '#2625ff'
  },
  inactive: {
    color: 'rgba(33, 33, 33, 0.6)'
  },
  header: {
    marginBottom: 21
  },
  headerTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18
  },
  title: {
    fontFamily: 'Biotif-Regular',
    fontSize: 24
  },
  small: {
    fontSize: 12,
    textDecorationLine: 'underline'
  },
  subtitle: {
    fontFamily: 'Biotif-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#9b9b9b',
    marginBottom: 10
  },
  selectedContact: {
    height: 43,
    width: 43,
    position: 'relative',
    marginRight: 15
  },
  selectedContactList: {
    flexDirection: 'row'
  },
  selectedContactIcon: {
    height: 14,
    width: 14,
    position: 'absolute',
    zIndex: 10,
    right: -5
  },
  contactIcon: {
    height: 43,
    width: 43
  },
  body: {},
  searchBoxContainer: {
    flexDirection: 'row',
    height: 36,
    backgroundColor: '#EEF0F3',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 8,
    paddingVertical: 11
  },
  searchBoxPlaceholder: {
    flexDirection: 'row',
    // height: 4,
    // backgroundColor: '#EEF0F3',
    // borderRadius: 2,
    marginBottom: 2,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderColor: '#ECEDEE'
  },
  searchBoxIcon: {
    height: 14,
    width: 14,
    marginRight: 7
  },
  searchBoxInput: {
    fontFamily: 'Biotif-Regular',
    fontSize: 14,
    color: '#8e8e93'
  },
  contactList: {},
  inviteItem: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    paddingVertical: 28,
    borderTopWidth: 1,
    borderColor: '#ECEDEE'
  },
  inviteLink: {
    textAlign: 'center',
    color: '#2E8BFE'
  },
  inviteLessImage: {
    opacity: 0.1
  },
  inviteLess: {
    opacity: 0.4
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderColor: '#ECEDEE',
    width: '100%'
  },
  contactName: {
    fontFamily: 'Biotif-Regular',
    fontSize: 14
  },
  contactSelectRadio: {
    position: 'absolute',
    right: 0
  },
  linkIcon: {
    position: 'relative',
    height: 20,
    width: 20,
    margin: 12,
    marginRight: 15
  },
  linkText: {
    fontFamily: 'Biotif-Regular',
    fontSize: 14,
    paddingTop: 2,
    color: '#2E8BFE'
  }
})
