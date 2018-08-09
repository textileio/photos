import React from 'react'
import { connect } from 'react-redux'
import { View, Text, ScrollView } from 'react-native'

import FeedItem from '../../components/FeedItem'
import Toast from 'react-native-easy-toast'

import navStyles from '../../../Navigation/Styles/NavigationStyles'
import styles from './statics/styles'

class Notifications extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: [navStyles.header, {
        height: 60,
        paddingHorizontal: 16
      }],
      headerLeft: (<Text style={styles.toolbarTitle}>{'Notifications'}</Text>)
    }
  }

  _onClick (category, target) {
    if (target && (category === 'threads' || category === 'content')) {
      this.props.navigation.navigate('ViewThread', target)
    } else {
      this.refs.toast.show('Wohoo!', 500)
    }
  }

  render () {
    return (
      <View style={styles.container}>
        {/*<FeedItemUpdate />*/}
        <ScrollView style={styles.contentContainer}>
          {this.props.notifications.map((item, i) => (
            <FeedItem key={i} profile={this.props.profile} {...item} onClick={this._onClick.bind(this)}/>
          ))}
        </ScrollView>
        <Toast ref='toast' position='center' />
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    notifications: state.notifications.notifications
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)
