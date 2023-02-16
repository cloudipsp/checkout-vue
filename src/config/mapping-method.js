let mapping = {
  trustly: 'banklinks_eu',
}

export const mappingMethod = item => mapping[item] || item
