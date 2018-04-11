// @flow
import React from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  Platform,
  ImageBackground,
  AppState,
  PushNotificationIOS
} from 'react-native'
import Evilicon from 'react-native-vector-icons/EvilIcons'
import { connect } from 'react-redux'
import { Card, Tile } from 'react-native-elements'
import BackgroundTask from 'react-native-background-task'
import { getPhoto } from '../Services/PhotoUtils'
import Actions from '../Redux/TextileRedux'
import UploadTask from '../../UploadTaskNativeModule'
import PhotosTask from '../Services/PhotosTask'
import { getFailedImages } from './App'

// Styles
import styles from './Styles/TextilePhotosStyle'

class TextilePhotos extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      limit: 10
    }
    AppState.addEventListener('change', this.handleAppStateChange)
    this.setup()
  }

  // TODO: This logic should be moved deeper into the stack
  _handleOpenURLEvent (event) {
    this._handleOpenURL(event.url)
  }
  // TODO: This logic should be moved deeper into the stack
  _handleOpenURL (url) {
    const data = url.replace(/.*?:\/\//g, '')
    this.props.navigation.navigate('PairingView', {data: data})
  }

  componentDidMount () {
    BackgroundTask.schedule()
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

  componentWillUnmount () {
    this.progressSubscription.remove()
    this.completionSubscription.remove()
  }

  async setup () {
    this.progressSubscription = UploadTask.uploadTaskEmitter.addListener('UploadTaskProgress', event => {
      console.log('UPLOAD PROGRESS:', event)
      this.props.store.dispatch(Actions.imageUploadProgress(event))
    })

    this.completionSubscription = UploadTask.uploadTaskEmitter.addListener('UploadTaskComplete', event => {
      console.log('UPLOAD COMPLETE:', event)
      PushNotificationIOS.presentLocalNotification({
        alertBody: 'upload complete',
        userInfo: {}
      })
      this.props.store.dispatch(Actions.imageUploadComplete(event))
    })

    await PushNotificationIOS.requestPermissions()
    await getPhoto() // Trigger photos permission prompt

    navigator.geolocation.watchPosition(
      () => {
        console.log('got a new position')
        PushNotificationIOS.presentLocalNotification({
          alertBody: 'location update',
          userInfo: {}
        })
        PhotosTask(this.props.store.dispatch, getFailedImages())
      },
      error => {
        console.log('Got a location error', error)
      },
      { useSignificantChanges: true }
    )
  }

  async handleAppStateChange (nextAppState) {
    if (nextAppState.match(/^active/)) {
      console.log('got a foreground event')
      await PhotosTask(this.props.store.dispatch, getFailedImages())
    }
  }

  /* ***********************************************************
  * `renderRow` function. How each cell/row should be rendered
  * It's our best practice to place a single component here:
  *
  * e.g.
    return <MyCustomCell title={item.title} description={item.description} />
  *************************************************************/
  renderRow ({item}) {
    // let label = ''
    // Figuring we can use the 'status' blocks to inform the user
    // about where their photo is backed up
    let localStatus = styles.statusWhite
    let remoteStatus = styles.statusWhite
    if (item.state === 'complete') {
      // label = item.hash
      localStatus = styles.statusPink
      remoteStatus = styles.statusBlue
    } else if (item.state === 'error') {
      // label = item.error.message
      localStatus = styles.statusPink
      remoteStatus = styles.statusRed
    // } else if (item.state === 'processing') {
      // label = item.progress
    } else {
      localStatus = styles.statusPink
      // label = item.state
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
  * Consider the configurations we've set below.  Customize them
  * to your liking!  Each with some friendly advice.
  *************************************************************/
  // Render a header?
  // renderHeader = () =>
  //   <Text style={[styles.label, styles.sectionHeader]}> - Header - </Text>

  // Render a footer?
  renderFooter = () => {
    if (this.props.images.items.length !== 0) {
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
    )
  }

  // The default function if no Key is provided is index
  // an identifiable key is important if you plan on
  // item reordering.  Otherwise index is fine
  keyExtractor = (item, index) => index

  // How many items should be kept im memory as we scroll?
  oneScreensWorth = 10

  openLogs = () => {
    this.props.navigation.navigate('LogView')
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
            <Evilicon name='exclamation' style={styles.navigationIcon} size={50} />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    )
  }
}

const mapStateToProps = state => {
  return {
    images: {
      items: state.textile && state.textile.images && state.textile.images.items ? state.textile.images.items : []
    },
    store: state.store
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getHashesRequest: (offsetId, limit) => { dispatch(Actions.getHashesRequest(offsetId, limit)) },
    addImagesRequest: (images) => { dispatch(Actions.addImagesRequest(images)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TextilePhotos)
