import {css} from '@emotion/core'
import {br as boxBr} from '../Box/styles'
import {directionalRe} from '../utils/directionalScale'


export function br (val, theme, props) {
  if (val === false) return null

  let abbr, value
  let topRadius = 't0', bottomRadius = 'b0'

  if (typeof val === 'number' || typeof val === 'string' && parseInt(val) > -1) {
    value = val
  } else {
    const av = String(val).split(directionalRe)
    abbr = av[0]
    value = av[1]
  }

  switch (abbr) {
    case 'y':
      topRadius = `t${value}`
      bottomRadius = `b${value}`
      break;
    case 't':
      topRadius = `t${value}`
      break;
    case 'b':
      bottomRadius = `b${value}`
      break;
    case 'tl':
      topRadius = `tl${value}`
      break;
    case 'tr':
      topRadius = `tr${value}`
      break;
    case 'bl':
      bottomRadius = 'bl${value}'
      break;
    case 'br':
      bottomRadius = 'bl${value}'
      break;
    case 'l':
      topRadius = `tl${value}`
      bottomRadius = `bl${value}`
      break;
    case 'r':
      topRadius = `tr${value}`
      bottomRadius = `br${value}`
      break;
    default:
      topRadius = `t${value}`
      bottomRadius = `b${value}`
  }

  return css`
    ${boxBr(val, theme, props)}

    & > *:first-child {
      ${boxBr(topRadius, theme, props)};
      ${boxBr('b0', theme, props)};
    }

    & > *:last-child {
      ${boxBr(bottomRadius, theme, props)};
      ${boxBr('t0', theme, props)};
    }
  `
}