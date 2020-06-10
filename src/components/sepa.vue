<template>
  <div class="f-sepa">
    <div v-t="'sepa_t'" />

    <input-text name="sender_name" validate="required|alpha" />
    <input-text name="sender_familyName" validate="required|alpha" />
    <div class="f-row">
      <div class="f-col-xs-6">
        <input-text name="bic" validate="required" placement="bottom" />
      </div>
      <div class="f-col-xs-6">
        <input-text name="iban" validate="required" />
      </div>
    </div>
  </div>
</template>
