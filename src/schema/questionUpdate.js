export default {
  type: 'Object',
  properties: {
    text: {
      type: 'string',
      required: false,
      minLength: 1,
    },
    categoryId: {
      type: 'number',
      required: false,
    },
    answers: {
      type: 'array',
      minItems: 1,
      required: false,
      items: {
        $ref: '/Answer',
      },
    }
  },
};
