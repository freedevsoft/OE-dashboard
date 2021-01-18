import styled from 'styled-components'
import * as constants from 'utils/constants'

export const ControlTopRight = styled.div`
  position: absolute;
  top: ${props => (props.top ? `${props.top}px` : '20px')};
  right: ${props => (props.right ? `${props.right}px` : '40px')};

  h6 {
    color: ${props => `${constants.getColor(props.theme)}`};
  }
`
