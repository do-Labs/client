// @flow
import * as React from 'react'
import {Avatar, Box2, FloatingMenu, Icon, Text} from '../../../../../common-adapters/'
import {collapseStyles, globalColors, globalMargins, isMobile, platformStyles} from '../../../../../styles'
import {formatTimeForPopup, formatTimeForRevoked, secondsToDHMS} from '../../../../../util/timestamp'
import {PopupHeaderText} from '../../../../../common-adapters/popup-menu'
import type {DeviceType} from '../../../../../constants/types/devices'
import type {Position} from '../../../../../common-adapters/relative-popup-hoc'

type Props = {
  attachTo: ?React.Component<*, *>,
  author: string,
  deviceName: string,
  deviceRevokedAt: ?number,
  deviceType: DeviceType,
  explodesAt: number,
  onEdit: null | (() => void),
  onExplodeNow: null | (() => void),
  onHidden: () => void,
  position: Position,
  style?: Object,
  timestamp: number,
  visible: boolean,
  yourMessage: boolean,
}

type State = {
  secondsLeft: number,
}

class ExplodingPopupHeader extends React.Component<Props> {
  state: State = {
    secondsLeft: 0,
  }

  constructor() {
    super()
    this.timer = null
  }

  componentWillMount() {
    this.timer = setInterval(() => this.tick(), 1000)
    this.tick()
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  tick() {
    this.setState({
      secondsLeft: this.props.explodesAt - Math.floor(Date.now() / 1000),
    })
  }

  render() {
    const {author, deviceName, deviceRevokedAt, timestamp, yourMessage} = this.props
    const whoRevoked = yourMessage ? 'You' : author
    return (
      <Box2 direction="vertical" fullWidth={true} style={{alignItems: 'center'}}>
        <Icon
          style={{marginBottom: globalMargins.tiny}}
          type={isMobile ? 'icon-fancy-bomb-129-96' : 'icon-fancy-bomb-86-64'}
        />
        <Box2 direction="horizontal">
          <Text type="BodySmall" style={{color: globalColors.black}}>
            EXPLODING MESSAGE
          </Text>
        </Box2>
        <Box2 direction="horizontal">
          <Text type="BodySmall" style={{color: globalColors.black_40}}>
            by
          </Text>
          <Avatar style={styleAvatar} username={author} size={12} />
          <Text type="BodySmallItalic" style={{color: globalColors.black_60}}>
            {author}
          </Text>
        </Box2>
        <Box2 direction="horizontal">
          <Text type="BodySmall" style={{color: globalColors.black_40}}>
            using device&nbsp;{deviceName}
          </Text>
        </Box2>
        <Box2 direction="horizontal">
          <Text type="BodySmall" style={{color: globalColors.black_40}}>
            {formatTimeForPopup(timestamp)}
          </Text>
        </Box2>
        {deviceRevokedAt && (
          <PopupHeaderText
            color={globalColors.white}
            backgroundColor={globalColors.blue}
            style={styleRevokedAt}
          >
            {whoRevoked} revoked this device on {formatTimeForRevoked(deviceRevokedAt)}.
          </PopupHeaderText>
        )}
        <Box2
          direction="vertical"
          gap="xsmall"
          fullWidth={true}
          gapEnd={true}
          gapStart={true}
          style={{
            backgroundColor: this.state.secondsLeft < oneHourInSecs ? globalColors.red : globalColors.black,
            marginTop: globalMargins.tiny,
          }}
        >
          <Text style={{color: globalColors.white, textAlign: 'center'}} type="BodySemibold">
            {secondsToDHMS(this.state.secondsLeft)}
          </Text>
        </Box2>
      </Box2>
    )
  }
}

const ExplodingPopupMenu = (props: Props) => {
  const items = [
    {disabled: !props.onEdit, onClick: props.onEdit, title: 'Edit'},
    ...(props.yourMessage
      ? [
          {
            danger: true,
            disabled: !props.onExplodeNow,
            onClick: props.onExplodeNow,
            title: 'Explode now',
          },
        ]
      : []),
  ]

  const header = {
    title: 'header',
    view: (
      <ExplodingPopupHeader
        author={props.author}
        deviceName={props.deviceName}
        deviceRevokedAt={props.deviceRevokedAt}
        deviceType={props.deviceType}
        explodesAt={props.explodesAt}
        timestamp={props.timestamp}
        yourMessage={props.yourMessage}
      />
    ),
  }
  return (
    <FloatingMenu
      attachTo={props.attachTo}
      closeOnSelect={true}
      header={header}
      items={items}
      onHidden={props.onHidden}
      position={props.position}
      style={collapseStyles([stylePopup, props.style])}
      visible={props.visible}
    />
  )
}

const oneHourInSecs = 60 * 60

const stylePopup = platformStyles({
  common: {
    overflow: 'visible',
  },
  isElectron: {
    width: 196,
  },
  isMobile: {
    width: '100%',
  },
})

const styleAvatar = {
  marginLeft: globalMargins.tiny,
  marginRight: globalMargins.xtiny,
}

const styleRevokedAt = {
  borderBottomLeftRadius: 3,
  borderBottomRightRadius: 3,
  marginBottom: -globalMargins.small,
  marginTop: globalMargins.small,
  width: '100%',
}

export default ExplodingPopupMenu