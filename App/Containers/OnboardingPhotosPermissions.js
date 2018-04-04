import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Image, Button, View } from 'react-native'
import { connect } from 'react-redux'
import {getPhoto} from '../Services/PhotoUtils'
import Actions from '../Redux/TextileRedux'

// Styles
import styles from './Styles/OnboardingScreenStyle'
import Ionicon from "react-native-vector-icons/Ionicons";

class OnboardingPhotosPermissions extends Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      headerTitle: 'Permissions',
    }
  };

  async handlePress() {
    await getPhoto() // Trigger photos permission prompt
    this.props.navigation.navigate('OnboardingPermissions')
  }

  render () {
    const { navigate } = this.props.navigation
    return (
      <View style={{flex:1}}>
        <ScrollView style={styles.container}>
          <KeyboardAvoidingView behavior='position'>
            <Text style={styles.header}>Photos Access</Text>
            <View style={styles.imageView}>
              <Text style={styles.message}>
                We need to access your photos so we can privately back them up in Textile.
              </Text>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
        <Button
          onPress={this.handlePress}
          title='Authorize'
          accessibilityLabel='Photos authorization'
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingPhotosPermissions)
