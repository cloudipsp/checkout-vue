<template>
  <div class="f-offer" :class="{'f-has-error': errors.has('offer')}">
    <tooltip :text="errors.first('offer')" :enable="errors.has('offer')" target="#f-offer">
      <input
        v-model="params.offer"
        v-validate="'required'"
        :data-vv-as="$t('offer')"
        data-vv-name="offer"
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
    }
  }
</script>
