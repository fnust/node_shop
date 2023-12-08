import bcrypt from 'bcrypt';

export async function hash(password: string): Promise<string> {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);

  return await bcrypt.hash(password, salt);
}

export async function check(
  userPassword: string,
  password: string
): Promise<Boolean> {
  return await bcrypt.compare(password, userPassword);
}
