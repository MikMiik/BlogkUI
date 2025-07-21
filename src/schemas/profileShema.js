import * as yup from "yup";
const profileSchema = yup.object().shape({
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
  username: yup
    .string()
    .trim()
    .required("Please enter your username")
    .matches(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, hyphens and underscores"
    ),
  website: yup
    .string()
    .nullable()
    .notRequired()
    .test(
      "is-valid-url",
      "Website URL must start with http:// or https://",
      (value) => {
        if (!value) return true;
        return value.startsWith("http://") || value.startsWith("https://");
      }
    ),
  socials: yup.object().shape({
    twitter: yup
      .string()
      .nullable()
      .notRequired()
      .test(
        "twitter-starts-with-http",
        "Twitter URL must start with http:// or https://",
        (value) => {
          if (!value) return true;
          return value.startsWith("http://") || value.startsWith("https://");
        }
      ),
    github: yup
      .string()
      .nullable()
      .notRequired()
      .test(
        "github-starts-with-http",
        "Github URL must start with http:// or https://",
        (value) => {
          if (!value) return true;
          return value.startsWith("http://") || value.startsWith("https://");
        }
      ),
    linkedin: yup
      .string()
      .nullable()
      .notRequired()
      .test(
        "linkedin-starts-with-http",
        "LinkeIn URL must start with http:// or https://",
        (value) => {
          if (!value) return true;
          return value.startsWith("http://") || value.startsWith("https://");
        }
      ),
  }),
});

export default profileSchema;
