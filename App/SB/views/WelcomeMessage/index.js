import React from 'react'
import { Text, View } from 'react-native'

import { Button } from '../../components/index'

const WelcomeMessage = () => (
  <View style={{ paddingTop: 30, alignItems: 'center' }}>
    <Text style={{ marginLeft: 10, paddingBottom: 30 }}>
            Before starting using Textile you have to choose which photos you want to sync.
    </Text>
    <Button primary title='Select photos' />
  </View>
)

export default WelcomeMessage
