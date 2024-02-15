<template>
  <click2pay-success-page v-if="show" />
</template>

<script>
import { Click2paySuccessPage, loadClick2pay } from '@/import'
import { mapState } from '@/utils/store'

export default {
  components: {
    Click2paySuccessPage,
  },
  data() {
    return {
      show: false,
    }
  },
  computed: {
    ...mapState(['orderModel']),
    ...mapState('order', ['order_data']),
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if (!this.store.needClick2payRegistration()) return

      loadClick2pay()
        .then(({ needRegistration }) =>
          needRegistration(this.order_data.sender_email)
        )
        .then(() => {
          this.show = true
        })
        .catch(() => {
          this.orderModel.submitToMerchant()
        })
    },
  },
}
</script>
