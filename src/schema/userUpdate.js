export default {
  type: 'Object',
  properties: {
    username: {
      type: 'string',
      required: false,
    },
    name: {
      type: 'string',
      required: false,
    },
    isEnabled: {
      type: 'boolean',
      required: false,
    },
    newPassword: {
      type: 'string',
      required: false,
    },
    confirmPassword: {
      type: 'string',
      required: false,
    }
  },
};
