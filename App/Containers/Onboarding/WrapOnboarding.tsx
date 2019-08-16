import React from 'react'

// We use generics to handle the onboarding flow
// All onboarding pages must implement the static method isComplete
// isComplete accepts the component's props, and returns whether that
// onboarding page is completed or on.
// We wrap each onboarding page in a HOC (higher-order component) that
// will automatically call isComplete when the component is initialized
// and every time it is updated. If isComplete evaluates to true, it will
// call the callback function passed to the HOC.

// Onboarding pages must implement isComplete, a static method that accepts
// props and returns whether that onboarding page is finished or not.
// This ensures that whether the onboarding page is completed or not is
// reflected in the redux state.

// HOC components accept a callback which is called when isComplete on
// the unwrapped component evaluates to true
export interface WrappedOnboardingProps {
  completed: () => void
}

// withComplete is a HOC that accepts an unwrapped onboarding page
// and connects it to the completed callback function
export const wrapOnboarding = <P extends object>(
  Component: React.ComponentType<P>,
  isComplete: (props: P) => boolean
) =>
  class ComponentWithComplete extends React.Component<
    P & WrappedOnboardingProps
    > {
    // Call isComplete, and if it evaluates to true call the callback
    checkIfCompleted = () => {
      const { completed, ...props } = this.props
      if (isComplete(props as P)) {
        completed()
      }
    }

    // Check if the page is completed upon initialization
    constructor(props: P & WrappedOnboardingProps) {
      super(props)
      this.checkIfCompleted()
    }

    // Check if the page is completed every time its props are updated
    componentDidUpdate() {
      this.checkIfCompleted()
    }

    // Render the component. Extract completed because it is a HOC prop.
    render() {
      const { completed, ...props } = this.props
      return <Component {...props as P} />
    }
  }
