/* @flow */
import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import ImagePicker from 'react-native-image-crop-picker';
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/NewScreenStyle'

type Props = {
  foo: number,
};

class NewScreen extends Component<Props> {

  static defaultProps = {
    foo: 42,
  };

  static navigationOptions = {
    title: "Settings"
  }

  // componentDidMount() {
  //   ImagePicker.openPicker({
  //     multiple: true
  //   }).then(images => {
  //     console.log(images);
  //   });
  // }

  render () {
    return (
      <ScrollView style={styles.container}>
        <KeyboardAvoidingView behavior='position'>
          <Text>NewScreen</Text>
        </KeyboardAvoidingView>
      </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(NewScreen)
