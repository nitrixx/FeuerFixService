export default {
  type: 'Object',
  properties: {
    username: {
      type: 'string',
      required: true,
      minLength: 1,
    },
    name: {
      type: 'string',
      required: true,
      minLength: 1,
    },
    password: {
      type: 'string',
      required: true,
      minLength: 1,
    },
    confirmPassword: {
      type: 'string',
      required: true,
      minLength: 1,
    }
  },
};
