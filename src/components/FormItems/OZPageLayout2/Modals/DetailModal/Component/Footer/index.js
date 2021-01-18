import React from 'react'
import { Tabs } from 'antd'
import _ from 'lodash'
import DocumentTypesMenu from 'containers/Selects/DocumentTypesMenu'
import StyleForm from 'containers/StyleForm'
import Private from './Private'

const { TabPane } = Tabs

const DetailComponentFooter = ({ info, form, initialValue = { text: '' } }) => {
  const { getFieldDecorator, getFieldValue, setFieldsValue } = form

  const register = key => {
    getFieldDecorator(key, { initialValue: _.get(info, key) || initialValue[key] })
  }

  const initial = key => _.get(info, key) || initialValue[key]

  register('text')

  const styleProps = { data: _.get(info, 'style') || {}, field: 'style', form }
  const dataProps = { data: _.get(info, 'data') || '', field: 'data', form }

  function onLoadTmpl(style) {
    setFieldsValue({ style })
  }

  return (
    <Tabs defaultActiveKey="data">
      <TabPane tab="Data" key="data">
        <Private {...dataProps} />
      </TabPane>
      <TabPane tab="Style" key="style">
        <DocumentTypesMenu
          collectionName="StylesData"
          type="component"
          iconType="download"
          label="Load from Style Templates"
          style={{ margin: '0px 0px 10px 30px', width: '300px' }}
          onChange={onLoadTmpl}
        />
        <StyleForm {...styleProps} />
      </TabPane>
    </Tabs>
  )
}

export default DetailComponentFooter
