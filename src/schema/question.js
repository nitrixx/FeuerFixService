export default {
  type: 'Object',
  properties: {
    text: {
      type: 'string',
      required: true,
      minLength: 1,
    },
    categoryId: {
      type: 'number',
      required: true,
    },
    answers: {
      type: 'array',
      minItems: 1,
      required: true,
      items: {
        $ref: '/Answer',
      },
    }
  },
};
