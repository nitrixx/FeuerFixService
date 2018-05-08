export default {
  type: 'Object',
  properties: {
    username: {
      type: 'string',
      required: false,
      minLength: 1,
    },
    name: {
      type: 'string',
      required: false,
      minLength: 1,
    },
    isEnabled: {
      type: 'boolean',
      required: false,
    },
    isAdmin: {
      type: 'boolean',
      required: false,
    },
    password: {
      type: 'string',
      required: false,
      minLength: 1,
    }
  },
};
