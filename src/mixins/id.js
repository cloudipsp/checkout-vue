export default {
  data() {
    return {
      id: null,
    }
  },
  mounted() {
    this.id = `f-${this._uid}`
  },
}
