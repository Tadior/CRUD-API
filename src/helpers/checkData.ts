const checkName = (error: string[], user: Record<string, string>) => {
  if (!user.username) error.push('please input username');
  else if (typeof user.username !== 'string') error.push(`the username field is't valid`);
};

const checkAge = (error: string[], user: Record<string, string>) => {
  if (!user.age) {
    error.push('please input age');
  } else if (typeof user.age !== 'number') error.push(`the age field is't valid`);
};

const checkField = (error: string[], user: Record<string, string>) => {
  const fields = ['username', 'age', 'hobbies'];
  let count = 0;
  const noValidField = [];
  for (const item of Object.keys(user)) {
    fields.includes(item) ? count++ : noValidField.push(item);
  }
  noValidField.length > 0 && error.push(`this fields is no valid: ${noValidField.join(', ')}`);
  count < 1 && error.push(`there are no valid values`);
};

const checkHobbies = (error: string[], user: Record<string, string>) => {
  if (!user.hobbies) {
    error.push('please input hobbies');
    return;
  }
  if (!Array.isArray(user.hobbies)) {
    error.push('the hobbies field is not valid');
    return;
  } else {
    const newErrors = [];
    user.hobbies.forEach((field) => {
      if (typeof field !== 'string') {
        newErrors.push(field);
      }
    });
    if (newErrors.length > 0) {
      error.push('the hobbies field is not valid');
    }
  }
};

export const checkCreated = (user: Record<string, string>): string[] => {
  const error: string[] = [];
  checkName(error, user);
  checkAge(error, user);
  checkHobbies(error, user);
  checkField(error, user);
  return Array.from(new Set(error));
};

export const checkUpdated = (user: Record<string, string>): string[] => {
  const error: string[] = [];
  user.username && checkName(error, user);
  user.age && checkAge(error, user);
  user.hobbies && checkHobbies(error, user);
  checkField(error, user);
  return Array.from(new Set(error));
};
