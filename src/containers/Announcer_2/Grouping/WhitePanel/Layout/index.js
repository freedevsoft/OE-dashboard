import React from 'react'
import OZSelectItem from 'components/FormItems/OZSelectItem'
import OZCheckbox from 'components/FormItems/OZCheckbox'
import { inlineStyle } from 'utils'
import _ from 'lodash'

const GroupLayout = ({ data, form: { getFieldDecorator, getFieldValue }, field }) => {
  getFieldDecorator(`${field}.layout.type`, { initialValue: _.get(data, 'layout.type') || 'ArticlesStack' })

  const type = getFieldValue(`${field}.layout.type`)

  return (
    <>
      <OZSelectItem
        label="Type"
        field={`${field}.layout.type`}
        initialValue={_.get(data, 'layout.type') || 'ArticlesStack'}
        getFieldDecorator={getFieldDecorator}
        {...inlineStyle}
        required={false}
        combines={[
          { value: 'ImageList', label: 'ImageList' },
          { value: 'ArticlesCarousel', label: 'ArticlesCarousel' },
          { value: 'ArticlesStack', label: 'ArticlesStack' },
          { value: 'ArticlesGrid', label: 'ArticlesGrid' },
          { value: 'ArticleText', label: 'ArticleText' },
          { value: 'ArticleThumbnail', label: 'ArticleThumbnail' },
          { value: 'group_ad_300_250', label: 'Ad Component' },
          { value: 'Video', label: 'Video' },
        ]}
      />
      {type === 'Video' && (
        <>
          <OZCheckbox label="Auto-Play" field={`${field}.layout.autoPlay`} initialValue={_.get(data, 'layout.autoStart') || false} itemStyle={inlineStyle} getFieldDecorator={getFieldDecorator} />
          <OZCheckbox label="Auto-Loop" field={`${field}.layout.autoLoop`} initialValue={_.get(data, 'layout.autoLoop') || false} itemStyle={inlineStyle} getFieldDecorator={getFieldDecorator} />
        </>
      )}
    </>
  )
}

export default GroupLayout
