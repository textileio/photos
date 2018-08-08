import React from 'react'
import { connect } from 'react-redux'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { NavigationActions } from 'react-navigation'
import ImageSc from 'react-native-scalable-image'

import Toolbar from '../../components/Toolbar'

import styles from './statics/styles'
import navStyles from '../../../Navigation/Styles/NavigationStyles'

class UserProfile extends React.PureComponent {
  constructor (props) {
    super(props)
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <TouchableOpacity onPress={ () => {
          navigation.dispatch(NavigationActions.back())
        }}>
          <View style={styles.toolbarBack}>
            <Image style={styles.toolbarBackIcon} source={require('./statics/icon-arrow-left.png')} />
          </View>
          <Text style={styles.toolbarUserName}>Hello Briana</Text>
          <Text style={styles.toolbarThreadsQty}><Text style={styles.strong}>3,423</Text> Photos</Text>
        </TouchableOpacity>),
      headerRight: (
        <TouchableOpacity>
          <Image style={styles.toolbarImage} source={require('./statics/icon-user.png')} />
        </TouchableOpacity>
      )
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.listItem}>
            <Text style={styles.listText}>Settings</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listText}>Privacy</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listText}>Notifications</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listText}>Contact</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={[styles.listText, styles.warning]}>Lock screen</Text>
          </View>
          <View style={styles.servers}>
            <View style={styles.activeIcon}/>
            <Text style={styles.serversText}>Connected to <Text style={styles.strong}>23</Text> servers</Text>
          </View>
          <View style={styles.logoContainer}>
            <ImageSc width={83} source={require('./statics/textile-gray-logo.png')}/>
          </View>
        </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)
