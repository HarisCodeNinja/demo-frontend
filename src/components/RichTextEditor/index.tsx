import React, { forwardRef } from 'react';
import { EditorContent } from '@tiptap/react';
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Minus,
  Code,
  Redo2,
  Undo2,
  UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  LinkIcon,
  TableIcon
} from 'lucide-react';
import { useRichTextEditor } from './hooks/useRichTextEditor';

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
}

// Helper function to combine class names (simplified version of cn)
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

const TiptapEditor = forwardRef<HTMLDivElement, TiptapEditorProps>(({
  value,
  onChange,
  placeholder = 'Start typing...',
  className,
  editable = true
}, ref) => {
  const { editor, addLink } = useRichTextEditor({
    value,
    onChange,
    editable
  });

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false, 
    children, 
    title 
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title?: string;
  }) => (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        if (!disabled && editor) {
          onClick();
        }
      }}
      disabled={disabled || !editor}
      title={title}
      className={cn(
        "h-8 w-8 p-0 border border-border rounded hover:bg-muted transition-colors flex items-center justify-center",
        isActive ? "bg-info/15 border-info text-info" : "",
        disabled || !editor ? "opacity-50 cursor-not-allowed" : ""
      )}
    >
      {children}
    </button>
  );


  return (
    <div className={cn("border border-border rounded-lg bg-card", className)} ref={ref}>
      <div className="border-b border-border bg-muted/30 p-2 rounded-t-lg">
        <div className="flex flex-wrap items-center gap-1">
          <div className="flex items-center gap-1 border-r border-border pr-2 mr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive('underline')}
              title="Underline"
            >
              <UnderlineIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive('strike')}
              title="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              isActive={editor.isActive('codeBlock')}
              title="Code Block"
            >
              <Code className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <div className="flex items-center gap-1 border-r border-border pr-2 mr-2">
            <select
              className="text-sm border border-border rounded px-2 py-1 bg-card"
              value={
                !editor ? '0' :
                editor.isActive('heading', { level: 1 }) ? '1' :
                editor.isActive('heading', { level: 2 }) ? '2' :
                editor.isActive('heading', { level: 3 }) ? '3' : '0'
              }
              onChange={(e) => {
                if (!editor) return;
                e.preventDefault();
                const level = parseInt(e.target.value);
                if (level === 0) {
                  editor.chain().focus().clearNodes().run();
                } else {
                  editor.chain().focus().clearNodes().setHeading({ level: level as 1 | 2 | 3 }).run();
                }
              }}
              disabled={!editor}
            >
              <option value="0">Normal</option>
              <option value="1">Heading 1</option>
              <option value="2">Heading 2</option>
              <option value="3">Heading 3</option>
            </select>
          </div>

          <div className="flex items-center gap-1 border-r border-border pr-2 mr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              isActive={editor.isActive({ textAlign: 'left' }) || (!editor.isActive({ textAlign: 'center' }) && !editor.isActive({ textAlign: 'right' }) && !editor.isActive({ textAlign: 'justify' }))}
              title="Align Left"
            >
              <AlignLeft className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              isActive={editor.isActive({ textAlign: 'center' })}
              title="Align Center"
            >
              <AlignCenter className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              isActive={editor.isActive({ textAlign: 'right' })}
              title="Align Right"
            >
              <AlignRight className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              isActive={editor.isActive({ textAlign: 'justify' })}
              title="Justify"
            >
              <AlignJustify className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <div className="flex items-center gap-1 border-r border-border pr-2 mr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              title="Ordered List"
            >
              <ListOrdered className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <div className="flex items-center gap-1 border-r border-border pr-2 mr-2">
            <ToolbarButton
              onClick={addLink}
              isActive={editor.isActive('link')}
              title="Add Link"
            >
              <LinkIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              title="Quote"
            >
              <Quote className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              title="Horizontal Rule"
            >
              <Minus className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
              title="Undo"
            >
              <Undo2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
              title="Redo"
            >
              <Redo2 className="h-4 w-4" />
            </ToolbarButton>
          </div>
        </div>
      </div>

      <EditorContent 
        editor={editor} 
        className="min-h-[200px] [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-bold [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_p]:mb-2 [&_li]:mb-1 [&_pre]:bg-muted/50 [&_pre]:border [&_pre]:border-border [&_pre]:rounded [&_pre]:p-3 [&_pre]:my-2 [&_pre]:overflow-x-auto [&_code]:font-mono [&_code]:text-sm"
      />
    </div>
  );
});

TiptapEditor.displayName = 'TiptapEditor';

export default TiptapEditor;