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
    newPassword: {
      type: 'string',
      required: false,
      minLength: 1,
    },
    confirmPassword: {
      type: 'string',
      required: false,
      minLength: 1,
    }
  },
};
