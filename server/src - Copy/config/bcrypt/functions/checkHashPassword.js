import bcrypt from "bcrypt";

const checkHashPassword = (hashPassword, password) => {
  return bcrypt.compareSync(hashPassword, password);
};

export default checkHashPassword;