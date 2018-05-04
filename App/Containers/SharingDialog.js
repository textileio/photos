import React, { Component } from 'react'
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import SharingNavigation from '../Navigation/SharingNavigation'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/SharingDialogStyle'

class SharingDialog extends Component {
  // constructor (props) {
  //   super(props)
  //   this.state = {}
  // }

  render () {
    return (
      <View style={styles.container}>
        <Image source={{uri: 'https://bloximages.chicago2.vip.townnews.com/tremontonleader.com/content/tncms/assets/v3/editorial/e/17/e1789df2-1972-11e7-9afd-4b07c46e5992/58e3fe1047fdf.image.png'}} style={{height: '33%'}} />
        <SharingNavigation style={{flex: 1, backgroundColor: 'blue'}} />
        {/*<View style={{flexDirection: 'row'}}>*/}
          {/*<TouchableOpacity>*/}
            {/*<Text>Cancel</Text>*/}
          {/*</TouchableOpacity>*/}
          {/*<TouchableOpacity>*/}
            {/*<Text>Next</Text>*/}
          {/*</TouchableOpacity>*/}
        {/*</View>*/}
      </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(SharingDialog)
