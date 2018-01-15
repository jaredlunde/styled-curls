import React from 'react'
import {cx, css} from 'emotion'
import createOptimized from 'react-cake/es/utils/createOptimized'
import {baseIsNotVisible, baseIsVisible} from '../Fade/CSS'
import {flex, align, justify} from '../Flex/CSS'
import {pos, w, h, touchScrolling} from '../Box/CSS'
import Box from '../Box'
import Drop from '../Drop'
import * as defaultTheme from './defaultTheme'
import {getComponentTheme} from '../utils'
import {maxZIndex} from '../global'


/**
<Modal transitionType={Fade}>
  {
    ({ModalBox, show, hide, toggle, isVisible}) => (
      <Hero bg='black'>
        {ModalBox({
          p: 4,
          children: function ({show, hide, toggle, isVisible}) {
            return (
              <Type black>
                Im a modal</br>

                <Button onClick={hide}>
                  Close
                </Button>
              </Type>
            )
          }
        })}

        <Button md onClick={toggle}>
          Get yours today
        </Button>
      </Hero>
    )
  }
</Modal>
**/
const themePath = 'modal'
const fixedContainer = css`
  ${baseIsNotVisible};
  ${maxZIndex};
  ${flex};
  ${align.center};
  ${justify.center};
  ${pos.fixed};
  ${w('100%')};
  ${h('100%')};
  ${touchScrolling};
  left: 0;
  top: 0;
  overflow: auto;
`


export default function Modal ({children, transitionType = Drop, theme, ...props}) {
  theme = getComponentTheme(defaultTheme, theme, themePath)

  return transitionType({
    ...props,
    children: function ({isVisible, show, hide, toggle, className, ...modalProps}) {
      const modalClassName = className

      function ModalBox ({nodeType = 'div', children, ...boxProps}) {
        return Box({
          className: cx(fixedContainer, isVisible && baseIsVisible),
          children: function (box2Props) {
            return Box({
              p: theme.defaultPadding,
              bg: theme.defaultBg,
              br: theme.defaultBorderRadius,
              bc: theme.defaultBorderColor,
              bw: theme.defaultBorderWidth,
              sh: theme.defaultBoxShadow,
              ...boxProps,
              children: function ({className, ...containerProps}) {
                return (
                  <div {...box2Props}>
                    {createOptimized(
                      nodeType,
                      {
                        className: cx(className, modalClassName),
                        ...containerProps
                      },
                      children({
                        isVisible,
                        show,
                        hide,
                        toggle
                      })
                    )}
                  </div>
                )
              }
            })
          }
        })
      }

      return createOptimized(
        children,
        {
          ModalBox,
          isVisible,
          show,
          hide,
          toggle,
          ...modalProps
        }
      )
    }
  })
}
