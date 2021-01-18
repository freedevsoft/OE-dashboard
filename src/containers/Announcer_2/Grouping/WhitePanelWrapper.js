import React from 'react'
import { notification } from 'antd'
import { groupingQuery } from 'utils/queries'
import { updateGroupingMuation } from 'utils/mutations'
import { useQuery, useMutation } from '@apollo/react-hooks'
import objectAssignDeep from 'object-assign-deep'
import _ from 'lodash'
import GroupWhiteForm from './WhitePanel'

const openNotificationWithIcon = (type, message, description) => {
  notification[type]({
    message,
    description,
    placement: 'bottomRight',
  })
}

const WhitePanelWrapper = ({ groupId, ...rest }) => {
  if (!groupId) return ''
  const { loading, error, data } = useQuery(groupingQuery, {
    variables: {
      ids: [groupId],
    },
  })

  const [updateGroup, { loading: updating, error: updateError }] = useMutation(updateGroupingMuation, {
    onCompleted: ({ updateGrouping }) => {
      console.log(updateGrouping)
    },
  })

  if (loading) {
    // Todo: Show loading status of panel
    return ''
  }

  if (error) {
    // Todo: Show error status of panel
    return ''
  }
  const { grouping } = data

  if (!grouping || !grouping[0]) {
    // Todo: Show error status of panel
    return ''
  }

  const [group] = grouping

  const onUpdateGroup = values => {
    const modified = objectAssignDeep(group, values)
    _.set(modified, 'data.ClientsData', values?.data?.ClientsData)
    _.set(modified, 'data.cfg', values?.data?.cfg)
    updateGroup({
      variables: {
        ...modified,
        list: modified.list
          ? modified.list.map(item => {
            const { __typename, ...rest } = item

            return rest
          })
          : [],
        majorMinor: {
          major: modified.majorMinor ? modified.majorMinor.major : 0,
          minor: modified.majorMinor ? modified.majorMinor.minor : 0,
        },
        schedule: {
          recurrenceType: 'none',
          ...(modified.schedule ? modified.schedule : {}),
          __typename: undefined,
          status: undefined,
        },
        presentation: {
          ...(modified.presentation ? modified.presentation : {}),
          __typename: undefined,
        },
        presentationMode: {
          ...(modified.presentationMode ? modified.presentationMode : {}),
          __typename: undefined,
        },
        availability: {
          ...(modified.availability ? modified.availability : { state: 'off' }),
          state: modified?.availability?.state || '',
          __typename: undefined,
        },
      },
    })
      .then(() => {
        openNotificationWithIcon('success', 'Group', 'Updated successfully!')
      })
      .catch(() => {
        openNotificationWithIcon('warning', 'Group', 'Failed to update')
      })
  }

  const onSave = (e, form) => {
    e.preventDefault()

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const major = group?.majorMinor?.major
        const minor = group?.majorMinor?.minor

        onUpdateGroup({
          ...values.comp,
          majorMinor: {
            major: (major || 0) + values?.comp?.majorMinor?.increaseMajor === true,
            minor: (minor || 0) + values?.comp?.majorMinor?.increaseMinor === true,
          },
        })
      }
    })
  }
  return <GroupWhiteForm {...rest} comp={group} currentKey={group._id} onSaveFunc={onSave} />
}

export default WhitePanelWrapper
