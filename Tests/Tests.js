const React = require('react');
const PropTypes = require('prop-types');
const ReactNative = require('react-native');
const { Text, View } = ReactNative;
const { TestModule } = ReactNative.NativeModules;

class Tests extends React.Component {
  static propTypes = {
    shouldThrow: PropTypes.bool,
    waitOneFrame: PropTypes.bool,
  };

  state = {
    done: false,
  };

  componentDidMount() {
    this.runTest();
  }

  runTest() {
    async function SampleCall(){
      try{
        console.log("hey whatsup inside async!")
      }catch(e){
        throw new Error("ERROR: " + e);
        console.log("download failed: " + e)
      }
    }
    SampleCall().then(()=> {
      // Without this, the test will never complete
      TestModule.markTestPassed(true)
      console.log("nothing")
    })
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
