import React, { useState, useEffect } from 'react'
import { Button, Modal, Radio, Divider, Row, Col } from 'antd'
import _ from 'lodash'
import { CellType, CellComponentType } from '../../utils'
import './index.scss'

const rowTypes = {
  1: ['1'],
  2: ['1:3', '1:2', '1:1', '2:1', '3:1'],
  3: ['1:1:2', '1:2:1', '1:1:1', '2:1:1'],
  4: ['1:1:1:1'],
}

const AddRowModal = ({ onCancel, onSubmit, mode, visible, loading, initialValue }) => {
  const [nColumn, setColumnCount] = useState(initialValue ? (_.get(initialValue, 'columns') || []).length : 1)
  const [row, setRow] = useState(
    initialValue || {
      type: '1',
      height: undefined,
      columns: [
        {
          ratio: 12,
          cellType: CellType.None,
          groupType: {},
          group: {},
          component: {},
        },
      ],
    },
  )

  useEffect(() => {
    setColumnCount(initialValue ? (_.get(initialValue, 'columns') || []).length : 1)
    setRow(
      initialValue || {
        type: '1',
        height: undefined,
        columns: [
          {
            ratio: 12,
            cellType: CellType.None,
            groupType: {},
            group: {},
            component: {},
          },
        ],
      },
    )
  }, [initialValue])

  const onChangeType = type => {
    const ratioSum = type.split(':').reduce((prev, current) => prev + parseInt(current, 10), 0)

    setRow({
      type,
      columns: type.split(':').map((column, k) => ({ ratio: (12 / ratioSum) * parseInt(column, 10), ref: _.get(row, `columns[${k}].ref`) || {} })),
    })
  }

  const onChangeColumnCount = event => {
    setColumnCount(event.target.value)
    onChangeType(rowTypes[event.target.value][0])
  }

  const renderRows = []

  for (let i = 0; i < rowTypes[nColumn].length; i += 1) {
    const rowType = rowTypes[nColumn][i]

    const wrapperStyle = {
      backgroundColor: rowType === row.type ? 'dimgrey' : 'lightgray',
    }

    const ratioSum = rowType.split(':').reduce((prev, current) => prev + parseInt(current, 10), 0)

    renderRows.push(
      <div key={i} className="wrapper">
        <Radio value={rowType} checked={rowType === row.type} onChange={e => onChangeType(e.target.value)} key={rowType} style={wrapperStyle} />
        <Row style={wrapperStyle}>
          {rowType.split(':').map((column, index) => (
            <Col key={index} span={(24 / ratioSum) * parseInt(column, 10)}>
              Column
              {index + 1}
            </Col>
          ))}
        </Row>
      </div>,
    )
  }

  const onOk = () => {
    onSubmit(row)
    onCancel()
  }

  return (
    <Modal
      className="oe-page-layout-add-modal"
      visible={visible}
      title={mode === 'add' ? 'Add Row' : 'Edit Row'}
      onOk={onOk}
      onCancel={onCancel}
      width={600}
      footer={[
        <Button key="back" loading={loading} onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" loading={loading} type="primary" onClick={onOk}>
          {mode === 'add' ? 'Add' : 'Update'}
        </Button>,
      ]}
    >
      <div>
        <span>1. Select Number of Columns: </span>
        <Radio.Group onChange={onChangeColumnCount} value={nColumn}>
          <Radio value={1}>1</Radio>
          <Radio value={2}>2</Radio>
          <Radio value={3}>3</Radio>
          <Radio value={4}>4</Radio>
        </Radio.Group>
        <Divider />
        <p>2. Select Column Layout and Components: </p>
        <br />
        {renderRows}
      </div>
    </Modal>
  )
}
export default AddRowModal
