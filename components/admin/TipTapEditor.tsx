/**
 * TipTap Rich Text Editor Component
 */

'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import { useEffect } from 'react';

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function TipTapEditor({ content, onChange, placeholder = 'Start typing...' }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-2 flex items-center gap-1 flex-wrap bg-gray-50">
        {/* Text Formatting */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-300' : ''}`}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-300' : ''}`}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleUnderline().run(); }}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-gray-300' : ''}`}
          title="Underline (Ctrl+U)"
        >
          <u>U</u>
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run(); }}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-gray-300' : ''}`}
          title="Strikethrough"
        >
          <s>S</s>
        </button>

        <div className="w-px h-6 bg-gray-300" />

        {/* Headings */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => { e.preventDefault(); editor.chain().focus().setParagraph().run(); }}
          className={`px-2 py-1 rounded hover:bg-gray-200 text-sm font-semibold ${editor.isActive('paragraph') ? 'bg-gray-300' : ''}`}
          title="Paragraph"
        >
          P
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 1 }).run(); }}
          className={`px-2 py-1 rounded hover:bg-gray-200 text-sm font-semibold ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''}`}
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}
          className={`px-2 py-1 rounded hover:bg-gray-200 text-sm font-semibold ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''}`}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run(); }}
          className={`px-2 py-1 rounded hover:bg-gray-200 text-sm font-semibold ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''}`}
          title="Heading 3"
        >
          H3
        </button>

        <div className="w-px h-6 bg-gray-300" />

        {/* Text Color */}
        <input
          type="color"
          onInput={(e) => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
          defaultValue="#000000"
          className="w-8 h-8 rounded cursor-pointer"
          title="Text Color"
        />
        <input
          type="color"
          onInput={(e) => editor.chain().focus().toggleHighlight({ color: (e.target as HTMLInputElement).value }).run()}
          defaultValue="#ffff00"
          className="w-8 h-8 rounded cursor-pointer"
          title="Highlight Color"
        />

        <div className="w-px h-6 bg-gray-300" />

        {/* Alignment */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign('left').run(); }}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''}`}
          title="Align Left"
        >
          ⬅
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign('center').run(); }}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''}`}
          title="Align Center"
        >
          ↔
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign('right').run(); }}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''}`}
          title="Align Right"
        >
          ➡
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign('justify').run(); }}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-300' : ''}`}
          title="Justify"
        >
          ⬌
        </button>

        <div className="w-px h-6 bg-gray-300" />

        {/* Lists */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-300' : ''}`}
          title="Bullet List"
        >
          •
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-300' : ''}`}
          title="Numbered List"
        >
          1.
        </button>

        <div className="w-px h-6 bg-gray-300" />

        {/* Link */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => { e.preventDefault(); setLink(); }}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-300' : ''}`}
          title="Insert Link"
        >
          🔗
        </button>
        {editor.isActive('link') && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => { e.preventDefault(); editor.chain().focus().unsetLink().run(); }}
            className="p-2 rounded hover:bg-gray-200"
            title="Remove Link"
          >
            🔓
          </button>
        )}

        <div className="w-px h-6 bg-gray-300" />

        {/* Blockquote & HR */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run(); }}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-300' : ''}`}
          title="Blockquote"
        >
          "
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => { e.preventDefault(); editor.chain().focus().setHorizontalRule().run(); }}
          className="p-2 rounded hover:bg-gray-200"
          title="Horizontal Line"
        >
          ─
        </button>

        <div className="w-px h-6 bg-gray-300" />

        {/* Undo/Redo */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => { e.preventDefault(); editor.chain().focus().undo().run(); }}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
          title="Undo (Ctrl+Z)"
        >
          ↶
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => { e.preventDefault(); editor.chain().focus().redo().run(); }}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
          title="Redo (Ctrl+Y)"
        >
          ↷
        </button>

        <div className="w-px h-6 bg-gray-300" />

        {/* Clear Formatting */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => { e.preventDefault(); editor.chain().focus().clearNodes().unsetAllMarks().run(); }}
          className="p-2 rounded hover:bg-gray-200 text-xs"
          title="Clear Formatting"
        >
          ✕
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="min-h-[300px]" />
    </div>
  );
}