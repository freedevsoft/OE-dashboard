import React from 'react'
import { getDepthValue } from 'utils'

import GroupingSettingsPresentation from './Inner/presentation'
import GroupingSettingsMajorMinor from './Inner/majorminor'
import GroupingSettingsIcon from './Inner/icon'
import GroupingSettingsNotification from './Inner/notification'

import './index.scss'

const GroupSettings = ({ data, form, field }) => (
  <>
    <GroupingSettingsNotification
      data={getDepthValue(data, 'notification', '')}
      field={`${field}.notification`}
      form={form}
    />
    <GroupingSettingsIcon
      data={getDepthValue(data, 'iconURL')}
      field={`${field}.iconURL`}
      form={form}
    />
    <GroupingSettingsPresentation
      data={getDepthValue(data, 'presentation', {})}
      field={`${field}.presentation`}
      form={form}
    />
    <GroupingSettingsMajorMinor
      data={getDepthValue(data, 'majorMinor', {})}
      field={`${field}.majorMinor`}
      form={form}
    />
  </>
)

export default GroupSettings
