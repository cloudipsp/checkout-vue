<template>
  <div :class="$style.wrapper">
    <slot />
  </div>
</template>

<style lang="scss" module>
.wrapper {
  padding: px-to-rem(12px);
  background-color: $box_bg;
  border-radius: px-to-rem(8px);
}
</style>
