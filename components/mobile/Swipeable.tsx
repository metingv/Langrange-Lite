import { Component } from 'react'
import SwipeableViews from 'react-swipeable-views'

interface SwipeableProps {
  index: number
  onChangeIndex: (x: any) => void
  children: React.ReactNode
}

class Swipeable extends Component<SwipeableProps> {
  componentDidUpdate() {
    // @ts-ignore
    this.swipeableActions.updateHeight()
  }
  render() {
    const { children, index, onChangeIndex } = this.props
    return (
      <SwipeableViews// @ts-ignore
        action={(actions) => {
          // @ts-ignores
          this.swipeableActions = actions
        }}
        enableMouseEvents
        index={index}
        onChangeIndex={onChangeIndex}
        slideStyle={{ overflow: 'inherit' }}
        style={{ overflow: 'hidden' }}
      >
        {children}
      </SwipeableViews>
    )
  }
}

export default Swipeable
