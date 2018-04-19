const userSchema = {
  type: 'Object',
  properties: {
    username: {
      type: 'string',
      required: true,
    },
    name: {
      type: 'string',
      required: true,
    },
    password: {
      type: 'string',
      required: true,
    },
    confirmPassword: {
      type: 'string',
      required: true,
    }
  },
}

export { userSchema };
