import { StyleSheet } from 'react-native'
import { BentonSansBold } from '../../../util/fonts'

export default StyleSheet.create({
  contentContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 18,
    paddingTop: 25,
    borderTopColor: '#ECEDEE',
    borderTopWidth: 1
  },
  link: {
    ...BentonSansBold(),
    fontSize: 16,
    color: '#2625ff'
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
    fontFamily: 'BentonSans',
    fontSize: 24
  },
  small: {
    fontSize: 12,
    textDecorationLine: 'underline'
  },
  subtitle: {
    fontFamily: 'BentonSans',
    fontSize: 14,
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
  searchBoxIcon: {
    height: 14,
    width: 14,
    marginRight: 7
  },
  searchBoxInput: {
    fontFamily: 'BentonSans',
    fontSize: 14,
    color: '#8e8e93'
  },
  contactList: {},
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderColor: '#ECEDEE',
    width: '100%'
  },
  contactName: {
    fontFamily: 'BentonSans',
    fontSize: 14
  },
  contactSelectRadio: {
    position: 'absolute',
    right: 0
  }
})