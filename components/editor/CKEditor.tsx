import { decodeHtmlEntities } from "@/utils/decodeHtml";
import { CKEditor as CKEditorComponent } from "@ckeditor/ckeditor5-react";
import {
  Bold,
  ClassicEditor,
  Essentials,
  FontSize,
  Heading,
  Image,
  ImageResize,
  ImageResizeHandles,
  ImageToolbar,
  ImageUpload,
  Italic,
  List,
  Paragraph,
  SimpleUploadAdapter,
  Table,
  TableToolbar,
  Undo,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";

type CKEditorProps = {
  value: string;
  onChange: (text: string) => void;
  token: string;
};

export default function CKEditor({ value, onChange, token }: CKEditorProps) {
  return (
    <CKEditorComponent
      editor={ClassicEditor}
      config={{
        licenseKey: "GPL",
        toolbar: {
          items: [
            "undo",
            "|",
            "fontsize",
            "|",
            "bold",
            "italic",
            "|",
            "uploadImage",
            "insertTable",
            "|",
            "bulletedList",
            "numberedList",
          ],
          shouldNotGroupWhenFull: true,
        },
        table: {
          contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
        },
        plugins: [
          Bold,
          Essentials,
          Italic,
          Heading,
          Paragraph,
          Undo,
          List,
          FontSize,
          Table,
          TableToolbar,
          SimpleUploadAdapter,
          ImageToolbar,
          Image,
          ImageUpload,
          ImageResize,
          ImageResizeHandles,
        ],
        simpleUpload: {
          uploadUrl: `https://${process.env.NEXT_PUBLIC_MODE === "prod" ? "api" : "dev"}.ruangobat.id/api/general/questions/image`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }}
      data={value}
      onChange={(event, editor) => {
        onChange(decodeHtmlEntities(editor.getData()));
      }}
    />
  );
}
