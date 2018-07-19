<template>
  <div class="f-customer-fields">
    <div v-for="item in getFields">
      <input-select
        v-if="item.list"
        :list="item.list"
        :name="item.name"
        :field="item.field"
        :validate="item.valid"
        customer_data
      ></input-select>
      <input-text
        v-else
        :name="item.name"
        :field="item.field"
        :validate="item.valid"
        customer_data
      ></input-text>
    </div>
  </div>
</template>

<script>
  import config from '@/config/customer-fields'
  import countries from '@/config/countries'
  import InputText from '@/components/input-text'
  import InputSelect from '@/components/input-select'

  export default {
    created: function () {
      let index = this.options.customerFields.indexOf('email')
      if(this.options.email && index > -1) {
        this.options.customerFields.splice(index, 1)
      }
    },
    data () {
      return {
      }
    },
    computed: {
      getFields: function() {
        let result = [];
        this.options.customerFields.forEach(function(name){
          let item = { field: name }
          if(config[name].dictionary){
            item.list = countries
          }
          config[name] && result.push(Object.assign(item, config[name]))
        })
        return result;
      }
    },
    components: {
      InputText,
      InputSelect
    }
  }
</script>
