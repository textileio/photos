import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors } from '../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    borderTopColor: Colors.transparent,
    borderTopWidth: 0,
    borderBottomColor: Colors.test,
    borderBottomWidth: 0,
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 20
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  row: {
    flex: 1,
    backgroundColor: Colors.transparent,
    // marginVertical: Metrics.smallMargin,
    justifyContent: 'center',
    alignItems: 'center',
    // margin: 2,
    marginTop: 18,
    marginBottom: 12,
  },
  boldLabel: {
    fontWeight: 'bold',
    alignSelf: 'center',
    color: Colors.ember,
    textAlign: 'center',
    marginBottom: Metrics.smallMargin
  },
  label: {
    textAlign: 'center',
    color: Colors.snow
  },
  listContent: {
    marginTop: 0, ///Metrics.baseMargin
  },
  statusLabel: {
    position: 'absolute',
    textAlign: 'center',
    backgroundColor: Colors.brandPink,
    color: Colors.background,
    paddingVertical: 4,
    paddingHorizontal: 6
  }
})
