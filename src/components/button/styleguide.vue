<template>
  <div>
    <div>
      <template v-for="item in button">
        <f-button :key="item" :variant="item" :text="item" class="f-m-8" />
      </template>
    </div>
    <div>
      <template v-for="item in buttonLink">
        <f-button-link :key="item" :variant="item" class="f-m-8">{{
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
          class="f-m-8"
          size="lg"
        />
      </template>
    </div>
  </div>
</template>

<script>
import FButtonLink from '@/components/button/button-link'
import FButton from '@/components/button/button'

export default {
  components: {
    FButtonLink,
    FButton,
  },
  data() {
    return {
      button: ['default', 'secondary', 'outline', 'success'],
      buttonLink: ['default', 'secondary'],
    }
  },
}
</script>
