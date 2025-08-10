import { decodeHtmlEntities } from "@/utils/decodeHtml";
import { CKEditor as CKEditorComponent } from "@ckeditor/ckeditor5-react";
import {
  Alignment,
  BlockQuote,
  Bold,
  ClassicEditor,
  Essentials,
  FontSize,
  Heading,
  HorizontalLine,
  Image,
  ImageResize,
  ImageResizeHandles,
  ImageToolbar,
  ImageUpload,
  Italic,
  Link,
  List,
  Paragraph,
  SimpleUploadAdapter,
  Subscript,
  Superscript,
  Table,
  TableToolbar,
  Undo,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";

type ArticleEditorProps = {
  value: string;
  onChange: (text: string) => void;
  token: string;
};

export default function ArticleEditor({
  value,
  onChange,
  token,
}: ArticleEditorProps) {
  return (
    <CKEditorComponent
      editor={ClassicEditor}
      config={{
        licenseKey: "GPL",
        toolbar: {
          items: [
            "undo",
            "redo",
            "|",
            "heading",
            "fontsize",
            "|",
            "bold",
            "italic",
            "subscript",
            "superscript",
            "link",
            "blockquote",
            "|",
            "alignment",
            "horizontalLine",
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
          Link,
          BlockQuote,
          Alignment,
          Subscript,
          Superscript,
          HorizontalLine,
        ],
        simpleUpload: {
          uploadUrl: `https://${process.env.NEXT_PUBLIC_MODE === "prod" ? "api" : "dev"}.ruangobat.id/api/questions/image`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        mediaEmbed: {
          previewsInData: true,
        },
      }}
      data={value}
      onChange={(event, editor) => {
        onChange(decodeHtmlEntities(editor.getData()));
      }}
    />
  );
}
