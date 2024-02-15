import { loadUuid } from '@/import'
import { loadScript } from '@/utils/load-script'
import { memoizePromise } from '@/utils/memoize-promise'
import { captureMessage } from '@/sentry'
import { i18n } from '@/i18n/index'
import { sessionStorage } from '@/utils/store'

// Standard Error Codes
// $t('c2p_unknown_error')
// $t('c2p_request_timeout')
// $t('c2p_server_error')
// $t('c2p_invalid_parameter')
// $t('c2p_invalid_request')
// $t('c2p_auth_error')
// $t('c2p_not_found')
// $t('c2p_rate_limit_exceeded')
// $t('c2p_service_error')

let vSrcAdapter
let vSrc
let srciTransactionId

const clickToPay = 'Click to Pay'
const sdkLoad = 'sdk load'
const error = 'error'
const createTransactionIdText = 'createTransactionId'
const initText = 'init'
const isRecognizedText = 'isRecognized'
const identityLookupEmailText = 'identityLookupEmail'
const checkoutText = 'checkout'

const logMessage = (name, response = 'ok') => {
  console.log(clickToPay, name, JSON.stringify(response, null, 2))
}

const onMessage = name => response => {
  logMessage(`response ${name}`, response)

  return response
}

const onError = name => response => {
  const reason = response?.error?.reason || error
  const message = `${clickToPay} ${name} ${reason}`

  console.warn(message, JSON.stringify(response, null, 2))
  captureMessage(message, 'warning', response)
  return Promise.reject(`c2p_${reason.replace(/ /g, '_').toLowerCase()}`)
}

const loadMemoize = memoizePromise(() =>
  loadScript(C2P_SDK).then(onMessage(sdkLoad)).catch(onError(sdkLoad))
)

const createTransactionIdMemoize = memoizePromise(() =>
  loadUuid()
    .then(({ v4 }) => (srciTransactionId = v4()))
    .then(onMessage(createTransactionIdText))
    .catch(onError(createTransactionIdText))
)

const initMemoize = memoizePromise(() => {
  vSrcAdapter = window.vAdapters.VisaSRCI
  vSrc = new vSrcAdapter()

  const initData = {
    srcInitiatorId: C2P_SRC_INITIATOR_ID,
    srciDpaId: C2P_SRCI_DPA_ID,
    srciTransactionId,
    dpaTransactionOptions: {
      paymentOptions: {
        dynamicDataType: 'TAVV',
        dpaPanRequested: false,
      },
      payloadTypeIndicator: 'PAYMENT',
      customInputData: {
        checkoutOrchestrator: 'merchant',
      },
    },
  }

  logMessage(initText, initData)

  return (
    vSrc
      .init(initData)
      .then(response => {
        const reason = Object.keys(response)
        if (reason.length) {
          return Promise.reject({ error: { reason } })
        }
        return response
      })
      .then(onMessage(initText))
      // $t('c2p_srci_id_missing')
      // $t('c2p_dpa_id_missing')
      // $t('c2p_srci_txn_id_missing')
      .catch(onError(initText))
  )
})

const isRecognizedMemoize = memoizePromise(() =>
  vSrc
    .isRecognized()
    .then(onMessage(isRecognizedText))
    // $t('c2p_acct_inaccessible')
    .catch(onError(isRecognizedText))
)

const identityLookupEmailMemoize = memoizePromise(identityValue =>
  vSrc
    .identityLookup({
      identityProvider: 'SRC',
      identityValue,
      type: 'EMAIL',
    })
    .then(onMessage(`${identityLookupEmailText} ${identityValue}`))
    // $t('c2p_fraud')
    // $t('c2p_id_format_unsupported')
    // $t('c2p_consumer_id_missing')
    // $t('c2p_acct_inaccessible')
    .catch(onError(`${identityLookupEmailText} ${identityValue}`))
)

export const checkout = input => {
  input = getCheckoutSettings(input)
  logMessage(checkoutText, input)

  return (
    vSrc
      .checkout(input)
      .then(onMessage(checkoutText))
      // $t('c2p_risk_decision')
      // $t('c2p_card_missing')
      // $t('c2p_card_add_failed')
      // $t('c2p_card_security_code_missing')
      // $t('c2p_card_invalid')
      // $t('c2p_card_exp_invalid')
      // $t('c2p_cardid_missing')
      // $t('c2p_card_not_recognized')
      // $t('c2p_acct_inaccessible')
      // $t('c2p_merchant_data_invalid')
      // $t('c2p_unable_to_connect')
      // $t('c2p_auth_invalid')
      // $t('c2p_terms_and_conditions_not_accepted')
      .catch(onError(checkoutText))
  )
}

const noRecognized = () =>
  isRecognizedMemoize().then(({ recognized }) =>
    recognized ? Promise.reject('is recognized') : Promise.resolve()
  )

const noIdentityLookupEmail = email => () =>
  identityLookupEmailMemoize(email).then(({ consumerPresent }) =>
    consumerPresent
      ? Promise.reject('is identityLookupEmail')
      : Promise.resolve()
  )

export const initClick2pay = () =>
  loadMemoize()
    .then(() => createTransactionIdMemoize())
    .then(() => initMemoize())
    .then(() => isRecognizedMemoize())

export const needRegistration = email =>
  loadMemoize()
    .then(() => createTransactionIdMemoize())
    .then(() => initMemoize())
    .then(noRecognized)
    .then(noIdentityLookupEmail(email))

export const setRememberMe = value => sessionStorage.set('rememberMe', value)

export const getRememberMe = () => !!sessionStorage.get('rememberMe')

export const complianceSettings = () => {
  let complianceResources = [
    {
      complianceType: 'TERMS_AND_CONDITIONS',
      uri: i18n.t('c2p_terms_url'),
    },
    {
      complianceType: 'PRIVACY_POLICY',
      uri: i18n.t('c2p_privacy_notice_url'),
    },
  ]
  if (getRememberMe()) {
    complianceResources.push({
      complianceType: 'REMEMBER_ME',
      uri: 'visa.checkout.com/privacy',
    })
  }
  return {
    complianceResources,
  }
}

export const getCheckoutSettings = input => ({
  srciTransactionId,
  dpaTransactionOptions: {
    customInputData: {
      checkoutOrchestrator: 'merchant',
    },
  },
  complianceSettings: complianceSettings(),
  ...input,
})
