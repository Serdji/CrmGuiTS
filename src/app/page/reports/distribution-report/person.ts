export const person = {
  name: {
    placeholder: 'Name',
    value: 'Juri',
    type: 'text',
    validation: {
      required: true
    }
  },
  age: {
    placeholder: 'Age',
    value: 32,
    type: 'text'
  },
  gender: {
    placeholder: 'Gender',
    value: 'M',
    type: 'radio',
    options: [
      { placeholder: 'Male', value: 'M' },
      { placeholder: 'Female', value: 'F' }
    ]
  },
  city: {
    placeholder: 'City',
    value: '39010',
    type: 'select',
    options: [
      { placeholder: '(choose one)', value: '' },
      { placeholder: 'Bolzano', value: '39100' },
      { placeholder: 'Meltina', value: '39010' },
      { placeholder: 'Appiano', value: '39057' }
    ],
    validation: {
      required: true
    }
  },
  fromDate: {
    placeholder: 'From date',
    value: '2019-03-29T00:00:00',
    type: 'date'
  },
  toDate: {
    placeholder: 'To date',
    value: '',
    type: 'date'
  },
  1: {
    placeholder: 'Чтение',
    value: true,
    type: 'checkbox'
  },
  2: {
    placeholder: 'Изменения',
    value: false,
    type: 'checkbox'
  },
  name2: {
    placeholder: 'Name',
    value: 'Bob',
    type: 'text',
    validation: {
      required: true
    }
  },
};