import React from 'react'
import _ from 'lodash'
import { CellComponentType } from '../../../utils'
import DetailComponentFooter from './Footer/index'

const DetailComponent = props => {
  const name = _.get(props.info, 'name')

  switch (name) {
    case CellComponentType.Footer:
      return <DetailComponentFooter {...props} />
    default:
      break
  }

  return ''
}

export default DetailComponent
