import { Label } from "@modules/common/components/ui"
import React from "react"

type TextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "placeholder"
> & {
  label: string
  name: string
  topLabel?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ name, label, required, topLabel, rows = 5, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    React.useImperativeHandle(ref, () => textareaRef.current!)

    return (
      <div className="flex flex-col w-full">
        {topLabel && (
          <Label className="mb-2 txt-compact-medium-plus">{topLabel}</Label>
        )}
        <div className="flex relative z-0 w-full txt-compact-medium">
          <textarea
            id={name}
            name={name}
            placeholder=" "
            required={required}
            rows={rows}
            className="mt-0 block w-full resize-none appearance-none rounded-sm border border-ui-border-base bg-ui-bg-field px-4 pb-1 pt-4 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-1 hover:bg-ui-bg-field-hover"
            {...props}
            ref={textareaRef}
          />
          <label
            htmlFor={name}
            className="flex items-center justify-center mx-3 px-1 transition-all absolute duration-300 top-3 -z-1 origin-0 text-ui-fg-subtle"
          >
            {label}
            {required && <span className="text-rose-500">*</span>}
          </label>
        </div>
      </div>
    )
  }
)

Textarea.displayName = "Textarea"

export default Textarea
