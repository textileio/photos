import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Button, View } from 'react-native'
import { connect } from 'react-redux'
import styles from './Styles/OnboardingScreenStyle'

class Onboarding2 extends Component {
  render () {
    const { navigate } = this.props.navigation
    return (
      <View style={{flex: 1}}>
        <ScrollView style={styles.container}>
          <KeyboardAvoidingView behavior='position'>
            <Text style={styles.header}>We’ve got big plans…</Text>
            <Text style={styles.message}>
              We want to test out our infrastructure for moving, storing, and accessing private photos today. Next, we
              hope to provide you with some really exciting ways to share photos and interact with your friends and
              family on the same system. Beyond that, we want to give you secure tools to regain control over all
              your data.
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

export default connect(mapStateToProps, mapDispatchToProps)(Onboarding2)
