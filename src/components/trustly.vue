<script>
import PaymentSystems from '@/mixins/payment-systems'
import InputSelect from '@/components/input-select'
import { sort } from '@/config/trustly'

export default {
  components: {
    InputSelect,
  },
  mixins: [PaymentSystems],
  data() {
    return {
      formData: {
        country: this.options.default_country,
      },
    }
  },
  computed: {
    config() {
      return (
        (this.options.tabs.trustly &&
          this.options.tabs.trustly.payment_systems) ||
        {}
      )
    },
    keys() {
      return Object.keys(this.config)
    },
    values() {
      return Object.values(this.config)
    },
    configArray() {
      return this.values.map((item, i) => ({
        id: this.keys[i],
        ...item,
      }))
    },
    mapper() {
      let result = {}
      this.configArray.forEach(function(item) {
        result[item.bank_logo] = item.id
      })
      return result
    },
    country() {
      let result = this.values
        .map(item => item.country)
        .filter((item, key, self) => self.indexOf(item) === key)
        .map(item => ({
          id: item,
          name: this.$t(item),
        }))
      return this.sort(result, 'name')
    },
    listSelect() {
      return this.configArray
        .filter(item => item.country === this.formData.country)
        .map(item => item.id)
    },
    listSort() {
      return sort
        .map(item => this.mapper[item])
        .filter(item => this.listSelect.indexOf(item) > -1)
    },
    list() {
      return this.listSort
        .concat(this.listSelect)
        .filter((item, key, self) => self.indexOf(item) === key)
    },
    icon: vm => item => vm.config[item].bank_logo,
    text: vm => item => vm.config[item].name,
  },
  created() {
    this.$slots.default = this.renderSlot(this.$createElement)
  },
  methods: {
    sort: function(arr, field, reverse) {
      reverse = reverse ? -1 : 1
      return arr.sort((a, b) => {
        if (String.prototype.localeCompare) {
          return a[field].localeCompare(b[field], this.$i18n.locale) * reverse
        } else {
          return (a[field] < b[field] ? -1 : 1) * reverse
        }
      })
    },
    renderSlot(h) {
      return h(
        'div',
        {
          class: {
            'f-block': true,
          },
        },
        [
          h(
            'div',
            {
              class: {
                'f-block-sm': true,
              },
            },
            [
              h('input-select', {
                props: {
                  list: this.country,
                  name: 'country',
                  value: this.formData.country,
                  model: this.formData,
                  readonly: this.country.length === 1,
                  validate: 'required',
                },
                on: {
                  input: value => {
                    this.formData.country = value
                    this.$root.$emit('resize')
                  },
                },
              }),
            ]
          ),
        ]
      )
    },
  },
}
</script>
