<template>
  <div class="f-offer" :class="[hasError ? $css.he : '']">
    <tooltip :text="errors.first('f-offer')" :enable="errors.has('f-offer')" target="#f-offer">
      <input
        v-model="params.offer"
        v-validate="'required'"
        :data-vv-as="$t('offer')"
        data-vv-name="f-offer"
        type="checkbox"
        class="f-checkbox"
        id="f-offer"
      />
      <label :class="[$css.cl]" for="f-offer" v-html="$t('offer_t', [options.offerta_url])"></label>
    </tooltip>
  </div>
</template>

<script>
  import Tooltip from '@/components/tooltip'

  export default {
    inject: ['$validator'],
    data () {
      return {
      }
    },
    components: {
      Tooltip
    },
    computed: {
      hasError() {
        let flag = this.$validator.flags['f-offer']
        return this.errors.has('f-offer') && ((flag && flag.touched) || this.store.state.submit)
      }
    },
  }
</script>
