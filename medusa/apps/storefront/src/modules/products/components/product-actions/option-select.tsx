import { HttpTypes } from "@medusajs/types"
import { clx } from "@modules/common/components/ui"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  variants?: HttpTypes.StoreProductVariant[] | null
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  variants,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const variantValues = new Set(
    variants?.flatMap((variant) =>
      (variant.options ?? [])
        .filter((variantOption) => variantOption.option_id === option.id)
        .map((variantOption) => variantOption.value)
    )
  )
  const filteredOptions = Array.from(
    new Set((option.values ?? []).map((value) => value.value))
  ).filter((value) => !variants || variantValues.has(value))

  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-ui-fg-subtle">
        {title}
      </legend>
      <div
        className="grid grid-cols-2 gap-2"
        data-testid={dataTestId}
      >
        {filteredOptions.map((v) => {
          return (
            <button
              type="button"
              onClick={() => updateOption(option.id, v)}
              key={v}
              aria-pressed={v === current}
              className={clx(
                "min-h-12 border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
                {
                  "border-brown bg-brown text-bg-alt": v === current,
                  "border-ui-border-base bg-ui-bg-subtle text-brown hover:border-brown":
                    v !== current,
                }
              )}
              disabled={disabled}
              data-testid="option-button"
            >
              {v}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

export default OptionSelect
