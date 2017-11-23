export default {
  state: {
    options: {
      methods: ['card'],
      ibank: [],
      emoney: [],
      cash: [],
      fast: [],
      cardIcons: ['mastercard', 'visa'],
      title: 'Test payment',
      regular: {
        insert: false
      },
      button: true,
      fullScreen: true
    },
    form: {
      // merchant_id: '1396424', // prod
      merchant_id: '900024', // dev
      amount: 100,
      fee: 0,
      amount_with_fee: 0,
      currency: 'UAH',
      recurring_data: {
        period: 'month',
        every: 1,
        start_time: '',
        end_time: '',
        amount: 100
      },
      card_number: '',
      expiry_date: '',
      cvv2: '',
      email: '',
      code: ''
    },
    error: {
      flag: false,
      buffer: false,
      code: '',
      message: ''
    },
    router: {
      page: undefined,
      method: undefined,
      system: undefined
    }
  },
  setOptions (options) {
    Object.assign(this.state.options, options)
    Object.assign(this.state.form, options.params)
    Object.assign(this.state.form.recurring_data, options.recurring_data)
    this.state.options.fast = this.fast()
    // console.log(this.state)
  },
  fast: function () {
    let fast = []
    this.state.options.fast.forEach(function (system) {
      ['emoney', 'ibank', 'cash'].forEach(function (method) {
        if (this.state.options[method].indexOf(system) > -1) {
          fast.push({
            method: method,
            system: system
          })
        }
      }, this)
    }, this)
    return fast
  }
}
