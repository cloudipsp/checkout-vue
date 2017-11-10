export default {
  state: {
    form: {
      // merchant_id: '1396424', // prod
      merchant_id: '900024', // dev
      fee: 0,
      currency: 'UAH',
      amount: '1',
      recurring_data: {},
      card_number: '',
      expiry_date: '',
      cvv2: '',
      email: '',
      amount_with_fee: 0
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
