import { shallowMount, createLocalVue } from '@vue/test-utils'
import Checkout from '@/checkout.vue'
import Store from '@/mixins/store'
import store from '@/store'
import { i18n } from '@/i18n'
import components from '@/components'

const localVue = createLocalVue()
localVue.use(components)
localVue.use(Store)
store.setStateDefault()

describe('checkout.vue', () => {
  it('Register is a component', () => {
    const wrapper = shallowMount(Checkout, {
      localVue,
      i18n,
      store,
      propsData: {
        optionsUser: {},
      },
    })

    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})

