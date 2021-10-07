import { loadAxios } from '@/import'

let api = 'https://api.novaposhta.ua/v2.0/json/'
let apiKey = '9d591caced5f8d4bd2f7f72061d524d3'
let Limit = 10

export const cityCompany = value => {
  return loadAxios().then(axios =>
    axios.post(api, {
      apiKey,
      modelName: 'Address',
      calledMethod: 'getCities',
      methodProperties: {
        FindByString: value,
        Limit,
      },
    })
  )
}

export const streetCompany = (ref, value) => {
  return loadAxios().then(axios =>
    axios.post(api, {
      apiKey,
      modelName: 'Address',
      calledMethod: 'getStreet',
      methodProperties: {
        CityRef: ref,
        FindByString: value,
        Limit,
      },
    })
  )
}

export const cityDepartment = value => {
  return loadAxios().then(axios =>
    axios.post(api, {
      apiKey,
      modelName: 'AddressGeneral',
      calledMethod: 'getSettlements',
      methodProperties: {
        FindByString: value,
        Limit,
      },
    })
  )
}

export const streetDepartment = (ref, value) => {
  return loadAxios().then(axios =>
    axios.post(api, {
      apiKey,
      modelName: 'AddressGeneral',
      calledMethod: 'getWarehouses',
      methodProperties: {
        SettlementRef: ref,
        FindByString: value,
        Limit,
      },
    })
  )
}
