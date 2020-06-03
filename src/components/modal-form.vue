<template>
  <f-modal v-bind="$attrs" :backdrop="false" v-on="$listeners">
    <slot v-for="slot in Object.keys($slots)" :slot="slot" :name="slot" />

    <template v-if="$attrs.value">
      <component
        :is="field.component"
        v-for="field in listParse"
        :key="field.name"
        v-bind="field"
      />
    </template>

    <template #footer="{ toggle }">
      <button v-t="'confirm'" :class="classButton" @click="click(toggle)" />
    </template>
  </f-modal>
</template>

<script>
import { mapState, mapStateGetSet } from '@/utils/store'

export default {
  inject: ['$validator'],
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      model: {},
    }
  },
  computed: {
    ...mapState(['css']),
    ...mapStateGetSet(['submit']),
    listParse() {
      return this.list.map(item => ({ ...item, model: this.model }))
    },
    classButton() {
      return [this.css.btn, this.css.bs, 'f-btn-block']
    },
  },
  watch: {
    '$attrs.value': function(show) {
      if (!show) return

      this.clear()
    },
  },
  methods: {
    click(toggle) {
      this.$validator.validateAll().then(isValid => {
        this.submit = true
        // this.errors.items this.fields this.errors.clear() this.errors.count()
        if (!isValid) return

        this.$emit('submit', this.model)
        toggle(false)
      })
    },
    clear() {
      this.model = {}
      this.errors.clear()
    },
  },
  $_veeValidate: {
    validator: 'new',
  },
}
</script>
