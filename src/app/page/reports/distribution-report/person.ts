export const person = {
  name: {
    label: 'Name',
    value: 'Juri',
    type: 'text',
    validation: {
      required: true
    }
  },
  age: {
    label: 'Age',
    value: 32,
    type: 'text'
  },
  gender: {
    label: 'Gender',
    value: 'M',
    type: 'radio',
    options: [
      { label: 'Male', value: 'M' },
      { label: 'Female', value: 'F' }
    ]
  },
  city: {
    label: 'City',
    value: '39010',
    type: 'select',
    options: [
      { label: '(choose one)', value: '' },
      { label: 'Bolzano', value: '39100' },
      { label: 'Meltina', value: '39010' },
      { label: 'Appiano', value: '39057' }
    ],
    validation: {
      required: true
    }
  },
  fromDate: {
    label: 'From date',
    value: '2019-03-29T00:00:00',
    type: 'data'
  },
  toDate: {
    label: 'To date',
    value: '',
    type: 'date'
  },
};