<template>
  <button :class="$style.style" type="button" v-on="$listeners">
    <slot />
  </button>
</template>

<style lang="scss" module>
.style {
  padding: 0;
  margin: 0;
  overflow: initial;
  font: inherit;
  line-height: inherit;
  color: inherit;
  text-align: initial;
  vertical-align: initial;
  cursor: pointer;
  background: none;
  border: 0;
  border-radius: px-to-rem(4px);

  &:focus-visible {
    outline: 0;
    box-shadow: 0 0 0 px-to-rem(2px) $outline_border;
  }
}
</style>
