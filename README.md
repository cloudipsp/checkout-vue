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
  regular: {},
  params: {},
  popup: {},
  messages: {},
  validate: {}
}
```

### options
Name                  | Type        | Default                 | Description
---                   | ---         | ---                     | ---
`methods`             | Array       | ['card']                | support `card`, `emoney`, `ibank`, `cash`, `sepa`.
`ibank`               | Array       |                         | support `p24`, `platba24`, `raiffeisen`.
`emoney`              | Array       |                         | support `paypal`, `qiwi`, `webmoney`, `yamoney`.
`cash`                | Array       |                         | support `liqpay`.
`fast`                | Array       |                         | support .
`cardIcons`           | Array       | ['mastercard', 'visa']  | support `mastercard`, `visa`, `mir`, `prostir`, `diners-club`, `american-express`.
`fields`              | Boolean     | false                   |
`title`               | String      |                         |
`link`                | String      |                         | format url
`fullScreen`          | Boolean     | true                    |
`button`              | Boolean     | true                    |
`locales`             | Array       |                         | support `ru`, `en`, `uk`, `lv`, `fr`, `cs`, `sk`.
`email`               | Boolean     | false                   |
`tooltip`             | Boolean     | true                    |
`apiDomain`           | String      | 'api.fondy.eu'          |
`fee`                 | Boolean     | true                    |
`css`                 | String      |                         | support `bootstrap3`, `bootstrap4`, `foundation6`.

### popup
Name                  | Type        | Default                 | Description
---                   | ---         | ---                     | ---
`appendTo`            | String      | 'body'                  |

### regular
Name                  | Type        | Default                 | Description
---                   | ---         | ---                     | ---
`insert`              | Boolean     | false                   |
`open`                | Boolean     | false                   |
`hide`                | Boolean     | false                   |
`period`              | Array       | ['day', 'week', 'month', 'year']| support `day`, `week`, `month`, `year`.

### params
Name                  | Type        | Default                 | Description
---                   | ---         | ---                     | ---
`merchant_id`         | Integer     | 1396424                 |
`order_desc`          | String      |                         |
`amount`              | Integer     | 100                     |
`currency`            | String      | 'USD'                   |
`response_url`        | String      |                         | format url
`lang`                | String      | 'en'                    |
`required_rectoken`   | String      |                         | support `Y`, `N`, `y`, `n`.
`verification`        | String      |                         | support `Y`, `N`, `y`, `n`.
`verification_type`   | String      |                         | support `amount`, `code`
`email`               | String      |                         | format email
`token`               | String      |                         | length 40
`offer`               | Boolean     | false                   |
`recurring_data`      | Object      |                         |
`custom`              | Object      |                         |
`customer_data`       | Object      |                         |

#### recurring_data
Name                  | Type        | Default                 | Description
---                   | ---         | ---                     | ---
`every`               | Integer     | 1                       |
`period`              | String      | 'month'                 | support `day`, `week`, `month`, `year`.
`amount`              | Integer     | 100                     |
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



