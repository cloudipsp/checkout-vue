<template>
  <svg
    aria-hidden="true"
    focusable="false"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="viewBox"
    :class="className">
    <path
      fill="currentColor"
      :d="d"
    >
    </path>
  </svg>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: null,
      validator: value =>
        [
          'lg',
          'xs',
          'sm',
          '1x',
          '2x',
          '3x',
          '4x',
          '5x',
          '6x',
          '7x',
          '8x',
          '9x',
          '10x',
        ].indexOf(value) > -1,
    },
    spin: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      icons: {
        redo: [
          512,
          512,
          16,
          'M492 8h-10c-6.627 0-12 5.373-12 12v110.625C426.804 57.047 346.761 7.715 255.207 8.001 118.82 8.428 7.787 120.009 8 256.396 8.214 393.181 119.166 504 256 504c63.926 0 122.202-24.187 166.178-63.908 5.113-4.618 5.354-12.561.482-17.433l-7.069-7.069c-4.503-4.503-11.749-4.714-16.482-.454C361.218 449.238 311.065 470 256 470c-117.744 0-214-95.331-214-214 0-117.744 95.331-214 214-214 82.862 0 154.737 47.077 190.289 116H332c-6.627 0-12 5.373-12 12v10c0 6.627 5.373 12 12 12h160c6.627 0 12-5.373 12-12V20c0-6.627-5.373-12-12-12z',
        ],
      },
    }
  },
  computed: {
    icon() {
      return this.icons[this.name]
    },
    d() {
      return this.icon[3]
    },
    className() {
      return [
        'f-svg',
        `f-svg-${this.name}`,
        `f-svg-w-${this.icon[2]}`,
        `f-svg-${this.size}`,
        {
          'f-svg-spin': this.spin,
        },
      ]
    },
    viewBox() {
      return `0 0 ${this.icon[0]} ${this.icon[1]}`
    },
  },
}
</script>
<style lang="less">
.f-svg {
  display: inline-block;
  font-size: inherit;
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
}

.f-svg-w-18 {
  width: 1.125em;
}
.f-svg-w-16 {
  width: 1em;
}
.f-svg-w-14 {
  width: 0.875em;
}
.f-svg-w-12 {
  width: 0.75em;
}
.f-svg-3x {
  font-size: 3em;
}
.f-svg-4x {
  font-size: 4em;
}
.f-svg-spin {
  animation: f-svg-spin 2s infinite linear;
}

@keyframes f-svg-spin {
  0% {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(1turn);
  }
}
</style>
