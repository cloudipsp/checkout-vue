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
  recurring: {},
  params: {},
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
`css`                 | Boolean     | true                    | support `bootstrap3`, `bootstrap4`, `foundation6`.

### regular
Name                  | Type        | Default                 | Description
---                   | ---         | ---                     | ---
`insert`              | Boolean     | false                   |
`open`                | Boolean     | false                   |
`hide`                | Boolean     | false                   |
`period`              | Array       |                         | support `day`, `week`, `month`, `year`.

### recurring
Name                  | Type        | Default                 | Description
---                   | ---         | ---                     | ---
`every`               | Integer     | 1                       |
`period`              | String      | 'month'                 | support `day`, `week`, `month`, `year`.
`amount`              | Integer     | 100                     |
`end_time`            | String      |                         | format YYYY-MM-DD'
`start_time`          | String      |                         | format YYYY-MM-DD'

### params
Name                  | Type        | Default                 | Description
---                   | ---         | ---                     | ---
`merchant_id`         | Integer     | 1396424                 |
`order_desc`          |       |                        |
`amount`              |       |                        |
`currency`            |       |                        |
`response_url`        |       |                        |
`lang`                |       |                        |
`required_rectoken`   |       |                        |
`verification`        |       |                        |
`verification_type`   |       |                        |
`email`               |       |                        |
`token`               |       |                        |
`offer`               |       |                        |


