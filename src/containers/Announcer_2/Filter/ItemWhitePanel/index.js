import React from 'react'
import PropTypes from 'prop-types'
import {
  Icon, Button, Form, Tabs,
} from 'antd'
import GrayPanel from 'components/GrayPanel/GrayPanel'
import ControlBtnsGroup from 'components/ControlBtnsGroup/ControlBtnsGroup'

import ComponentTypeItem from './Type/Item'
import './index.scss'

const { TabPane } = Tabs
class MyForm extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.currentKey != nextProps.currentKey) {
      nextProps.form.resetFields()
    }
  }

  render() {
    const { style, comp, form } = this.props

    return (
      <GrayPanel title="Rule" {...style}>
        <ControlBtnsGroup>
          <>
            <Button type="primary" style={{ width: 'auto' }} onClick={e => this.props.onSaveFunc(e, this.props.form)}>
              Save
              <Icon type="save" />
            </Button>
            <Button style={{ width: 'auto', background: 'transparent' }}>
              Preview
              <Icon type="eye" />
            </Button>
          </>
        </ControlBtnsGroup>
        <Form className="filter-rule-form">
          <Tabs defaultActiveKey="1">
            <TabPane tab="Details" key="1">
              <ComponentTypeItem data={comp.data} field="comp.data" form={form} />
            </TabPane>
            {/* <TabPane tab="Details" key="2">
                            <ComponentDataItem data={comp.data} field="comp.data" form={form} />
                        </TabPane> */}
          </Tabs>
        </Form>
      </GrayPanel>
    )
  }
}
MyForm.propTypes = {
  style: PropTypes.object,
}

MyForm.defaultProps = {
  style: {
    width: 900,
    minWidth: 900,
    // bgcolor: "#242D3C",
    // fgcolor: "white"
    bgcolor: 'white',
    fgcolor: 'black',
  },
}
const RuleWhitePanel = Form.create()(MyForm)
export default RuleWhitePanel
