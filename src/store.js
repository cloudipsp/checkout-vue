export default {
  state: {
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
    }
  }
  // setOptions (options) {
  //   this.state.options = options
  // }
}
