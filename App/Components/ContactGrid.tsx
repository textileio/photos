import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity, ListRenderItemInfo
} from 'react-native'
import { NavigationScreenProps } from 'react-navigation'

import Avatar from './Avatar'
import ContactModal from './ContactModal'
import InviteContactModal from './InviteContactModal'

import { RootAction } from '../Redux/Types'
import ProcessingImagesActions from '../Redux/ProcessingImagesRedux'
import UIActions from '../Redux/UIRedux'

import { ContactInfo } from '../NativeModules/Textile'

// Styles
import styles, { PRODUCT_ITEM_HEIGHT, PRODUCT_ITEM_MARGIN, numColumns } from './Styles/ContactGridStyles'

interface DispatchProps {
  cancelShare: (uuid: string) => void
  navigateToThread: (id: string, name: string) => void
  retryShare: (uuid: string) => void
}

interface OwnProps {
  contacts: {[key: string]: ContactInfo}
}

class ContactGrid extends React.Component<OwnProps & DispatchProps & NavigationScreenProps<{}>> {
  state = {
    contactCard: false,
    selectedContact: '',
    selectedUsername: '',
    selectedAvatar: undefined,
    showInviteContactModal: false
  }

  oneScreensWorth = 40

  selectContact (contact: ContactInfo) {
    return () => {
      this.setState({
        selectedContact: contact.id,
        selectedUsername: contact.username,
        selectedAvatar: contact.avatar,
        contactCard: true
      })
    }
  }

  closeModal () {
    return () => {
      this.setState({contactCard: false})
    }
  }

  navigateToThread () {
    return (id: string, name: string) => {
      this.setState({contactCard: false})
      this.props.navigateToThread(id, name)
    }
  }

  renderInvite () {
    const dimension = PRODUCT_ITEM_HEIGHT * 0.5
    return (
      <TouchableOpacity
        style={[styles.item, {width: PRODUCT_ITEM_HEIGHT, height: PRODUCT_ITEM_HEIGHT}]}
        onPress={this.inviteContactRequest()}
        activeOpacity={0.95}
      >
        <Avatar style={{ width: dimension, height: dimension }} />
        <Text style={styles.username}>New Invite</Text>
      </TouchableOpacity>
    )
  }

  renderRow (row: ListRenderItemInfo<ContactInfo>) {
    const { item } = row
    const dimension = PRODUCT_ITEM_HEIGHT * 0.5
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={this.selectContact(item)}
        activeOpacity={0.95}
      >
        <Avatar style={{ width: dimension, height: dimension }} target={item.avatar} />
        <Text style={styles.username}>{item.username}</Text>
      </TouchableOpacity>
    )
  }

  _getItemLayout = (length: any, index: number) => {
    const productHeight = PRODUCT_ITEM_HEIGHT + PRODUCT_ITEM_MARGIN
    return {
      length: productHeight,
      offset: productHeight * index,
      index
    }
  }

  cancelInviteContact () {
    return () => {
      this.setState({showInviteContactModal: false})
    }
  }

  inviteContactRequest () {
    return () => {
      this.setState({showInviteContactModal: true})
    }
  }

  // The default function if no Key is provided is index
  // an identifiable key is important if you plan on
  // item reordering.  Otherwise index is fine
  keyExtractor = (item: ContactInfo) => item.id

  render () {
    const ids: string[] = Object.keys(this.props.contacts).sort()
    const contacts: ContactInfo[] = ids.map((id) => {
      return this.props.contacts[id]
    })
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.listContainer}
          data={contacts}
          keyExtractor={this.keyExtractor}
          /* tslint:disable-next-line */
          renderItem={this.renderRow.bind(this)}
          getItemLayout={this._getItemLayout}
          numColumns={numColumns}
          windowSize={this.oneScreensWorth}
          initialNumToRender={this.oneScreensWorth}
          onEndReachedThreshold={0.55}
        />
        <ContactModal
          isVisible={this.state.contactCard}
          peerId={this.state.selectedContact}
          username={this.state.selectedUsername}
          avatar={this.state.selectedAvatar}
          navigateToThread={this.navigateToThread()}
          close={this.closeModal()}
        />
        <InviteContactModal
          isVisible={this.state.showInviteContactModal}
          cancel={this.cancelInviteContact()}
        />
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  return {
    retryShare: (uuid: string) => { dispatch(ProcessingImagesActions.retry(uuid)) },
    cancelShare: (uuid: string) => { dispatch(ProcessingImagesActions.cancelRequest(uuid)) },
    navigateToThread: (id: string, name: string) => {
      dispatch(UIActions.navigateToThreadRequest(id, name))
    }
  }
}

export default connect(undefined, mapDispatchToProps)(ContactGrid)
