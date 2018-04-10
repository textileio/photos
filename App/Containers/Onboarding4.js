import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Button, View } from 'react-native'
import { connect } from 'react-redux'
import styles from './Styles/OnboardingScreenStyle'

class Onboarding4 extends Component {
  render () {
    const { navigate } = this.props.navigation
    return (
      <View style={{flex: 1}}>
        <ScrollView style={styles.container}>
          <KeyboardAvoidingView behavior='position'>
            <Text style={styles.header}>We collect anonymous data to help us improve our product.</Text>
            <Text style={styles.message}>
              As valued Beta Tester, we want to know how, when, and why you are using the app. We anonymously collect
              data, including crashes, screen interactions, and feedback. If you want to provide direct feedback,
              please feel free to email us with you thoughts, comments, or ideas.
            </Text>
          </KeyboardAvoidingView>
        </ScrollView>
        <Button
          onPress={() => navigate('Onboarding5')}
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

export default connect(mapStateToProps, mapDispatchToProps)(Onboarding4)
