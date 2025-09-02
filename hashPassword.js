const bcrypt = require("bcryptjs");

// Replace with the desired plain password
const plainPassword = "akash@051";

bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) throw err;
  console.log("Hashed password:", hash);
});
