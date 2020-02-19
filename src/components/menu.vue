<template>
  <div class="f-menu">
    <div v-t="'methods'" class="f-block-hr f-title f-hidden-mobile" />
    <div v-t="'methods_m'" class="f-block f-title3 f-visible-mobile" />
    <div class="f-block-hr">
      <template v-for="item in options.methods">
        <f-wallet-pay-button
          v-if="item === 'wallets'"
          :key="item"
          tab="wallets"
          position="bottom"
        >
          <template v-slot:default="{ open, classButton }">
            <div
              v-t="item"
              class="f-item"
              :class="['f-i-' + item]"
              @click="open"
            ></div>
            <div style="display: none" :class="classButton"></div>
          </template>
        </f-wallet-pay-button>
        <div
          v-else
          :key="item"
          v-t="item"
          class="f-item"
          :class="['f-i-' + item, { active: router.method === item }]"
          @click="$emit('on-change-method', item)"
        />
      </template>
    </div>
  </div>
</template>
