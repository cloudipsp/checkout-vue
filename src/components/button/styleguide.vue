<template>
  <div>
    <div>
      <template v-for="item in button">
        <f-button :key="item" :variant="item" :text="item" class="f-m-2" />
      </template>
    </div>
    <div>
      <template v-for="item in buttonLink">
        <f-button-link :key="item" :variant="item" class="f-m-2">{{
          item
        }}</f-button-link>
      </template>
    </div>
    <div>
      <template v-for="item in button">
        <f-button
          :key="item"
          :variant="item"
          :text="item"
          class="f-m-2"
          size="lg"
        />
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      button: ['default', 'secondary', 'outline', 'success'],
      buttonLink: ['default', 'secondary'],
    }
  },
}
</script>
