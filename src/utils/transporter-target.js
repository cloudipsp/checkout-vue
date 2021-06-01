import Vue from 'vue'
import { concat } from '@/utils/array'
import { removeNode } from '@/utils/dom'
import { isFunction } from '@/utils/inspect'
import { PROP_TYPE_ARRAY_FUNCTION } from '@/constants/props'
import { makeProp } from '@/utils/props'

// FTransporterSingle/FTransporterTargetSingle:
//
// Single root node portaling of content, which retains parent/child hierarchy
// Unlike Portal-Vue where portaled content is no longer a descendent of its
// intended parent components
//
// Private components for use by Tooltips, Popovers and Modals
//
// Based on vue-simple-portal
// https://github.com/LinusBorg/vue-simple-portal

// Transporter target used by BTransporterSingle
// Supports only a single root element
// @vue/component
export const FTransporterTargetSingle = Vue.extend({
  // As an abstract component, it doesn't appear in the $parent chain of
  // components, which means the next parent of any component rendered inside
  // of this one will be the parent from which is was portal'd
  abstract: true,
  props: {
    // Even though we only support a single root element,
    // VNodes are always passed as an array
    nodes: makeProp(PROP_TYPE_ARRAY_FUNCTION),
  },
  data: vm => {
    return {
      updatedNodes: vm.nodes,
    }
  },
  destroyed() {
    removeNode(this.$el)
  },
  render(h) {
    let nodes = isFunction(this.updatedNodes)
      ? this.updatedNodes({})
      : this.updatedNodes
    nodes = concat(nodes).filter(Boolean)
    if (nodes && nodes.length > 0 && !nodes[0].text) {
      return nodes[0]
    } else {
      return h()
    }
  },
})
