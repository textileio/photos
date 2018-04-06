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
  cardStyle: {
    // padding: 0,
  },
  notification: {
    flexDirection: 'row',
    flex: 1,
    maxWidth: '75%',
  },
  avatar: {
    // position: 'relative',
    marginRight: 20,
  },
  notificationText: {
    color: Colors.coal,
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
  backgroundImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
})
