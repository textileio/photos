import React from 'react'
import PropTypes from 'prop-types'
import ReactNative from 'react-native'
const { Text, View } = ReactNative
const { TestModule } = ReactNative.NativeModules

const done = () => {
  // Without this, the test will never complete
  TestModule.markTestCompleted()
}

setupTests = async () => {
  // Put any setup code you want here, which will be passed on to the first
  // test in the sequence
  return true
}

testOne = async (prev) => {
  try {
    // Put your RN code that interacts with native code here
    console.log("hey whatsup inside async!")
  } catch(e) {
    throw new Error("ERROR: " + e);
    console.log("download failed: " + e)
  }
  return prev
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
    const oneOut = await testOne(setup)
    // const twoOut = await test(outOut)
    // const threeOut = await test(twoOut)
    done()
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
