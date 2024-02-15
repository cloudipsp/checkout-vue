import { loadUuid } from '@/import'
import { loadScript } from '@/utils/load-script'
import { memoizePromise } from '@/utils/memoize-promise'
import { captureMessage } from '@/sentry'

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
  console.log(clickToPay, name, response)
}

const onMessage = name => response => {
  logMessage(name, response)

  return response
}

const onError = name => response => {
  const reason = response?.error?.reason || error
  const message = `${clickToPay} ${name} ${reason}`

  console.warn(message, response)
  captureMessage(message, 'warning', response)
  return Promise.reject(`c2p_${reason.toLowerCase()}`)
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

  return vSrc
    .init({
      srcInitiatorId: 'F1YE52EO4MYO4QP2PBZ221FginRx2_y-ItVkzEaCdkXQQf51E',
      srciDpaId: 'FondyDPA-FondySRC',
      srciTransactionId,
      dpaTransactionOptions: {
        customInputData: {
          checkoutOrchestrator: 'merchant',
        },
      },
    })
    .then(response => {
      const reason = Object.keys(response)
      if (reason.length) {
        return Promise.reject({ error: { reason } })
      } else {
        logMessage(initText)
      }
    })
    .catch(onError(initText))
})

const isRecognizedMemoize = memoizePromise(() =>
  vSrc
    .isRecognized()
    .then(onMessage(isRecognizedText))
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
    .catch(onError(`${identityLookupEmailText} ${identityValue}`))
)

export const checkout = input => {
  input = {
    srciTransactionId,
    ...input,
  }
  logMessage(checkoutText, input)

  return (
    vSrc
      .checkout(input)
      .then(onMessage(checkoutText))
      // $t('c2p_card_missing')
      // $t('c2p_invalid_parameter')
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
    recognized ? Promise.reject('noRecognized') : Promise.resolve()
  )

const noIdentityLookupEmail = email =>
  identityLookupEmailMemoize(email).then(({ consumerPresent }) =>
    consumerPresent
      ? Promise.reject('noIdentityLookupEmail')
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
    .then(() => noRecognized())
    .then(() => noIdentityLookupEmail(email))
