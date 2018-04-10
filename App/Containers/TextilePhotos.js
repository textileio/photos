// @flow
import React from 'react'
import {
  View,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  ImageBackground,
  Dimensions
} from 'react-native'
import Evilicon from 'react-native-vector-icons/EvilIcons'
import { connect } from 'react-redux'
import Actions from '../Redux/TextileRedux'
import { Card, Tile } from 'react-native-elements'
import HeaderButtons from 'react-navigation-header-buttons'
import * as Progress from 'react-native-progress'
import { Colors } from '../Themes'

// More info here: https://facebook.github.io/react-native/docs/flatlist.html

// Styles
import styles, {PRODUCT_ITEM_HEIGHT, PRODUCT_ITEM_MARGIN, numColumns} from './Styles/TextilePhotosStyle'

class TextilePhotos extends React.PureComponent {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    return {
      headerRight: (
        <HeaderButtons IconComponent={Evilicon} iconSize={30} color='white'>
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

  componentDidMount() {
    if (!this.props.onboarded) {
      // this.props.navigation.navigate("OnboardingSecurity")
    }
  }

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

  /* ***********************************************************
  * STEP 3
  * Consider the configurations we've set below.  Customize them
  * to your liking!  Each with some friendly advice.
  *************************************************************/
  // Render a header?
  // renderHeader = () =>
  //   <Text style={[styles.label, styles.sectionHeader]}> - Header - </Text>

  // Render a footer?
  // renderFooter = () =>
  //   <Text style={[styles.label, styles.sectionHeader]}> - Footer - </Text>

  // Show this when data is empty
  renderEmpty = () =>
    <Text style={styles.label}>Any new photos you take will be displayed here and synced to Textile.</Text>

  // renderSeparator = () =>
  //   <Text style={styles.label}> - ~~~~~ - </Text>

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
        <FlatList
          ListEmptyComponent={this.renderEmpty}
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
      </View>
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
