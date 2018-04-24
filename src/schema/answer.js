export default {
  id: '/Answer',
  type: 'Object',
  properties: {
    text: {
      type: 'string',
      required: true,
      minLength: 1,
    },
    isCorrect: {
      type: 'boolean',
      required: true,
    },
  },
};
