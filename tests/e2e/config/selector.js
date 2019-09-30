module.exports = {
  $root: '#f',
  $card_number: '#f-card_number',
  $expiry_date: '#f-expiry_date',
  $cvv2: '#f-cvv2',
  $code: '#f-code',
  $submit: '.f-pay-button [type="button"]',
  $error: '.f-popover-error',
  $status_approved: '[data-e2e-status=approved]',
  $is_ready: '[data-e2e-ready]',

  $3ds: '.ipsp-modal-iframe',
  $3ds_submit: '[type="submit"]',

  $tp_merchant_id: '#merchant_id',
  $tp_currency: '#currency',
  $tp_amount: '#amount',
  $tp_submit: '[type="submit"]',
  $tp_verification: '#verification',
  $tp_verification_type: '#verification_type',
  $tp_required_rectoken: '#required_rectoken',
  $tp_rectoken: '#rectoken',

  $tr_root: '#table_response',
  $tr_rectoken: '.field_rectoken .value',
  $tr_status: '.field_order_status .value',

  $root_checkout_v1: '.pages-checkout',
}
