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
}
</style>
