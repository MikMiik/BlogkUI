import * as yup from "yup";
const changePasswordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .required("Please enter a password")
    .test("password", "Password must meet all requirements", function (value) {
      const errors = [];

      if (!value) return true;

      if (value.length < 8) errors.push("at least 8 characters long");

      if (!/[0-9]/.test(value)) errors.push("a number");

      if (!/[a-z]/.test(value)) errors.push("a lowercase letter");

      if (!/[A-Z]/.test(value)) {
        errors.push("an uppercase letter");
      }

      if (!/[^\w]/.test(value)) errors.push("a special character");

      if (errors.length > 0) {
        return this.createError({
          message: `Password requires: ${errors.join(", ")}`,
        });
      }
      return true;
    }),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords do not match"),
});

export default changePasswordSchema;
