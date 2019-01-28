import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 0,
    marginVertical: 25,
    paddingVertical: 25,
    borderTopColor: '#ECEDEE',
    borderTopWidth: 1,
    flex: 1
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
    fontSize: 18
  },
  body: {},
  searchBoxPlaceholder: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderColor: '#ECEDEE'
  },
  threadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    width: '100%'
  },
  threadSelectRadio: {
    position: 'absolute',
    right: 0
  },
  missingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9
  },
  missingText: {
    height: 50,
    opacity: 0.8,
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: 'Biotif-Regular',
    fontSize: 14,
    flex: 1
  }
})
