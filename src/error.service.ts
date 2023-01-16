export const ErrorMessage = {
  notUserId: (parameter: string) => ({ error: `User with such id isn't found: ${parameter}` }),
  notValidId: (parameter: string) => ({ error: `this Id: ${parameter} is't valid` }),
  failed: (method: 'create' | 'update') => ({ error: `failed to ${method} user` }),
  notFound: { error: 'Not Found' },
  notID: { message: `id not specified` },
};
