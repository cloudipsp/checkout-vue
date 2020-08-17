export default {
  data() {
    return {
      id: null,
    }
  },
  mounted() {
    this.id = 'fondy-' + String(this._uid)
  },
}
