import React, { Component } from 'react'
import { Button, Row, Col, Form, Icon, InputNumber } from 'antd'
import _ from 'lodash'
import objectAssignDeep from 'object-assign-deep'
import CellSelect from './CellSelect'
import AddModal from './Modals/AddModal'
import DetailModal from './Modals/DetailModal'
import { CellType } from './utils'
import './index.scss'

class OZPageLayout extends Component {
  static defaultProps = {
    extra: '',
    label: '',
    required: true,
  }

  state = {
    showModal: false,
    modeModal: 'add',
    current: -1,

    detailRow: 0,
    detailCol: 0,
    detail: {},
    showDetailModal: false,
  }

  remove = (k, keysField) => {
    const { getFieldValue, setFieldsValue } = this.props
    const keys = getFieldValue(keysField)

    keys.splice(k, 1)

    setFieldsValue({
      [keysField]: keys,
    })
  }

  add = (keysField, row) => {
    const { getFieldValue, setFieldsValue } = this.props
    const keys = getFieldValue(keysField)
    const nextKeys = keys.concat(row)
    setFieldsValue({ [keysField]: nextKeys })
  }

  update = (keysField, index, row) => {
    const { getFieldValue, setFieldsValue } = this.props
    const keys = getFieldValue(keysField)
    setFieldsValue({ [keysField]: [...keys.slice(0, index), row, ...keys.slice(index + 1)] })
  }

  swap = (keysField, index) => {
    const { getFieldValue, setFieldsValue } = this.props
    const keys = getFieldValue(keysField)
    setFieldsValue({ [keysField]: [...keys.slice(0, index), keys[index + 1], keys[index], ...keys.slice(index + 2)] })
  }

  render() {
    const { label, getFieldDecorator, getFieldValue, initialValue, keysField, type, header } = this.props
    const { showModal, modeModal, current, showDetailModal, detailRow, detailCol, detail } = this.state

    getFieldDecorator(keysField, { initialValue })
    const items = getFieldValue(keysField)

    const formItems =
      items &&
      items.map((row, index) => {
        const columns = row?.columns || []
        const height = row?.height

        return (
          <Form.Item label={index === 0 ? label : ''} key={index} style={{ fontWeight: 'bold', marginBottom: '0' }}>
            <div className="oz-page-layout-form-item">
              <Button type="default" className="dynamic-button" icon="delete" size="default" onClick={() => this.remove(index, keysField)} />
              <Button
                type="default"
                className="dynamic-button"
                icon="edit"
                size="default"
                onClick={() => this.setState({ showModal: true, modeModal: 'edit', current: index })}
              />
              <InputNumber
                value={height}
                onChange={value => {
                  this.update(keysField, index, {
                    ...row,
                    height: value,
                  })
                }}
                style={{ minWidth: '80px' }}
              />
              <Row className="column-row" gutter={0}>
                {columns &&
                  columns.map((column, j) => (
                    <Col span={column.ratio * 2} key={j}>
                      <CellSelect
                        type={type}
                        value={column}
                        onChange={(cellType, data) => {
                          this.update(keysField, index, {
                            ...row,
                            columns: [...columns.slice(0, j), { ...columns[j], cellType, [cellType]: data }, ...columns.slice(j + 1)],
                          })
                        }}
                        header={header}
                        style={{ width: 'calc(100% - 32px)' }}
                      />
                      <Button
                        disabled={column.cellType === CellType.Group}
                        type="default"
                        className="dynamic-button"
                        icon="ellipsis"
                        size="default"
                        onClick={() => {
                          this.setState({
                            showDetailModal: true,
                            detailRow: index,
                            detailCol: j,
                            detail: column,
                          })
                        }}
                      />
                    </Col>
                  ))}
              </Row>
            </div>
            {index < items.length - 1 && (
              <Button
                type="dashed"
                // className="dynamic-button"
                icon="swap"
                block
                onClick={() => this.swap(keysField, index)}
              />
            )}
          </Form.Item>
        )
      })

    return (
      <>
        {formItems}
        <Button type="primary" block onClick={() => this.setState({ showModal: true, modeModal: 'add', current: null })}>
          <Icon type="plus" /> Add New Row
        </Button>
        <AddModal
          mode={modeModal}
          initialValue={current < 0 ? null : items[current]}
          visible={showModal}
          onSubmit={row => {
            if (modeModal === 'add') this.add(keysField, row)
            else this.update(keysField, current, row)
          }}
          onCancel={() => this.setState({ showModal: false })}
        />
        {showDetailModal && (
          <DetailModal
            visible={showDetailModal}
            initialValue={detail}
            onApply={values => {
              const modified = objectAssignDeep(detail, { [detail.cellType]: values })
              _.set(modified, `${detail.cellType}.data`, values.data)
              this.update(keysField, detailRow, {
                ...items[detailRow],
                columns: [...items[detailRow].columns.slice(0, detailCol), modified, ...items[detailRow].columns.slice(detailCol + 1)],
              })
            }}
            onCancel={() => this.setState({ showDetailModal: false })}
            currentKey={`${detailRow}-${detailCol}`}
          />
        )}
      </>
    )
  }
}

export default OZPageLayout
