import React from 'react'
import { connect } from 'react-redux'
import { View, Text, ScrollView } from 'react-native'

import Toolbar from '../../components/Toolbar'
import FeedItem from '../../components/FeedItem'
import FeedItemUpdate from '../../components/FeedItemUpdate'
import BottomBar from '../../components/BottomBar'

import navStyles from '../../../Navigation/Styles/NavigationStyles'
import styles from './statics/styles'
import list from './constants'

class Notifications extends React.PureComponent {
  constructor (props) {
    super(props)
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: [navStyles.header, {
        height: 60,
        paddingHorizontal: 16
      }],
      headerLeft: (<Text style={styles.toolbarTitle}>{'Notifications'}</Text>)
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <FeedItemUpdate />
        <ScrollView style={styles.contentContainer}>
          {list.map((item, i) => (
            <FeedItem key={i} {...item} />
          ))}
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)
