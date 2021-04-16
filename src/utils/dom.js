import { isFunction } from '@/utils/typeof'

// Determine if an element is an HTML element
export const isElement = el => !!(el && el.nodeType === Node.ELEMENT_NODE)

// Set an attribute on an element
export const setAttr = (el, attr, val) => {
  if (attr && isElement(el)) {
    el.setAttribute(attr, val)
  }
}

// Returns true if the parent element contains the child element
export const contains = (parent, child) =>
  parent && isFunction(parent.contains) ? parent.contains(child) : false
