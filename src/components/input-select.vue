<template>
  <div :class="['f-form-group', errors.has(name_) ? css.he : '']">
    <label :class="[css.cl, errors.has(name_) ? css.le : '']" :for="name_" v-html="label_"></label>
    <select
      v-validate="validate"
      v-model="form[field_]"
      :data-vv-as="label_"
      :data-vv-name="name_"
      :class="[css.fc, errors.has(name_) ? css.ie : '']"
      :id="name_"
    >
      <option v-for="item in list" :key="item" :value="item" v-t="item"></option>
    </select>
    <tooltip v-if="options.tooltip" :text="errors.first(name_)" :enable="errors.has(name_)" :placement="placement" :target="'#'+name_"></tooltip>
    <div v-if="!options.tooltip && errors.has(name_)" class="f-error">{{ errors.first(name_) }}</div>
  </div>
</template>

<script>
  import store from '@/store'
  import Input from '@/mixins/input'

  export default {
    mixins: [Input],
    inject: ['$validator'],
    props: {
      list: {
        type: Array
      }
    },
    data () {
      return {}
    }
  }
</script>
