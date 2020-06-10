export default {
  data() {
    return {
      id: null,
    }
  },
  mounted() {
    this.id = String(this._uid)
  },
}
