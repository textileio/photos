import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Button, View } from 'react-native'
import { connect } from 'react-redux'
import styles from './Styles/OnboardingScreenStyle'

class Onboarding1 extends Component {
  render () {
    const { navigate } = this.props.navigation
    return (
      <View style={{flex: 1}}>
        <ScrollView style={styles.container}>
          <KeyboardAvoidingView behavior='position'>
            <Text style={styles.header}>Today we’re sharing our backup and sync tools.</Text>
            <Text style={styles.message}>
              While we don't recommend you delete your photos until our full release, right now you can use our system
              to upload backups of your private photos to decentralized servers around the world and then retrieve
              those photos at any time. You can also use our desktop tool to magically sync all your photos right to
              your computer.
            </Text>
          </KeyboardAvoidingView>
        </ScrollView>
        <Button
          onPress={() => navigate('Onboarding2')}
          title='Ok'
          accessibilityLabel='Move on to the next screen'
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Onboarding1)
