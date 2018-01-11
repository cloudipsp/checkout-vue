<template>
  <div :class="['f-form-group', hasError ? css.he : '']">
    <label :class="[css.cl, hasError ? css.le : '']" :for="name_" v-html="label_"></label>
    <select
      v-validate="validate"
      v-model="form[field_]"
      :data-vv-as="label_"
      :data-vv-name="name_"
      :class="[css.fc, hasError ? css.ie : '']"
      :id="name_"
    >
      <option v-for="item in list" :key="item.id || item" :value="item.id || item" v-t="item.name || item"></option>
    </select>
    <tooltip v-if="options.tooltip" :text="errors.first(name_)" :enable="hasError" :placement="placement" :target="'#'+name_"></tooltip>
    <div v-if="!options.tooltip && hasError" class="f-error">{{ errors.first(name_) }}</div>
  </div>
</template>

<script>
  import store from '@/store'
  import Input from '@/mixins/input'

  export default {
    mixins: [Input],
    props: {
      list: {
        type: Array
      }
    }
  }
</script>
