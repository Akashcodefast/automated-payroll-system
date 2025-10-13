const bcrypt = require("bcryptjs");

// Replace with the desired plain password
const plainPassword = "12345678";

bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) throw err;
  console.log("Hashed password:", hash);
});
