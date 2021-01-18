const CellType = {
  None: undefined,
  GroupType: 'groupType',
  Group: 'group',
  Component: 'component',
}

const CellComponentType = {
  None: 'No Layer',
  Streaming: 'Streaming',
  VideoFile: 'VideoFile',
  Body: 'Body',
  ImageList: 'ImageList',
  VideoList: 'VideoList*',
  Desc: 'Desc',
  Map: 'Map',
  Contact: 'Contact',
  Schedule: 'Schedule*',
  Source: 'Source',
  Quiz: 'Quiz*',
  Table: 'Table*',
  Reminders: 'Reminders*',
  SMS: 'SMS*',
  Email: 'Email*',
  Text: 'Text*',
  Plugin: 'Plugin',
  Time: 'Time',
  List: 'List',
  HourglassTimer: 'HourglassTimer',
  Menu: 'Menu',
  Exit: 'Exit',
  Notification: 'Notification',
  Timer: 'Timer',
  Divider: 'Divider',
  MenuLayer: 'Menu-Layer',
  MenuTime: 'Menu-Time',
  MenuLogo: 'Menu-Logo',
  MenuEvents: 'Menu-Events',
  URL: 'URL',
  MenuDivider: 'Menu-Divider',
  WebLinks: 'WebLinks',
  NavList: 'NavList',
  AltContent: 'AltContent',
  Signin: 'Signin',
  TxList: 'TxList',
}

export { CellType, CellComponentType }
