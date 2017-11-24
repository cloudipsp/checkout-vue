<template>
  <div class="f-success">
    <div class="f-block">
      <div class="f-block-sm">
        <div class="f-form-group">
          ok {{ order.order_id }}

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['order'],
    data () {
      return {}
    }
  }
</script>
