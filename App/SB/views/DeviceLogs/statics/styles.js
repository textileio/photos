import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1
  },
  contentContainer: {
    paddingHorizontal: 5,
    flex: 1,
    alignSelf: 'stretch'
  },
  headerRow: {
    flexDirection: 'row',
    height: 20
  },
  row: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'row',
    height: 'auto',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#AAAAAA'
  },
  timeCell: {
    width: '20%',
    paddingRight: 4
  },
  cell: {
    width: '30%',
    paddingRight: 4
  },
  messageCell: {
    flex: 1,
    alignSelf: 'stretch',
    flexWrap: 'wrap'
  },
  header: {
    fontFamily: 'BentonSans-Bold'
  },
  failure: {
    color: '#FF1C3F'
  },
  item: {
    fontSize: 10
  },
  toolBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5
  },
  link: {
    fontFamily: 'BentonSans-Bold',
    fontSize: 16,
    color: '#2625ff',
    padding: 5
  }
})
