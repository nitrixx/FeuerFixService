export default {
  type: 'Object',
  properties: {
    text: {
      type: 'string',
      required: false,
      minLength: 1,
    },
    isCorrect: {
      type: 'boolean',
      required: false,
    },
    questionId: {
      type: 'number',
      required: false,
    }
  },
};
