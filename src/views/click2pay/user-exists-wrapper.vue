<template>
  <click2pay-user-exists v-if="show" />
</template>

<script>
import { Click2payUserExists, loadClick2pay } from '@/import'
import { mapState } from '@/utils/store'

export default {
  components: {
    Click2payUserExists,
  },
  data() {
    return {
      show: false,
    }
  },
  computed: {
    ...mapState(['ready']),
    ...mapState('info', ['click2pay_init_enabled']),
  },
  watch: {
    ready: 'init',
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if (!this.ready) return
      if (!this.click2pay_init_enabled) return

      loadClick2pay()
        .then(({ needUserExists }) => needUserExists())
        .then(() => {
          this.show = true
        })
        .catch(error => {
          console.warn('Click to Pay needUserExists', error)
        })
    },
  },
}
</script>
