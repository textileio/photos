// @flow
import React from 'react'
import {
  View,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  Platform,
  AppState,
  PushNotificationIOS
} from 'react-native'
import Evilicon from 'react-native-vector-icons/EvilIcons'
import { connect } from 'react-redux'
import BackgroundTask from 'react-native-background-task'
import { getPhoto } from '../Services/PhotoUtils'
import Actions from '../Redux/TextileRedux'
import UploadTask from '../../UploadTaskNativeModule'
import PhotosTask from '../Services/PhotosTask'
import { getFailedImages } from './App'
import HeaderButtons from 'react-navigation-header-buttons'
import * as Progress from 'react-native-progress'
import { Colors } from '../Themes'

// Styles
import styles, {PRODUCT_ITEM_HEIGHT, PRODUCT_ITEM_MARGIN, numColumns} from './Styles/TextilePhotosStyle'

class TextilePhotos extends React.PureComponent {

  constructor() {
    super()
    this.setup()
  }

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    return {
      headerTitle: (
        <Image style={{ width: 90, height: 39, resizeMode: 'contain', alignSelf: 'center' }} source={require('../Images/TextileHeader.png')} />
      ),
      headerRight: (
        <HeaderButtons IconComponent={Evilicon} iconSize={23} color='white'>
          <HeaderButtons.Item title='more' iconName='gear' onPress={params.openLogs} />
        </HeaderButtons>
      )
    }
  }

  componentWillMount () {
    this.props.navigation.setParams({
      openLogs: this.openLogs.bind(this)
    })
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
    AppState.addEventListener('change', this.handleAppStateChange.bind(this))

    this.progressSubscription = UploadTask.uploadTaskEmitter.addListener('UploadTaskProgress', event => {
      console.log('UPLOAD PROGRESS:', event)
      this.props.uploadProgress(event)
    })

    this.completionSubscription = UploadTask.uploadTaskEmitter.addListener('UploadTaskComplete', event => {
      console.log('UPLOAD COMPLETE:', event)
      PushNotificationIOS.presentLocalNotification({
        alertBody: 'upload complete',
        userInfo: {}
      })
      this.props.uploadComplete(event)
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
        PhotosTask(this.props.dispatch, getFailedImages())
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
      await PhotosTask(this.props.dispatch, getFailedImages())
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
    const onPress = this.onPressIt(item)
    let overlay
    if (item.state === 'pending') {
      overlay = <Progress.Pie indeterminate size={20} color={Colors.brandPink} />
    } else if (item.state === 'processing') {
      overlay = <Progress.Pie progress={item.progress} size={20} color={Colors.brandPink} />
    } else if (item.state === 'error') {
      overlay = <Evilicon name='exclamation' size={30} color={Colors.brandRed} style={{backgroundColor: Colors.clear}} />
    }
    return (
      <View style={styles.item}>
        <View style={styles.itemBackgroundContainer}>
          <Image
            source={{uri: item.image.node.image.thumbPath}}
            resizeMode={'cover'}
            style={styles.itemImage}
          />
        </View>
        <View style={styles.itemOverlay}>
          {overlay}
        </View>
      </View>
    )
  }

  onPressIt = (item) => {
    return () => {
      const url = 'https://ipfs.textile.io/ipfs/' + item.hash
      Linking.openURL(url)
    }
  }

  _getItemLayout = (data, index) => {
    const productHeight = PRODUCT_ITEM_HEIGHT + PRODUCT_ITEM_MARGIN
    return {
      length: productHeight,
      offset: productHeight * index,
      index
    }
  }

  // The default function if no Key is provided is index
  // an identifiable key is important if you plan on
  // item reordering.  Otherwise index is fine
  keyExtractor = (item, index) => index

  // How many items should be kept im memory as we scroll?
  oneScreensWorth = 10

  openLogs = () => {
    this.props.navigation.navigate('LogScreen')
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
      <View style={styles.container}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0.2
          }}
        >
          <Image style={{
            flex: 1,
            resizeMode: 'center',
            position: 'absolute',
            bottom: 0
          }} source={require('../Images/backgrounds/TextileBackground.png')} />
        </View>
        {
          this.props.images.items.length ? (
            <FlatList
              style={styles.listContainer}
              data={this.props.images.items}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderRow.bind(this)}
              getItemLayout={this._getItemLayout}
              numColumns={numColumns}
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
            />
          ) : (
            <View style={styles.emptyListStyle}>
              <Text style={styles.noPhotos}>Any new photos you take will be displayed here and synced to Textile.</Text>
            </View>
          )
        }
      </View>
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
    dispatch: dispatch,
    uploadComplete: event => { dispatch(Actions.imageUploadComplete(event)) },
    uploadProgress: event => { dispatch(Actions.imageUploadProgress(event)) },
    getHashesRequest: (offsetId, limit) => { dispatch(Actions.getHashesRequest(offsetId, limit)) },
    addImagesRequest: images => { dispatch(Actions.addImagesRequest(images)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TextilePhotos)
