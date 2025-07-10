import * as yup from "yup";
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Please enter your email"),
  password: yup.string().required("Please enter your password"),
});

export default loginSchema;
