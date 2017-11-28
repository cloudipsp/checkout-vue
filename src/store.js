import css from '@/css'

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
      button: true,
      fullScreen: true,
      email: false,
      fields: false,
      link: '',
      offer: false
    },
    regular: {
      insert: false,
      open: false,
      hide: false,
      period: [
        {value: 'day', text: 'День'},
        {value: 'week', text: 'Неделя'},
        {value: 'month', text: 'Месяц'},
        {value: 'year', text: 'Год'}
      ]
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
    },
    css: {}
  },
  setOptions (options) {
    Object.assign(this.state.options, options)
    delete this.state.options.regular
    delete this.state.options.params
    delete this.state.options.recurring_data

    Object.assign(this.state.regular, options.regular)
    Object.assign(this.state.form, options.params)
    Object.assign(this.state.form.recurring_data, options.recurring_data)
    this.state.options.fast = this.fast()
    this.state.css = css[this.state.options.css] || css.default
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
