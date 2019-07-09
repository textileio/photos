import React, { Component } from 'react'
import { SafeAreaView, TextInput } from 'react-native'

import Button from '../Components/LargeButton'

// A mapped type helper that takes a type and makes each of its properties optional
type Partial<T> = { [P in keyof T]?: T[P] }

// initialValues: the initial value of the fields
// onSubmit: function to be called when the form is submitted with valid values
// placeholders: the placeholder text for the fields
// valid: a function that returns true if the field values are valid, false otherwise
// buttonText: text to display on the submit button (overrides "Submit")
interface Props<FormFields> {
  initialValues: FormFields
  onSubmit: (values: FormFields) => void
  placeholders?: Partial<FormFields>
  valid?: (values: FormFields) => boolean
  buttonText?: string
}

interface State<FormFields> {
  values: FormFields
}

type Fields = {
  [key: string]: string
}

// A generic modal component. It accepts a generic type, FormFields, which represents
// each field of the form as a string member variable.
export default class Modal<FormFields extends Fields> extends Component<
  Props<FormFields>,
  State<FormFields>
  > {
  constructor(props: Props<FormFields>) {
    super(props)
    this.state = {
      values: props.initialValues
    }
  }

  _buildOnChangeText = (key: keyof FormFields) => {
    return (newValue: string) => {
      this.setState(prevState => {
        return {
          values: {
            ...prevState.values,
            [key]: newValue
          }
        }
      })
    }
  }

  validateThenSubmit = () => {
    if (this.props.valid && this.props.valid(this.state.values)) {
      return
    }
    this.props.onSubmit(this.state.values)
  }

  render() {
    return (
      <SafeAreaView>
        {Object.keys(this.state.values).map(key => (
          <TextInput
            key={key}
            value={this.state.values[key]}
            placeholder={
              this.props.placeholders &&
              (key in this.props.placeholders
                ? this.props.placeholders[key]
                : '')
            }
            onChangeText={this._buildOnChangeText(key)}
          />
        ))}
        <Button
          text={
            this.props.buttonText !== undefined
              ? this.props.buttonText
              : 'Submit'
          }
          onPress={this.validateThenSubmit}
        />
      </SafeAreaView>
    )
  }
}
