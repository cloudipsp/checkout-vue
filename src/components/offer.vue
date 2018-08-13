<template>
  <div class="f-offer" :class="[hasError ? $css.he : '']">
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
    <tooltip :text="errors.first('f-offer')" :enable="hasError" target="#f-offer"></tooltip>
    <!--<input-checkbox-->
      <!--name="offer"-->
      <!--:validate="'required'"-->
    <!--&gt;<span v-html="$t('offer_t', [options.offerta_url])"></span></input-checkbox>-->
  </div>
</template>

<script>
  import Tooltip from '@/components/tooltip'
  import InputCheckbox from '@/components/input-checkbox'

  export default {
    inject: ['$validator'],
    data () {
      return {
      }
    },
    components: {
      Tooltip,
      InputCheckbox
    },
    computed: {
      hasError() {
        let flag = this.$validator.flags['f-offer']
        return this.errors.has('f-offer') && ((flag && flag.touched) || this.store.state.submit)
      }
    },
  }
</script>
