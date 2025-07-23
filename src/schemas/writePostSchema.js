import * as yup from "yup";
const writePostSchema = yup.object().shape({
  title: yup.string().trim().required("Title is required"),
  excerpt: yup.string().trim().required("Excerpt is required"),
});

export default writePostSchema;
