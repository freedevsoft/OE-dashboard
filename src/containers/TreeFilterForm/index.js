import React, { useState } from 'react'
import { Form, Button, Icon, Input, Select, InputNumber, Tag } from 'antd'
import { groupingQuery } from 'utils/queries'
import { useQuery } from '@apollo/react-hooks'
import { getDepthValue } from 'utils'
import { ruleTypes } from './utils.js'
import MapModal from './MapModal'
import './index.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCloudUploadAlt,
  faListUl,
  faEye,
  faFileDownload,
  faPaperPlane,
  faPencilAlt,
} from '@fortawesome/free-solid-svg-icons'

/*
list = [
  {
    name: 'Criteria #1',
    opr: 'or' | 'and',
    rules: [
      {
        type: 'zip_code',
        comparison: '=',
        value: '94490',
        opr: 'or' | 'and'
      }
    ]
  }
]
*/

const TreeFilterForm = ({
  data,
  form: { getFieldDecorator, getFieldValue, setFieldsValue },
  field,
  initialValue = {
    list: [],
  },
}) => {
  const register = key => {
    getFieldDecorator(`${field}.${key}`, { initialValue: getDepthValue(data, key, initialValue[key]) })
  }

  const [visibleMap, setVisibleMap] = useState(false)
  const [currentMap, setCurrentMap] = useState({ index: 0, ruleIndex: 0 })
  const [filterAction, setFilterAction] = useState('')
  // "Submitted", "Processing", "Completed", or "No Status"
  const [currentAction, setCurrentAction] = useState('')

  const onOpenMap = (index, ruleIndex) => {
    setCurrentMap({ index, ruleIndex })
    setVisibleMap(true)
  }

  const onCancelMap = () => {
    setCurrentMap({ index: 0, ruleIndex: 0 })
    setVisibleMap(false)
  }

  register('list')

  const list = getFieldValue(`${field}.list`)

  const { loading, error, data: groupingQueryData } = useQuery(groupingQuery, {
    variables: {
      ids: list,
    },
  })

  const update = (index, internal, value) => {
    setFieldsValue({ [`${field}.list`]: [...list.slice(0, index), { ...list[index], [internal]: value }, ...list.slice(index + 1)] })
  }

  const remove = index => {
    setFieldsValue({ [`${field}.list`]: [...list.slice(0, index), ...list.slice(index + 1)] })
  }

  const addCriteria = () => {
    setFieldsValue({ [`${field}.list`]: [...list, { name: '', opr: undefined, rules: [] }] })
  }

  const addRule = index => {
    update(index, 'rules', [...list[index].rules, { type: undefined, comparison: undefined, value: '', opr: undefined }])
  }

  const updateRule = (index, ruleIndex, internal, value) => {
    const { rules } = list[index]
    update(index, 'rules', [...rules.slice(0, ruleIndex), { ...rules[ruleIndex], [internal]: value }, ...rules.slice(ruleIndex + 1)])
  }

  const updateRuleV2 = (index, ruleIndex, obj) => {
    const { rules } = list[index]
    update(index, 'rules', [...rules.slice(0, ruleIndex), { ...rules[ruleIndex], ...obj }, ...rules.slice(ruleIndex + 1)])
  }

  const removeRule = (index, ruleIndex) => {
    const { rules } = list[index]
    update(index, 'rules', [...rules.slice(0, ruleIndex), ...rules.slice(ruleIndex + 1)])
  }

  const onUpdateMap = (e, form) => {
    e.preventDefault()

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values.comp, currentMap)

        updateRule(currentMap?.index, currentMap?.ruleIndex, 'value', values.comp)

        setVisibleMap(false)
        setCurrentMap({ index: 0, ruleIndex: 0 })
      }
    })
  }

  const renderStatus = () => {
    if (currentAction === 'Submitted') return <Tag color="gold">Submitted</Tag>
    if (currentAction === 'Processing') return <Tag color="blue">Processing</Tag>
    if (currentAction === 'Completed') return <Tag color="green">Completed</Tag>

    return ''
  }

  const onSubmit = (status) => {
    setCurrentAction(status)
    if (status === 'Submitted') {
      setTimeout(() => {
        setCurrentAction('Processing')
      }, 1000)
      setTimeout(() => {
        setCurrentAction('Completed')
      }, 5000)
    }
  }

  return (
    <div className="form-criterion">
      <div className="filter-form-buttongroup">
        <span
          onClick={() => onSubmit('Submitted')}
          className="filter-form-buttongroup-button"
          style={{ backgroundColor: currentAction === 'Submitted' ? 'rgb(36, 45, 60)' : null }}
        >
          <FontAwesomeIcon
            icon={faPaperPlane}
            color={currentAction === 'Submitted' ? '#FFF' : 'rgba(0, 0, 0, 0.65)'}
          />
        </span>
        <span
          className="filter-form-buttongroup-button"
          style={{ backgroundColor: currentAction !== 'Completed' ? 'rgb(36, 45, 60)' : null }}
        >
          <FontAwesomeIcon
            icon={faFileDownload}
            color={currentAction !== 'Completed' ? '#FFF' : 'rgba(0, 0, 0, 0.65)'}
          />
        </span>
        <span
          className="filter-form-buttongroup-button"
          style={{ backgroundColor: currentAction !== 'Completed' ? 'rgb(36, 45, 60)' : null }}
        >
          <FontAwesomeIcon
            icon={faEye}
            color={currentAction !== 'Completed' ? '#FFF' : 'rgba(0, 0, 0, 0.65)'}
          />
        </span>
      </div>
      <div className="word-action-inline row">
        <div className="word-action-inline-item col-md-7">
          <label className="label">Actions:</label>
          <Select
            className="action-select"
            placeholder="Actions"
            value={filterAction}
            onChange={value => setFilterAction(value)}
          >
            <Select.Option value="delete">Delete</Select.Option>
            <Select.Option value="publish">Publish</Select.Option>
            <Select.Option value="move">Move</Select.Option>
            <Select.Option value="copy">Copy</Select.Option>
            <Select.Option value="analyze">Analyze Data</Select.Option>
            <Select.Option value="filter">Client Filtering</Select.Option>
          </Select>
          <span className="state">{renderStatus()}</span>
        </div>
        {(filterAction === 'move' || filterAction === 'copy') && (
          <div className="word-action-inline-item col-md-5">
            <label className="label">Destination:</label>
            <Input
              className="path"
              placeholder="Enter a path"
            />
          </div>
        )}
      </div>
      <div className="form-criterion-list">
        {list?.map((criteria, index) => {
          const { name, opr, rules } = criteria

          return (
            <Form.Item className="criteria" key={index}>
              <label className="label">Criteria:</label>
              <div className="criteria-inline">
                <Icon className="dynamic-delete-button" type="minus-circle" onClick={() => remove(index)} />
                <Input
                  className="criteria-name"
                  value={name}
                  onChange={e => update(index, 'name', e.target.value)}
                  placeholder="Enter criteria name"
                />
                <Select className="criteria-opr" value={opr} onChange={value => update(index, 'opr', value)} placeholder="Operator">
                  <Select.Option value="or">Or</Select.Option>
                  <Select.Option value="and">And</Select.Option>
                </Select>
              </div>
              <div className="form-rules-list">
                {rules?.map((rule, ruleIndex) => {
                  const { type, comparison, value, opr } = rule

                  let selectedRule = {
                    comparisonTypes: [],
                    valueType: 'string',
                  }
                  if (rule) {
                    const selectedIndex = ruleTypes.findIndex(current => current.value === type)
                    if (selectedIndex >= 0) {
                      selectedRule = ruleTypes[selectedIndex]
                    }
                  }

                  console.log(selectedRule.enumValues, value)

                  return (
                    <Form.Item className="rule" key={ruleIndex}>
                      <div className="rule-inline">
                        <Icon className="dynamic-delete-button" type="minus-circle" onClick={() => removeRule(index, ruleIndex)} />
                        <Select
                          className="rule-type"
                          value={type}
                          onChange={value => {
                            updateRuleV2(index, ruleIndex, { value: null, type: value })
                          }}
                          placeholder="Select rule type"
                        >
                          {ruleTypes?.map((option, optionIndex) => (
                            <Select.Option value={option.value} key={optionIndex}>
                              {option.label}
                            </Select.Option>
                          ))}
                        </Select>
                        <Select
                          className="rule-comparison"
                          value={comparison}
                          onChange={value => updateRule(index, ruleIndex, 'comparison', value)}
                          placeholder="Compare"
                        >
                          {selectedRule.comparisonTypes?.map((option, optionIndex) => (
                            <Select.Option value={option.value} key={optionIndex}>
                              {option.label}
                            </Select.Option>
                          ))}
                        </Select>
                        {selectedRule.valueType === 'string' && (
                          <Input
                            className="rule-value"
                            placeholder="Value"
                            value={value}
                            onChange={e => updateRule(index, ruleIndex, 'value', e.target.value)}
                          />
                        )}
                        {selectedRule.valueType === 'button' && (
                          <Button className="rule-value rule-value-btn" onClick={() => onOpenMap(index, ruleIndex)}>
                            ...
                          </Button>
                        )}
                        {selectedRule.valueType === 'number' && (
                          <InputNumber
                            className="rule-value"
                            placeholder="Value"
                            value={value}
                            onChange={e => updateRule(index, ruleIndex, 'value', e.target.value)}
                          />
                        )}
                        {selectedRule.valueType === 'select' && (
                          <Select
                            className="rule-value"
                            value={value}
                            onChange={value => updateRule(index, ruleIndex, 'value', value)}
                            placeholder="Value"
                          >
                            {selectedRule.enumValues?.map((option, optionIndex) => (
                              <Select.Option value={option.value} key={optionIndex}>
                                {option.label}
                              </Select.Option>
                            ))}
                          </Select>
                        )}
                        <Select className="rule-opr" value={opr} onChange={value => updateRule(index, ruleIndex, 'opr', value)} placeholder="And/Or">
                          <Select.Option value="or">Or</Select.Option>
                          <Select.Option value="and">And</Select.Option>
                        </Select>
                      </div>
                    </Form.Item>
                  )
                })}
              </div>
              <Form.Item className="rule add-new">
                <div className="rule-inline">
                  <Button className="dynamic-add-button" type="dashed" onClick={() => addRule(index)}>
                    <Icon type="plus" /> Add another rule
                  </Button>
                </div>
              </Form.Item>
            </Form.Item>
          )
        })}
      </div>

      <Form.Item className="criteria add-new">
        <div className="criteria-inline">
          <Button className="dynamic-add-button" type="dashed" onClick={addCriteria}>
            <Icon type="plus" /> Add another criteria
          </Button>
        </div>
      </Form.Item>

      {visibleMap && (
        <MapModal
          title="Map Information"
          comp={list[currentMap?.index]?.rules[currentMap?.ruleIndex]?.value}
          visible={visibleMap}
          onUpdate={onUpdateMap}
          onCancel={onCancelMap}
        />
      )}
    </div>
  )
}

export default TreeFilterForm
