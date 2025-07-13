import * as yup from "yup";
const emailSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Please enter your email"),
});

export default emailSchema;
