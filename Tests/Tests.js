import React from 'react'
import PropTypes from 'prop-types'
import ReactNative from 'react-native'
const { Text, View } = ReactNative
const { TestModule } = ReactNative.NativeModules
import IPFS from '../TextileIPFSNativeModule'
import RNFS from 'react-native-fs'

// TODO: https://medium.com/@SkyscannerEng/testing-react-native-ios-bridges-80c730659a83

const done = (success) => {
  // Without this, the test will never complete
  TestModule.markTestPassed(success)
}

setupTests = async () => {
  // Put any setup code you want here, which will be passed on to the first
  // test in the sequence
  try {
    return await IPFS.createNodeWithDataDir(
      RNFS.DocumentDirectoryPath, 'http://localhost:8000','DEBUG')
  } catch(e) {
    throw new Error('create mobile node failed:' + e)
  }
}

testStart = async (prev) => {
  try {
    const success = await IPFS.startNode()
    if (!success) {
      throw new Error('failed starting node, but no error was thrown')
    }
    return success
  } catch(e) {
    throw new Error('start mobile node failed: ' + e)
  }
}

testStartAgain = async (prev) => {
  try {
    const success = await IPFS.startNode()
    if (!success) {
      throw new Error('failed starting node, but no error was thrown')
    }
    return success
  } catch(e) {
    throw new Error('attempt to start a running node failed: ', e)
  }
}

testSignUpWithEmail = async (prev) => {
  const resp = await fetch('http://localhost:8000/api/v1/referrals?count=1', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'X-Referral-Key': 'woohoo!'
    }
  })
  if (resp.status !== 201) {
    throw new Error('create referral for signup failed')
  }
  const data = await resp.json()
  const refCode = data.ref_codes[0]
  console.log("AAAAAAA", data, refCode)
  try {
    const success = await IPFS.signUp('fake', 'password', 'fake@textile.io', refCode)
    return success
  } catch(e) {
    console.log(e)
    throw new Error('signup failed:', e)
  }
}


class Tests extends React.Component {
  // static propTypes = {
  //   shouldThrow: PropTypes.bool,
  //   waitOneFrame: PropTypes.bool,
  // };

  state = {
    done: false,
  };

  componentDidMount() {
    this.runTests()
  }

  async runTests() {
    const setup = await setupTests()
    const started = await testStart(setup)
    // const again = await testStartAgain(started)
    const signup = await testSignUpWithEmail(started)
    done(signup)
  }

  render() {
    return (
      <View style={{backgroundColor: 'white', padding: 40}}>
        <Text>
          {this.constructor.displayName + ': '}
          {this.state.done ? 'Done' : 'Testing...'}
        </Text>
      </View>
    );
  }
}

Tests.displayName = 'Tests';

module.exports = Tests;
// AppRegistry.registerComponent('Tests', () => Tests);
