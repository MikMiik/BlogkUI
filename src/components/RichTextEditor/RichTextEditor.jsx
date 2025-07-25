import { useMemo } from "react";
import PropTypes from "prop-types";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import styles from "./RichTextEditor.module.scss";
import { useRef } from "react";
import { useUploadMutation } from "@/features/uploadAp";

const RichTextEditor = ({
  value = "",
  onChange,
  placeholder = "Start writing...",
  className = "",
  error = "",
  readOnly = false,
  theme = "snow",
  modules: customModules = {},
  formats: customFormats = [],
  ...props
}) => {
  const quillRef = useRef();
  const [uploadImage] = useUploadMutation();
  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];

      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await uploadImage(formData);

        const imageUrl = res.data.url;

        const editor = quillRef.current.getEditor();
        const range = editor.getSelection();

        editor.insertEmbed(range.index, "image", imageUrl);
      } catch (err) {
        console.error("Upload failed", err);
      }
    };
  };
  // Default toolbar configuration
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          ["blockquote", "code-block"],
          ["link", "image", "video"],
          [{ align: [] }],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: false,
      },
      ...customModules,
    }),
    [customModules]
  );

  // Default formats
  const formats = useMemo(() => {
    const defaultFormats = [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "color",
      "background",
      "list",
      "indent",
      "blockquote",
      "code-block",
      "link",
      "image",
      "video",
      "align",
    ];
    return customFormats.length > 0 ? customFormats : defaultFormats;
  }, [customFormats]);

  const editorClasses = `${styles.editor} ${className} ${
    error ? styles.error : ""
  }`.trim();

  return (
    <div className={styles.container}>
      <ReactQuill
        ref={quillRef}
        theme={theme}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        modules={modules}
        formats={formats}
        className={editorClasses}
        {...props}
      />
      {error && <div className={styles.errorText}>{error}</div>}
    </div>
  );
};

RichTextEditor.displayName = "RichTextEditor";

RichTextEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.string,
  readOnly: PropTypes.bool,
  theme: PropTypes.oneOf(["snow", "bubble"]),
  modules: PropTypes.object,
  formats: PropTypes.array,
};

export default RichTextEditor;
