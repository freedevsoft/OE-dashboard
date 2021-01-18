
import styled from 'styled-components'
import * as constants from 'utils/constants'

export const CrossLine = styled.div`
  width: 100%;
  height: 1px;
  margin: 55px auto 5px auto;
  margin-top: ${props => (props.top != undefined ? `${props.top}px` : '55px')};
  background-color: ${props => `${constants.getBackground(props.theme)}`};
`
