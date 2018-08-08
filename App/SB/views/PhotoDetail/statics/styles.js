import { StyleSheet } from 'react-native'
import { BentonSansBold } from '../../../util/fonts'

export default StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: '#FAFCFE',
    flex: 1,
  },
  bodyContainer: {
    marginTop: 0, // <- changed because headers will be outside of Containers now...
    backgroundColor: '#FAFCFE',
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 19,
    paddingTop: 24
  },
  toolBar: { // <-- took this style from SB/components/Toolbar
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderBottomColor: '#ECEDEE',
    borderBottomWidth: 1,
    backgroundColor: 'white'
  },
  toolbarLeft: {
    height: 16,
    width: 40
  },
  backButtonWrapper: {
    paddingVertical: 5
  },
  moreButtonWrapper: {
    paddingVertical: 2,
    paddingRight: 15,
    paddingLeft: 25
  },
  toolbarIconsList: {
    flexDirection: 'row'
  },
  toolbarAddIcon: {
    width: 24,
    height: 24,
  },
  toolbarDownloadIcon: {
    width: 22,
    height: 21,
  },
  toolbarShareIcon: {
    marginTop: 3,
    width: 18,
    height: 18
  },
  toolbarRemoveIcon: {
    width: 14,
    height: 18,
     marginLeft: 35
  },
  photoDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    height: 50,
    borderBottomWidth: 1,
    borderColor: '#ECEDEE',
  },
  detailItem: {
    flexDirection: 'row'
  },
  detailText: {
    marginLeft: 9
  },
  iconLocation: {
    width: 13,
    height: 17,
  },
  iconInfo: {
    width: 18,
    height: 18
  },
  iconCalendar: {
    width: 16,
    height: 16,
  },
  threadsTitle: {
    fontFamily: "BentonSans",
    fontSize: 14,
    color: "#9b9b9b",
    paddingBottom: 16
  }
})
