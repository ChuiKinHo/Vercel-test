import bcrypt from "bcrypt";

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
};

export default hashPassword;