import { createDate, format } from '@/utils/date'

const option = {
  expiry_date: format(createDate(), 'MM/YY'),
  cvv2: '111',
}

export const testCardNumbers = [
  {
    ...option,
    card_number: '4444555566661111',
    protocol: '3ds',
    type: 'approved',
  },
  {
    ...option,
    card_number: '5555666644441111',
    protocol: '3ds',
    type: 'approved',
  },
  {
    ...option,
    card_number: '6666444455551111',
    protocol: '3ds',
    type: 'approved',
  },
  {
    ...option,
    card_number: '4444555566669999',
    protocol: '3ds',
    type: 'approved',
  },
  {
    ...option,
    card_number: '4444666655559999',
    protocol: '3ds',
    type: 'approved',
  },
  {
    ...option,
    card_number: '4444111166665555',
    protocol: '3ds',
    type: 'declined',
  },
  {
    ...option,
    card_number: '4444555511116666',
    protocol: '2ds',
    type: 'approved',
  },
  {
    ...option,
    card_number: '4444111155556666',
    protocol: '2ds',
    type: 'declined',
  },
]
