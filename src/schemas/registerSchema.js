import * as yup from "yup";
const registerSchema = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .required("Please enter your first name")
    .min(2, "First name must be at least 2 characters"),
  lastName: yup
    .string()
    .trim()
    .required("Please enter your first name")
    .min(2, "Last name must be at least 2 characters"),
  email: yup
    .string()
    .trim()
    .email("This field must be an email")
    .required("Please enter your email"),
  password: yup
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
    .oneOf([yup.ref("password"), null], "Passwords do not match"),
  agreeToTerms: yup
    .boolean()
    .oneOf([true], "You must agree to the terms to continue"),
});

export default registerSchema;
