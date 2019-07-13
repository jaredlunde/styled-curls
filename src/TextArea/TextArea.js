import React from 'react'
import {css} from '@emotion/core'
import createElement from '../createElement'
import {useBox} from '../Box'
import {useType} from '../Type'
import * as styles from './styles'
import * as defaultTheme from './defaultTheme'
import useStyles from '../useStyles'


const
  defaultStyles = css`
    appearance: none;
    outline: none;
    margin: 0;
  `,
  options = {name: 'textArea', styles, defaultStyles, defaultTheme},
  autoResize = e => {
    if (!e.target.value)
      e.target.style.height = ''
    else {
      e.target.style.height = 'auto'
      e.target.style.height = e.target.scrollHeight + 'px'
    }
  },
  useTextArea = props => useStyles(Object.assign({__inputStyles: true}, props), options),
  TextArea = React.forwardRef(
    (props, ref) => {
      let nodeProps = useBox(useType(useTextArea(props)))
      nodeProps.ref = ref

      if (props.autoResize) {
        nodeProps.onChange = e => {
          typeof props.onChange === 'function' && props.onChange(e)
          autoResize(e)
        }
      }

      return createElement('textarea', nodeProps)
    }
  )

if (__DEV__) {
  const
    propTypes = require('./propTypes').default,
    typePropTypes = require('../Type/propTypes').default,
    boxPropTypes = require('../Box/propTypes').default,
    flexPropTypes = require('../Flex/propTypes').default
  TextArea.displayName = 'TextArea'
  TextArea.propTypes = Object.assign({}, boxPropTypes, flexPropTypes, typePropTypes, propTypes)
}

export {useTextArea}
export default TextArea