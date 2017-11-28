<template>
  <div :class="['f-form-group', {'f-has-error': errors.has(name_)}]">
    <label :for="name_">{{ label || '&nbsp;'}}</label>
    <tooltip :text="errors.first(name_)" :enable="errors.has(name_)" :placement="placement">
      <select
        :name="name_"
        v-validate="validate"
        v-model="form[field_]"
        :data-vv-as="label"
        class="f-form-control"
        :id="name_"
      >
        <option v-for="item in options" :key="item.value" :value="item.value">{{item.text}}</option>
      </select>
    </tooltip>
    <div v-if="false && errors.has(name_)" class="f-error">{{ errors.first(name_) }}</div>
  </div>
</template>

<script>
  import Input from '@/mixins/input'

  export default {
    mixins: [Input],
    inject: ['$validator'],
    props: {
      options: {
        type: Array
      }
    },
    data () {
      return {}
    }
  }
</script>
