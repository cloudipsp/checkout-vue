const { UAHmerchant } = require('../config/merchant')
const { approved_3ds } = require('../config/card')

module.exports = [
  [
    {
      options: {
        api_domain: 'api.dev.fondy.eu',
      },
      params: {
        ...UAHmerchant,
        amount: 100,
        email: 'test@test.test',
      },
    },
    {
      ...approved_3ds,
    },
  ],
]
