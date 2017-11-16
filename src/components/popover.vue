<script>
  import { Popover } from 'uiv'

  export default {
    extends: Popover,
    props: {
      placement: {
        type: String,
        default: 'right'
      },
      transitionDuration: {
        type: Number,
        default: 0
      }
    }
  }
</script>
