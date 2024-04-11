<template>
  <click2pay-user-exists-header v-if="show" />
</template>

<script>
import { loadClick2pay, Click2payUserExistsHeader } from '@/import'
import { mapState } from '@/utils/store'
import { consoleInfo } from '@/utils/console'

export default {
  components: {
    Click2payUserExistsHeader,
  },
  data() {
    return {
      show: false,
    }
  },
  computed: {
    ...mapState(['ready']),
    ...mapState('order', ['ready_to_submit']),
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
      if (this.ready_to_submit) return
      if (!this.store.enabledClick2pay()) return

      loadClick2pay()
        .then(({ isUserExists }) => isUserExists())
        .then(() => {
          this.show = true
        })
        .catch(error => {
          consoleInfo('Click to Pay user-exists-header', error)
        })
    },
  },
}
</script>
