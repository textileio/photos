import React, { Component } from 'react'
import { FlatList, View, Text, ViewStyle, Dimensions } from 'react-native'
import lbApi, {
  DiscoveredCafe,
  DiscoveredCafes
} from '../Services/textile-lb-api'

import CafeItem from './CafeItem'
import Separator from './Separator'

import { color } from '../styles'

interface Cafe {
  name: string
  peerId: string
}

const Cafes = [
  {
    name: 'US-West-1a',
    peerId: '12D3KooWGBW3LfzypK3zgV4QxdPyUm3aEuwBDMKRRpCPm9FrJvar'
  },
  {
    name: 'US-West-1c',
    peerId: '12D3KooWQue2dSRqnZTVvikoxorZQ5Qyyug3hV65rYnWYpYsNMRE'
  },
  {
    name: 'US-East-2a',
    peerId: '12D3KooWERmHT6g4YkrPBTmhfDLjfi8b662vFCfvBXqzcdkPGQn1'
  },
  {
    name: 'US-East-2b',
    peerId: '12D3KooWLh9Gd4C3knv4XqCyCuaNddfEoSLXgekVJzRyC5vsjv5d'
  },
  {
    name: 'EU-West-3a',
    peerId: '12D3KooWDhSfXZCBVAK6SNQu7h6mfGCBJtjMS44PW5YA5YCjVmjB'
  },
  {
    name: 'EU-West-3b',
    peerId: '12D3KooWBCZEDkZ2VxdNYKLLUACWbXMvW9SpVbbvoFR9CtH4qJv9'
  },
  {
    name: 'AP-Southeast-1a',
    peerId: '12D3KooWQ5MR9Ugz9HkVU3fYFbiWbQR4jxKJB66JoSY7nP5ShsqQ'
  },
  {
    name: 'AP-Southeast-1b',
    peerId: '12D3KooWQ5MR9Ugz9HkVU3fYFbiWbQR4jxKJB66JoSY7nP5ShsqQ'
  }
]

interface OwnProps {
  selected: string
  onSelect: (peerId: string) => void
  alreadyRegistered?: ReadonlyArray<string>
}

type Props = OwnProps

// Todo: move this logic into a saga and pass recommended cafes via props
// so that this can become a PureComponent
interface State {
  recommended: DiscoveredCafes
}

export default class CafesList extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      recommended: {}
    }
  }

  render() {
    // Filter cafes as not to include those the user is already registered with
    // not used during onboarding
    const filteredCafes = Cafes.filter(cafe => {
      if (this.props.alreadyRegistered) {
        if (this.props.alreadyRegistered.indexOf(cafe.peerId) !== -1) {
          return false
        }
      }
      return true
    })
    return (
      <FlatList
        data={filteredCafes}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        ItemSeparatorComponent={() => <Separator />}
      />
    )
  }

  componentDidMount() {
    lbApi('https://gateway.textile.cafe')
      .discoveredCafes()
      .then(response => {
        this.setState({
          recommended: response
        })
      })
  }

  isRecommended(peerId: string) {
    if (this.state.recommended.primary) {
      if (peerId === this.state.recommended.primary.peer) {
        return true
      }
    }
    if (this.state.recommended.secondary) {
      if (peerId === this.state.recommended.secondary.peer) {
        return true
      }
    }
    return false
  }

  _keyExtractor = (item: Cafe) => item.peerId

  _renderItem = ({ item }: { item: Cafe }) => (
    <CafeItem
      name={item.name}
      peerId={item.peerId}
      selected={item.peerId === this.props.selected}
      recommended={this.isRecommended(item.peerId)}
      onPressItem={this.props.onSelect}
    />
  )
}
