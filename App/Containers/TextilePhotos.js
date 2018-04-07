// @flow
import React from 'react'
import {View, Text, FlatList, TouchableOpacity, Linking, Platform, ImageBackground} from 'react-native'
import Evilicon from 'react-native-vector-icons/EvilIcons'
import { connect } from 'react-redux'
import Actions from '../Redux/TextileRedux'
import { Card, Tile } from 'react-native-elements'

// More info here: https://facebook.github.io/react-native/docs/flatlist.html

// Styles
import styles from './Styles/TextilePhotosStyle'

class TextilePhotos extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      limit: 10
    }
  }

  // static navigationOptions = ({ navigation }) => {
  //   const params = navigation.state.params || {};
  //   return {
  //     headerTitle: (
  //       <Image
  //         source={require('../Images/Icons/icon-home.png')}
  //       />
  //     ),
  //     headerRight: (
  //       <HeaderButtons IconComponent={Ionicon} iconSize={23} color="blue">
  //         <HeaderButtons.Item title="camera" iconName="ios-camera-outline" onPress={params.showCamera} />
  //         <HeaderButtons.Item title="add" iconName="ios-add" onPress={params.showPhotoPicker} />
  //       </HeaderButtons>
  //     )
  //   }
  // };

  componentWillMount () {
    // this.props.navigation.setParams({
    //   // showPhotoPicker: this._showPhotoPicker.bind(this),
    //   // showCamera: this._showCamera.bind(this)
    // });
    // this.makeRemoteRequest();
  }

  componentDidMount() {
    if (!this.props.onboarded) {
      // this.props.navigation.navigate("OnboardingSecurity")
    }
    // TODO: This logic should be moved deeper into the stack
    if (Platform.OS === 'android') {
      // TODO: Android deep linking isn't setup in the Java native layer
      Linking.getInitialURL().then(url => {
        this._handleOpenURL(url)
      })
    } else {
      Linking.addEventListener('url', this._handleOpenURLEvent.bind(this))
    }

  }
  // TODO: This logic should be moved deeper into the stack
  _handleOpenURLEvent (event) {
    this._handleOpenURL(event.url)
  }
  // TODO: This logic should be moved deeper into the stack
  _handleOpenURL (url) {
    const data = url.replace(/.*?:\/\//g, '')
    this.props.navigation.navigate("PairingView", {data: data})
  }


  // Just added this simple function here @aaron, nothing fancy.
  // I stole this from elsewhere, so there are some extra probs in here
  //
  // _showPhotoPicker () {
  //   ImagePicker.openPicker({
  //     multiple: true
  //   }).then(this.props.addImagesRequest)
  //     .catch(e => console.log(e))
  // }
  //
  // _showCamera () {
  //   ImagePicker.openCamera({
  //     width: 300,
  //     height: 400
  //   })
  //     .then(image => {
  //       this.props.addImagesRequest([image])
  //     })
  //     .catch(e => console.log(e))
  // }

  /* ***********************************************************
  * STEP 1
  * This is an array of objects with the properties you desire
  * Usually this should come from Redux mapStateToProps
  *************************************************************/
  // state = {
  //   dataObjects: [
  //     {title: 'First Title', description: 'First Description'},
  //     {title: 'Second Title', description: 'Second Description'},
  //     {title: 'Third Title', description: 'Third Description'},
  //     {title: 'Fourth Title', description: 'Fourth Description'},
  //     {title: 'Fifth Title', description: 'Fifth Description'},
  //     {title: 'Sixth Title', description: 'Sixth Description'},
  //     {title: 'Seventh Title', description: 'Seventh Description'}
  //   ]
  // }

  /* ***********************************************************
  * STEP 2
  * `renderRow` function. How each cell/row should be rendered
  * It's our best practice to place a single component here:
  *
  * e.g.
    return <MyCustomCell title={item.title} description={item.description} />
  *************************************************************/
  renderRow ({item}) {
    let label = ''
    // Figuring we can use the 'status' blocks to inform the user
    // about where their photo is backed up
    let localStatus = styles.statusWhite
    let remoteStatus = styles.statusWhite
    if (item.state === 'complete') {
      label = item.hash
      localStatus = styles.statusPink
      remoteStatus = styles.statusBlue
    } else if (item.state === 'error') {
      label = item.error
      localStatus = styles.statusPink
      remoteStatus = styles.statusRed
    } else {
      localStatus = styles.statusPink
      label = item.state
    }

    const onPress = this.onPressIt(item)

    return (
      <Tile
        contentContainerStyle={styles.tileStyle}
        onPress={onPress}
        imageSrc={{uri: item.image.node.image.thumbPath}}>
        <View style={styles.statusCell}>
          <View style={styles.photoStatus}>
            <View style={localStatus} />
            <View style={remoteStatus} />
          </View>
        </View>
      </Tile>
    )
  }

  onPressIt = (item) => {
    return () => {
      const url = 'https://ipfs.textile.io/ipfs/' + item.hash
      Linking.openURL(url)
    }
  }

  /* ***********************************************************
  * STEP 3
  * Consider the configurations we've set below.  Customize them
  * to your liking!  Each with some friendly advice.
  *************************************************************/
  // Render a header?
  // renderHeader = () =>
  //   <Text style={[styles.label, styles.sectionHeader]}> - Header - </Text>

  // Render a footer?
  renderFooter = () => {
    if (this.props.images.items.length != 0) {
      return null
    }

    return (
      <Card
        style={styles.cardStyle}
        image={require('../Images/backgrounds/no-image-yet.png')}>
        <View style={styles.noStatus}>
          <View style={styles.noPhotos}>
            <Text> Just waiting for you to take some photos. </Text>
          </View>
        </View>
      </Card>
    );
  };
  //   <Text style={[styles.label, styles.sectionHeader]}> - Footer - </Text>

  // Show this when data is empty
  // renderEmpty = () =>
  //   <Text style={styles.label}> - Nothing to See Here - </Text>

  // renderSeparator = () =>
  //   <Text style={styles.label}> - ~~~~~ - </Text>

  // The default function if no Key is provided is index
  // an identifiable key is important if you plan on
  // item reordering.  Otherwise index is fine
  keyExtractor = (item, index) => index

  // How many items should be kept im memory as we scroll?
  oneScreensWorth = 10

  openLogs = () => {
    this.props.navigation.navigate("LogView")
  }
  // extraData is for anything that is not indicated in data
  // for instance, if you kept "favorites" in `this.state.favs`
  // pass that in, so changes in favorites will cause a re-render
  // and your renderItem will have access to change depending on state
  // e.g. `extraData`={this.state.favs}

  // Optimize your list if the height of each item can be calculated
  // by supplying a constant height, there is no need to measure each
  // item after it renders.  This can save significant time for lists
  // of a size 100+
  // e.g. itemLayout={(data, index) => (
  //   {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
  // )}

  render () {
    return (
      <ImageBackground
        source={require('../Images/backgrounds/photos-background.png')}
        style={styles.backgroundImage}>
        <View style={styles.container}>
          <FlatList
            contentContainerStyle={styles.listContent}
            data={this.props.images.items}
            renderItem={this.renderRow.bind(this)}
            numColumns={1}
            keyExtractor={this.keyExtractor}
            initialNumToRender={this.oneScreensWorth}
            onEndReachedThreshold={0.5}
            onEndReached={({ distanceFromEnd }) => {
              // This has an issue
              // It would currently load new ones on first load too
              // const lastItem = this.props.images.items[
              //   this.props.images.items.length - 1
              //   ]
              // this.props.getHashesRequest(lastItem.hash, 10)
            }}
            ListFooterComponent={this.renderFooter}
          />
        </View>
        <View style={styles.navigationBar}>
          <TouchableOpacity onPress={this.openLogs}>
            <Evilicon name='exclamation' style={styles.navigationIcon} size={50}/>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    )
  }
}

const mapStateToProps = state => {
  return {
    onboarded: state.textile.onboarded,
    images: {
      items: state.textile && state.textile.images && state.textile.images.items ? state.textile.images.items : []
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getHashesRequest: (offsetId, limit) => { dispatch(Actions.getHashesRequest(offsetId, limit)) },
    addImagesRequest: (images) => { dispatch(Actions.addImagesRequest(images)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TextilePhotos)
