import React, {
  useRef,
  useEffect,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react'
import {css} from '@emotion/core'
import {createStyleHook, useTheme, createElement} from '@style-hooks/core'
import useWindowSize from '@react-hook/window-size'
import useWindowScroll from '@react-hook/window-scroll'
import useLayoutEffect from '@react-hook/passive-layout-effect'
import useMergedRef from '@react-hook/merged-ref'
import {useBox} from '../Box'
import {portalize, objectWithoutProps} from '../utils'
import {setPlacementStyle} from './utils'
import useSwitch from '../useSwitch'
import useParseBreakpoints from '../useParseBreakpoints'

export const PopoverContext = React.createContext({}),
  {Consumer: PopoverConsumer} = PopoverContext,
  usePopoverContext = () => useContext(PopoverContext)

const defaultStyles = css`
    display: flex;
    position: fixed;
    z-index: 1001;
  `,
  withoutPop = {ref: 0, containerRef: 0, style: 0}

export const usePopoverBox = createStyleHook('popover', {}),
  PopoverBox = React.forwardRef((props_, ref) => {
    const {
      placement = 'bottom',
      transition,
      portal,
      style,
      children,
      ...props
    } = useBox(usePopoverBox(props_))
    const matches = useParseBreakpoints(placement)
    const popover = usePopoverContext()
    useEffect(() => {
      if (typeof placement === 'function') {
        popover.reposition(placement)
      } else if (matches) {
        popover.reposition(matches.filter(match => match.matches).pop().value)
      }
    }, [matches, popover.reposition])
    const {css} = transition({
      isVisible: popover.isVisible,
      placement: popover.placement,
    })

    props.ref = useMergedRef(popover.ref, ref)
    props.children =
      typeof children === 'function'
        ? children(objectWithoutProps(popover, withoutPop))
        : children
    props.css = props.css
      ? [defaultStyles, css].concat(props.css)
      : [defaultStyles, css]
    props.style = props.style
      ? Object.assign({}, popover.style, props.style)
      : popover.style
    return portalize(createElement('div', props), portal)
  })

const PopoverContainer = React.memo(
  ({show, hide, toggle, isVisible, windowSize, scrollY, children}) => {
    const containerRef = useRef(null),
      popoverRef = useRef(null),
      [{style, requestedPlacement, placement}, setState] = useState({
        style: {},
        placement: null,
      }),
      reposition = useCallback(
        (placement = requestedPlacement) => {
          setState(
            setPlacementStyle(
              placement,
              containerRef.current,
              popoverRef.current,
              windowSize
            )
          )
        },
        [requestedPlacement, windowSize]
      ),
      childContext = useMemo(
        () => ({
          isVisible,
          show,
          hide,
          toggle,
          style,
          ref: popoverRef,
          placement,
          reposition,
          containerRef,
        }),
        [isVisible, show, hide, toggle, placement, reposition, style]
      )

    useLayoutEffect(() => {
      isVisible && reposition()
    }, [reposition, windowSize[0], windowSize[1], scrollY])

    return (
      <PopoverContext.Provider
        value={childContext}
        children={
          typeof children === 'function' ? children(childContext) : children
        }
      />
    )
  },
  (prev, next) =>
    (next.isVisible === false &&
      prev.isVisible === false &&
      prev.children === next.children) ||
    (prev.children === next.children &&
      prev.isVisible === next.isVisible &&
      prev.windowSize[0] === next.windowSize[0] &&
      prev.windowSize[1] === next.windowSize[1] &&
      prev.scrollY === next.scrollY)
)

export const PopoverMe = ({children, on}) => {
  const matches = useParseBreakpoints(on),
    {show, hide, toggle} = usePopoverContext(),
    elementRef = useRef(null),
    ref = useMergedRef(usePopoverContext().containerRef, elementRef)

  useLayoutEffect(() => {
    if (elementRef.current) {
      const listeners = []
      const addListener = (...args) => {
        listeners.push(args)
        elementRef.current.addEventListener(...args)
      }

      for (let match of matches) {
        if (match.matches === true) {
          switch (match.value) {
            case 'hover':
              addListener('mouseenter', show)
              addListener('mouseleave', hide)
              break

            case 'focus':
              addListener('focus', show)
              addListener('blur', hide)
              break

            case 'click':
              addListener('click', toggle)
              break
          }
        }
      }

      return () => {
        listeners.forEach(args =>
          elementRef.current.removeEventListener(...args)
        )
      }
    }
  }, [elementRef.current, matches, show, hide, toggle])

  return React.cloneElement(children, {ref})
}

const ScrollPositioner = props =>
  React.createElement(
    PopoverContainer,
    Object.assign({scrollY: useWindowScroll(15)}, props)
  )

const sizeOpt = {wait: 240}
export const Popover = ({repositionOnScroll = false, visible, children}) => {
  const toggle = useSwitch(false, visible)
  const windowSize = useWindowSize(1280, 720, sizeOpt)
  return React.createElement(
    repositionOnScroll ? ScrollPositioner : PopoverContainer,
    {
      children,
      show: toggle.on,
      hide: toggle.off,
      toggle: toggle.toggle,
      isVisible: toggle.value,
      windowSize,
    }
  )
}

if (__DEV__) {
  Popover.displayName = 'Popover'
  PopoverBox.displayName = 'PopoverBox'
}
