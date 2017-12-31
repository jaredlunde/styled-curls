import propTypes from './propTypes'
import * as CSS from './CSS'
import defaultTheme from './defaultTheme'
import {createSFC} from '../utils'


export default createSFC({
  name: 'Grid',
  propTypes,
  CSS,
  defaultTheme,
  themePath: 'grid'
})
