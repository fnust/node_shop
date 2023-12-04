import bcrypt from 'bcrypt';

export async function hash(password) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);

  return await bcrypt.hash(password, salt);
}

export async function check(userPassword, password) {
  return await bcrypt.compare(password, userPassword);
}
