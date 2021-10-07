<template>
  <f-form-group v-bind="attrs" @input="input">
    <template #default>
      <f-tooltip-autocomplete
        v-if="show"
        ref="tooltip"
        :target="() => $refs.input.$el"
      >
        <ul class="f-autocomplete-wrapper">
          <li
            v-for="(item, index) in list"
            :key="index"
            class="f-autocomplete-item"
            @click="select(item)"
          >
            {{ getItem(item) }}
          </li>
        </ul>
      </f-tooltip-autocomplete>
    </template>
  </f-form-group>
</template>

<script>
import FTooltipAutocomplete from '@/components/tooltip/tooltip-autocomplete'
import { mapState } from '@/utils/store'
import { PROP_TYPE_BOOLEAN, PROP_TYPE_FUNCTION } from '@/constants/props'
import { makeProp } from '@/utils/props'
import { timeoutMixin } from '@/mixins/timeout'

export default {
  components: {
    FTooltipAutocomplete,
  },
  mixins: [timeoutMixin],
  props: {
    send: makeProp(PROP_TYPE_BOOLEAN, false),
    getData: makeProp(PROP_TYPE_FUNCTION, undefined, true),
    getList: makeProp(PROP_TYPE_FUNCTION, undefined, true),
    getItem: makeProp(PROP_TYPE_FUNCTION, undefined, true),
  },
  data() {
    return {
      text: '',
      loading: false,
      list: [],
      selected: '',
    }
  },
  computed: {
    ...mapState(['params']),
    attrs() {
      return {
        ...this.$attrs,
        ref: 'input',
        value: this.text,
        autocomplete: 'false',
      }
    },
    show() {
      return this.list.length && !this.selected
    },
  },
  created() {
    if (this.send) {
      this.input('')
    }
  },
  methods: {
    input(value) {
      if (!value && !this.send) return
      if (value && this.selected === value) return
      if (this.selected) {
        this.clear()
        return
      }

      this.text = value

      this.timeout('research', 300)
    },
    research() {
      if (this.loading) return
      this.loading = true

      this.getList(this.text)
        .finally(() => {
          this.loading = false
        })
        .then(({ data }) => {
          this.list = this.getData(data) || []

          this.timeout(() => {
            if (this.show) {
              this.open()
            }
          }, 100)
        })
    },
    open() {
      this.$refs.tooltip.open()
    },
    close() {
      this.list = []
      // this.$refs.tooltip.close()
    },
    select(item) {
      this.text = this.getItem(item)
      this.selected = this.text
      this.$emit('select', item)
      this.close()
    },
    clear() {
      this.text = ''
      this.selected = ''
      this.$emit('select', '')
    },
  },
}
</script>
