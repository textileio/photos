import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import {LogView} from 'react-native-device-log'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/LogScreenStyle'
import Evilicon from "react-native-vector-icons/EvilIcons";

class LogScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    return {
      title: 'Logs',
      headerTitle: 'Logs'
    }
  }

  render () {
    return (
      <LogView inverted={false} multiExpanded={true} timeStampFormat='HH:mm:ss'></LogView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LogScreen)
