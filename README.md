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

### options
Name                  | Type        | Default                 | Description
----------------      | ----------  | --------                | -----------------------
`methods`             | Array       | ['card']                | support `card`, `emoney`, `ibank`, `cash`, `sepa`.
`ibank`               | Array       |                         | support `p24`, `platba24`, `raiffeisen`.
`emoney`              | Array       |                         | support `paypal`, `qiwi`, `webmoney`, `yamoney`.
`cash`                | Array       |                         | support `liqpay`.
`fast`                | Array       |                         | support .
`cardIcons`           | Array       | ['mastercard', 'visa']  | support `mastercard`, `visa`, `mir`, `prostir`, `diners-club`, `american-express`.
`fields`              | Boolean     | false                   |
`title`               | String      |                         |
`link`                | String/Url  |                         |
`fullScreen`          | Boolean     | true                    |
`button`              | Boolean     | true                    |
`locales`             | Array       |                         | support `ru`, `en`, `uk`, `lv`, `fr`, `cs`, `sk`.
`email`               | Boolean     | false                   |
`tooltip`             | Boolean     | true                    |
`apiDomain`           | String      | 'api.fondy.eu'          |
`fee`                 | Boolean     | true                    |
`css`                 | Boolean     | true                    | support `bootstrap3`, `bootstrap4`, `foundation6`.
