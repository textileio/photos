import { StyleSheet } from 'react-native'
import { bentonSansBold } from '../../../util/fonts'

export default StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1
  },
  header: {
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 21
  },
  title: {
    fontFamily: 'Biotif-Regular',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 40,
    paddingTop: 10
  },
  contentContainer: {
    paddingHorizontal: 18
  },
  listContainer: {
    borderBottomWidth: 1,
    borderColor: '#d8d8d8'
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#d8d8d8'
  },
  childItem: {
    marginLeft: 10
  },
  itemTitle: {
    ...bentonSansBold(),
    fontFamily: 'Biotif-Regular',
    fontSize: 16,
    lineHeight: 27
  },
  disabledTitle: {
    color: '#4a4a4a'
  },
  childTitle: {
    fontSize: 14
  },
  itemDescription: {
    fontFamily: 'Biotif-Regular',
    fontSize: 14,
    lineHeight: 27,
    color: '#4a4a4a',
    marginRight: 6
  },
  itemTexts: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  permissionsButtonStyle: {
    height: 38,
    width: 70,
    backgroundColor: '#2625FF'
  },
  footer: {
    position: 'absolute',
    width: '100%',
    bottom: 30,
    paddingHorizontal: 28,
    alignItems: 'center'
  }
})
