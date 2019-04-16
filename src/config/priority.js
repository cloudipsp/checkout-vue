// 'user' 'server' 'default' 'state'
export default {
  options: {
    link: ['server', 'state'],
    email: ['server', 'state'],
    title: ['state', 'server'],
    logo_url: ['state', 'server'],
    offerta_url: ['state', 'server'],
    customer_fields: ['server', 'default'],
    // methods: [],
  },
  params: {
    lang: ['server', 'state'],
    order_desc: ['state', 'server'],
    fee: ['server', 'default'],
    amount: ['server', 'state'],
    currency: ['server', 'state'],
    merchant_id: ['server', 'state'],
    email: ['server', 'state'],
    order_id: ['server', 'state'],
    card_number: ['server', 'state'],
    expiry_date: ['server', 'state'],
    recurring_data: {
      amount: ['server', 'state'],
    },
  },
  regular: {
    // insert: [],
  },
}
