<template>
  <div>
    <div :class="$style.row">
      <f-form-group
        v-model="promocode"
        class="f-mb-0"
        :class="$style.input"
        name="promocode"
        label=""
        :placeholder="$t('enter_promo_code')"
        no-label-floating
        size="sm"
        :disabled="isApprove"
      />
      <f-button
        variant="default"
        :text="$t('add')"
        :disabled="disabledButton"
        data-e2e-btn-promo-code
        @click="add"
      />
    </div>
    <div v-if="status" :class="classMessage">{{ message }}</div>
  </div>
</template>

<script>
import FFormGroup from '@/components/form/group.vue'
import FButton from '@/components/button/button'
import { errorHandler } from '@/utils/helpers'
import { mapState } from '@/utils/store'

export default {
  components: {
    FFormGroup,
    FButton,
  },
  data() {
    return {
      promocode: '',
      loading: false,
      status: '',
    }
  },
  computed: {
    ...mapState(['params']),
    message() {
      return this.$t(`promo_status_${this.status}`)
    },
    classMessage() {
      return [
        this.$style.message,
        {
          [this.$style[this.status]]: this.status,
        },
      ]
    },
    isApprove() {
      return this.status === 'approve'
    },
    disabledButton() {
      return this.isApprove || !this.promocode
    },
  },
  methods: {
    add() {
      if (this.loading) return
      this.loading = true

      this.store
        .feeCalc({ promocode: this.promocode })
        .then(this.complete)
        .finally(() => {
          this.loading = false
        })
        .catch(errorHandler)
    },
    complete(model) {
      this.status = model.attr('promo_status')

      if (this.isApprove) {
        this.params.promocode = this.promocode
      }
    },
  },
}
</script>

<style lang="scss" module>
.row {
  display: flex;
}

.input {
  margin-right: px-to-rem(8px);
}

.message {
  font-size: px-to-rem(16px);
  line-height: px-to-rem(20px);
  font-weight: 500;
  margin-top: px-to-rem(4px);
}

.invalid {
  color: #de4761;
}
.expired {
  color: #de4761;
}

.approve {
  color: #08a835;
}
</style>
