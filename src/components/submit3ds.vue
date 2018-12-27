<template>
  <modal :value="value" @input="toggle" size="md" :backdrop="false">
    <div slot="title" class="f-text-danger">{{$t('submit3ds_title')}}</div>
    <span v-t="'submit3ds_text'"></span>
    <div slot="footer">
      <button type="button" @click="toggle(false)" :class="[$css.btn, 'f-btn-link']">
        <span v-t="'back'"></span>
      </button>
      <button type="button" @click="submit" :class="[$css.btn, $css.bs]">
        <span v-t="'submit3ds_submit'"></span>
      </button>
      <div class="f-text-muted" v-t="{path: 'submit3ds_wait', args: [duration]}"></div>
    </div>
  </modal>
</template>

<script>
  import Modal from '@/components/modal'

  export default {
    props: {
      value: {
        type: Boolean,
        default: false
      },
      duration: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        timeout: null
      }
    },
    watch: {
      value (v) {
        clearTimeout(this.timeout);
        if (v) {
          this.wait()
        }
      }
    },
    components: {
      Modal
    },
    methods: {
      submit: function () {
        this.toggle(false)
        this.$emit('submit3ds')
      },
      toggle: function (show) {
        this.$emit('input', show)
      },
      wait: function () {
        if (!this.duration) return this.submit();
        this.timeout = setTimeout(() => {
          this.$emit('update:duration', this.duration - 1)
          this.wait()
        }, 1000);
      }
    }
  }
</script>
