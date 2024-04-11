<template>
  <click2pay-user-exists-card-page v-if="show" />
</template>

<script>
import { loadClick2pay, Click2payUserExistsCardPage } from '@/import'
import { mapState } from '@/utils/store'
import { consoleInfo } from '@/utils/console'
import { getBinName } from '@/utils/get-bin-name'

export default {
  components: {
    Click2payUserExistsCardPage,
  },
  data() {
    return {
      show: false,
    }
  },
  computed: {
    ...mapState(['ready']),
    ...mapState('order', ['ready_to_submit']),
    ...mapState('params', ['card_number']),
  },
  watch: {
    ready: 'init',
    card_number: 'init',
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.show = false

      if (!this.ready) return
      if (this.ready_to_submit) return
      if (!this.store.enabledClick2pay()) return
      if (getBinName(this.card_number) !== 'visa') return

      loadClick2pay()
        .then(({ isUserExists }) => isUserExists())
        .then(() => {
          this.show = true
        })
        .catch(error => {
          consoleInfo('Click to Pay user-exists-card', error)
        })
    },
  },
}
</script>
