import React from 'react'
import { Keyboard, EmitterSubscription, View, ViewStyle, LayoutAnimation } from 'react-native'

interface Props {
  style?: ViewStyle
}

interface State {
  height: number
}

export default class KeyboardResponsiveContainer extends React.Component<Props, State> {

  public initialized = false
  public bottomViewY = 0
  public bottomView?: View
  public keyboardWillShowSub?: EmitterSubscription
  public keyboardWillHideSub?: EmitterSubscription
  public keyboardWillChangeFrameSub?: EmitterSubscription

  constructor(props: Props) {
    super(props)
    this.state = {
      height: 0
    }
  }

  public keyboardWillChangeFrame = (event: any) => {
    LayoutAnimation.configureNext({
      duration: event.duration,
      update: {
        // @ts-ignore
        type: LayoutAnimation.Types[event.easing]
      }
    })
    this.setState({
        height: this.bottomViewY - event.endCoordinates.screenY
    })
  }

  public keyboardWillAppear = (event: any) => {
    LayoutAnimation.configureNext({
      duration: event.duration,
      update: {
        // @ts-ignore
        type: LayoutAnimation.Types[event.easing]
      }
    })
    this.setState({
        height: this.bottomViewY - event.endCoordinates.screenY
    })
  }

  public keyboardWillHide = (event: any) => {
    LayoutAnimation.configureNext({
      duration: event.duration,
      update: {
        // @ts-ignore
        type: LayoutAnimation.Types[event.easing]
      }
    })
    this.setState({
        height: 0
    })
  }

  public onLayout = (event: any) => {
    if (!this.initialized && this.bottomView) {
      this.initialized = true
      this.bottomView.measure((x, y, width, height, pageX, pageY) => {
        this.bottomViewY = pageY
      })
    }
  }

  public componentDidMount() {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillAppear)
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide)
    // this.keyboardWillChangeFrameSub = Keyboard.addListener('keyboardWillChangeFrame', this.keyboardWillChangeFrame)
  }

  public componentWillUnmount() {
    if (this.keyboardWillShowSub) {
      this.keyboardWillShowSub.remove()
    }
    if (this.keyboardWillHideSub) {
      this.keyboardWillHideSub.remove()
    }
    if (this.keyboardWillChangeFrameSub) {
      this.keyboardWillChangeFrameSub.remove()
    }
  }

  public render() {
    const { style } = this.props
    return (
      <View style={{ flex: 1 }}>
        <View style={[style, { flex: 1 }]} >
          {this.props.children}
        </View>
        <View
          onLayout={this.onLayout}
          ref={(view) => { this.bottomView = view ? view : undefined }}
          style={{ position: 'relative', bottom: 0, width: '100%', height: this.state.height, backgroundColor: style ? style.backgroundColor : 'transparent' }}
        />
      </View>
    )
  }
}
