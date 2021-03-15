# checkout-vue

>

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

### config
``` js
{
  options: {},
  params: {},
  messages: {},
  validate: {},
  css_variable: {},
}
```

### options
Name                  | Type        | Default                 | Description                                                                         | Priority
---                   | ---         | ---                     | ---                                                                                 | ---
`methods`             | Array       | ['card']                | support `card`, `sepa`, `banklinks_eu`, `receipt`.                                  |
`methods_disabled`    | Array       | []                      | support `card`, `sepa`, `banklinks_eu`, `receipt`.                                  |
`card_icons`          | Array       | ['mastercard', 'visa']  | support `mastercard`, `visa`, `mir`, `prostir`, `diners`, `american_express` , `jcb`, `maestro`, `union_pay`.|
`banklinks_eu_icons`  | Array       | []                      |                                                                                     |
`local_methods_icons` | Array       | []                      |                                                                                     |
`title`               | String      |                         |                                                                                     | options or server
`link`                | String      |                         | format url                                                                          | server or options
`full_screen`         | Boolean     | true                    |                                                                                     |
`locales`             | Array       | [all]                   | support `cs`, `de`, `en`, `es`, `fr`, `hu`, `it`, `ko`, `lv`, `pl`, `ro`, `ru`, `sk`, `uk`.|
`api_domain`          | String      | 'api.fondy.eu'          |                                                                                     |
`endpoint`            | Object      |                         |                                                                                     |
`active_tab`          | String      | 'card'                  | support `card`, `sepa`.                                                             | server or options
`logo_url`            | String      |                         | format url                                                                          | options or server
`offerta_url`         | String      |                         | format url                                                                          | options or server
`button`              | Boolean     | true                    |                                                                                     |
`fee`                 | Boolean     | false                   |                                                                                     |
`email`               | Boolean     | false                   |                                                                                     | server or options
`fields`              | Boolean     | false                   |                                                                                     |
`default_country`     | String      |                         |                                                                                     |
`countries`           | Array       |                         |                                                                                     |
`lang`                | Boolean     | true                    |                                                                                     |
`theme`               | Object      |                         |                                                                                     |
`show_menu_first`     | Boolean     | false                   |                                                                                     |
`disable_request`     | Boolean     | false                   | no requests are sent to the server                                                  |
`show_button_amount`  | Boolean     | true                    | displaying the amount on the button                                                 |
`subscription`        | Object      |                         |                                                                                     |
`loading`             | String      |                         | format url                                                                                   |

### options.endpoint
Name                  | Type        | Default                                 | Description
---                   | ---         | ---                                     | ---
`gateway`             | String      | '/latest/checkout-v2/index.html'        |
`button`              | String      | '/latest/checkout-v2/button/index.html' |

### options.theme
Name                  | Type        | Default                 | Description
---                   | ---         | ---                     | ---
`type`                | String      | 'light'                 | support `light`, `dark`.
`preset`              | String      | 'black'                 | support `reset`, `black`, `silver`, `vibrant_silver`, `vibrant_gold`, `solid_black`, `black_and_white`, `euphoric_pink`, `heated_steel`, `nude_pink`, `tropical_gold`, `navy_shimmer`.

### options.subscription
Name                  | Type        | Default                 | Description
---                   | ---         | ---                     | ---
`type`                | String      | 'disable'               | support `disable`, `hidden`, `shown_edit_on`, `shown_edit_off`, `shown_readonly`
`periods`             | Array       | ['day', 'week', 'month']| support `day`, `week`, `month`.
`quantity`            | Boolean     | false                   |
`trial`               | Boolean     | false                   |
`unlimited`           | Boolean     | true                    |
`readonly`            | Boolean     | false                   |

### params
Name                  | Type        | Default                 | Description                 | Priority
---                   | ---         | ---                     | ---                         | ---
`merchant_id`         | Integer     | 1396424                 |                             |
`order_desc`          | String      |                         |                             | options or server
`amount`              | Integer     | 0                       |                             |
`currency`            | String      | 'USD'                   |                             |
`response_url`        | String      |                         | format url                  |
`lang`                | String      | browser language        |                             | server or options
`required_rectoken`   | String      |                         | support `Y`, `N`, `y`, `n`. |
`verification`        | String      |                         | support `Y`, `N`, `y`, `n`. |
`verification_type`   | String      |                         | support `amount`, `code`    |
`token`               | String      |                         | length 40                   |
`button`              | String      |                         | length 20-80                |
`offer`               | Boolean     | false                   |                             |
`recurring_data`      | Object      |                         |                             |
`custom`              | Object      |                         |                             |
`customer_data`       | Object      |                         |                             |

#### params.recurring_data
Name                  | Type        | Default                 | Description
---                   | ---         | ---                     | ---
`every`               | Integer     | 1                       |
`period`              | String      | 'month'                 | support `day`, `week`, `month`.
`amount`              | Integer     | 0                       |
`end_time`            | String      |                         | format YYYY-MM-DD
`start_time`          | String      |                         | format YYYY-MM-DD
`quantity`            | Integer     | 0                       |
`trial_period`        | String      | ''                      |
`trial_quantity`      | Integer     | 0                       |

#### params.customer_data
Name                  | Type        | Default                 | Description
---                   | ---         | ---                     | ---
`customer_name`       | String      |                         |
`customer_address`    | String      |                         |
`customer_zip`        | String      |                         |
`customer_city`       | String      |                         |
`customer_country`    | String      |                         | dictionary countries
`customer_state`      | String      |                         |
`phonemobile`         | String      |                         | format phone
`email`               | String      |                         | format email

### messages
``` js
{
  messages: {
    {en}: {
      {id}: {value},
      ...
    },
    ...
  },
}
```

### validate
``` js
{
  validate: {
    {en}: {
      {id}: {value},
      ...
    },
    ...
  },
}
```

## Use
``` js
var app = fondy({css selector}, {config})

app.$on('success', function(model) {})
app.$on('error', function(model) {})
app.$on('ready', function(model) {})
app.$on('callback', function(model) {})
app.$on('show-pay', function(model) {})

app.submit()

app.location({method}, {system})

app.setParams({params})

app.$destroy()
```
full_screen: true - add css

## Use validate

https://vee-validate.logaretm.com/v3/guide/rules.html#rules

support `after`, `alpha`, `date_format`, `decimal`, `digits`, `email`, `max`, `min`, `numeric`, `required`, `customer_field`, `phone`, `numrange`, `ccard`

``` html
<input-text name="email" validate="required|email"></input-text>
```

