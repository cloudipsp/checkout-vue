<script>
  import PaymentSystems from '@/mixins/payment-systems'
  import config from '@/config/payment-systems'
  import InputSelect from '@/components/input-select'
  import { sort } from '@/config/trustly'

  export default {
    components: {
      InputSelect,
    },
    mixins: [PaymentSystems],
    data () {
      return {
        formData: {
          country: 'PL'
        }
      }
    },
    computed: {
      config () {
        return (this.options.tabs.trustly && this.options.tabs.trustly.payment_systems) || {}
      },
      keys () {
        return Object.keys(this.config)
      },
      values () {
        return Object.values(this.config)
      },
      configArray () {
        return this.values.map((item, i)=>({
          id: this.keys[i],
          ...item
        }))
      },
      country () {
        return Object.values(this.config)
          .map((item)=>item.country)
          .filter((item, key, self)=>self.indexOf(item) === key)
      },
      listSelect () {
        return this.configArray
          .filter((item)=>item.country===this.formData.country)
          .map((item)=>item.id)
      },
      sort () {
        return sort
          .map((item)=>String(item))
          .filter((item)=>this.listSelect.indexOf(item)>-1)
      },
      list () {
        return this.sort
          .concat(this.listSelect)
          .filter((item, key, self)=>self.indexOf(item) === key)
      }
    },
    created(){
      this.$slots.default = this.renderSlot(this.$createElement)
    },
    methods: {
      renderSlot (h) {
        return h('div', {
          class: {
            'f-block': true
          }
        }, [
          h('div', {
            class: {
              'f-block-sm': true
            },
          }, [
            h('input-select', {
              props: {
                list: this.country,
                name: 'country',
                value: this.formData.country,
                model: this.formData,
                readonly: this.country.length === 1
              },
              on: {
                input: (value) => {
                  this.formData.country = value
                }
              }
            })
          ])
        ])
      }
    }
  }
</script>
