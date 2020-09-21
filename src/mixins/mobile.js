import mobile from 'ismobilejs'
import Resize from '@/mixins/resize'

export default {
  mixins: [Resize],
  data() {
    return {
      isMobile: mobile().any || mobile().phone || mobile().tablet,
      isDesktop: !this.isMobile,
    }
  },
  computed: {
    isPhone() {
      return mobile().phone || this.isWidthSm
    },
  },
}
