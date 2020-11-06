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
`css`                 | String      |                         | support `bootstrap3`, `bootstrap4`, `foundation6`.                                  |
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
`show_menu_first`     | Boolean     | true                    |                                                                                     |
`disable_request`     | Boolean     | false                   | no requests are sent to the server                                                  |
`show_button_amount`  | Boolean     | true                    | displaying the amount on the button                                                 |
`subscription`        | Object      |                         |                                                                                     |

### endpoint
Name                  | Type        | Default                                 | Description
---                   | ---         | ---                                     | ---
`gateway`             | String      | '/latest/checkout-v2/index.html'        |
`button`              | String      | '/latest/checkout-v2/button/index.html' |

### theme
Name                  | Type        | Default                 | Description
---                   | ---         | ---                     | ---
`type`                | String      | 'light'                 | support `light`, `dark`.
`preset`              | String      | 'black'                 | support `reset`, `black`, `silver`, `vibrant_silver`, `vibrant_gold`, `solid_black`, `black_and_white`, `euphoric_pink`, `heated_steel`, `nude_pink`, `tropical_gold`, `navy_shimmer`.

### subscription
Name                  | Type        | Default                 | Description
---                   | ---         | ---                     | ---
`type`                | String      | 'disable'               | support ``, ``, ``, ``, ``
`period`              | Array       | ['day', 'week', 'month']| support `day`, `week`, `month`.

### params
Name                  | Type        | Default                 | Description                 | Priority
---                   | ---         | ---                     | ---                         | ---
`merchant_id`         | Integer     | 1396424                 |                             |
`order_desc`          | String      |                         |                             | options or server
`amount`              | Integer     | 0                       |                             |
`currency`            | String      | 'USD'                   |                             |
`response_url`        | String      |                         | format url                  |
`lang`                | String      | 'en'                    |                             | server or options
`required_rectoken`   | String      |                         | support `Y`, `N`, `y`, `n`. |
`verification`        | String      |                         | support `Y`, `N`, `y`, `n`. |
`verification_type`   | String      |                         | support `amount`, `code`    |
`token`               | String      |                         | length 40                   |
`offer`               | Boolean     | false                   |                             |
`recurring_data`      | Object      |                         |                             |
`custom`              | Object      |                         |                             |
`customer_data`       | Object      |                         |                             |

#### recurring_data
Name                  | Type        | Default                 | Description
---                   | ---         | ---                     | ---
`every`               | Integer     | 1                       |
`period`              | String      | 'month'                 | support `day`, `week`, `month`.
`amount`              | Integer     | 0                       |
`end_time`            | String      |                         | format YYYY-MM-DD
`start_time`          | String      |                         | format YYYY-MM-DD

#### customer_data
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

app.submit()
app.$emit('submit')

app.location({method}, {system})
app.$emit('location', {method}, {system}) method support `card`, `sepa`, `banklinks_eu`

app.setParams({params})
app.$emit('setParams', {params})

app.$destroy()
```
full_screen: true - add css

## Use validate

https://github.com/baianat/vee-validate/blob/master/locale/en.js
https://baianat.github.io/vee-validate/guide/rules.html

support `after`, `alpha`, `date_format`, `decimal`, `digits`, `email`, `max`, `min`, `numeric`, `required`, `customer_field`, `phone`, `numrange`, `ccard`

``` html
<input-text name="email" validate="required|email"></input-text>
```

