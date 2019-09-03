import { shallowMount } from '@vue/test-utils'
import Checkout from '@/components/checkout.vue'

describe('checkout.vue', () => {
  it('test', () => {
    const msg = 'new message'
    const wrapper = shallowMount(Checkout, {
      propsData: {},
    })
    expect(wrapper.text()).toMatch(msg)
  })
})
