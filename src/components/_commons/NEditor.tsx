import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// Dynamic import to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const NEditor = ({
  value,
  onChange,
  readOnly = false,
  editable = true,
}: {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean; // Default to false for editable mode (default)
  editable?: boolean; // Default to true for read-only mode (disabled)
}) => {
  const modules = {
    toolbar: readOnly
      ? false // Disable toolbar in read-only mode
      : [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"], // Remove formatting
        ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
  ];

  return (
    <div className={`${!editable ? "pointer-events-none bg-gray-50" : ""}`}>
      <ReactQuill
        theme={readOnly ? null : "snow"} // Remove theme for cleaner view mode
        placeholder={readOnly ? "" : "Enter your text here..."}
        value={value}
        onChange={readOnly || !onChange ? undefined : onChange} // Disable onChange in read-only mode
        modules={modules}
        formats={formats}
        className="p-0"
        readOnly={readOnly} // Enable Quill's built-in read-only mode
      />
    </div>
  );
};

export default NEditor;
