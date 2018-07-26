import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Text, View } from 'react-native'
import { Link, withRouter } from 'react-router-native'

import { Button, Footer, Input, LinkText, LogoWithText } from '../../components/index'
import commonStyles from '../commonStyles'
import styles from './styles'

class SignUp extends Component {
    static propTypes = {
      history: PropTypes.shape({
        push: PropTypes.func.isRequired
      }).isRequired
    };

    constructor (props) {
      super(props)
      this.state = {
        email: '',
        name: '',
        username: '',
        password: ''
      }
    }

    render () {
      const { history } = this.props
      const { email, name, username, password } = this.state
      return (
        <Fragment>
          <View style={commonStyles.container}>
            <LogoWithText text='Sign up to start using the app with your friends.' />
            <View style={styles.formContainer}>
              <Input
                value={name}
                label="Name"
                keyboardType="default"
                onChangeText={(text) => this.setState(() => ({name: text}))}
              />
              <Input
                value={email}
                label="Email"
                keyboardType="default"
                onChangeText={(text) => this.setState(() => ({email: text}))}
              />
              <Input
                value={username}
                label="Username"
                keyboardType="default"
                onChangeText={(text) => this.setState(() => ({username: text}))}
              />
              <Input
                value={password}
                label="Password"
                keyboardType="default"
                secureTextEntry
                onChangeText={(text) => this.setState(() => ({password: text}))}
              />
              <View style={styles.bottomLine}>
                <Text style={styles.bottomLineLink}>By signing up you agree to our <LinkText>Terms and Conditions</LinkText></Text>
                <Button
                  primary
                  title="Create account"
                  disabled={!name || !email || !username || !password}
                  onPress={() => history.push('/signIn')}
                />
              </View>
            </View>
          </View>
          <Footer>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link to={{pathname: '/signIn'}}>
              <LinkText style={[styles.footerLink, styles.linkColor]}>Sign In</LinkText>
            </Link>
          </Footer>
        </Fragment>
      )
    }
}

export default withRouter(SignUp)
