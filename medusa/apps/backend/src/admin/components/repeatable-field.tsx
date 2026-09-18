import { Button, IconButton, Label, Text } from "@medusajs/ui"
import { Plus, Trash } from "@medusajs/icons"

type RepeatableFieldProps<T> = {
  label: string
  items: T[]
  empty: T
  onChange: (items: T[]) => void
  renderItem: (
    item: T,
    update: (patch: Partial<T>) => void,
    index: number
  ) => React.ReactNode
  addLabel?: string
  hint?: string
}

/** A repeatable list of small objects — pillars, steps, phone numbers, FAQ
 * entries — edited inline with add/remove, backed by a single jsonb field. */
function RepeatableField<T>({
  label,
  items,
  empty,
  onChange,
  renderItem,
  addLabel = "Ajouter",
  hint,
}: RepeatableFieldProps<T>) {
  const update = (index: number, patch: Partial<T>) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)))

  const remove = (index: number) =>
    onChange(items.filter((_, i) => i !== index))

  const add = () => onChange([...items, empty])

  return (
    <div className="flex flex-col gap-y-3">
      <Label size="small" weight="plus">
        {label}
      </Label>
      {hint && (
        <Text size="xsmall" className="text-ui-fg-muted -mt-2">
          {hint}
        </Text>
      )}
      <div className="flex flex-col gap-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-x-3 rounded-md border border-ui-border-base p-3"
          >
            <div className="flex-1">
              {renderItem(item, (patch) => update(index, patch), index)}
            </div>
            <IconButton
              type="button"
              size="small"
              variant="transparent"
              onClick={() => remove(index)}
              aria-label="Retirer"
            >
              <Trash />
            </IconButton>
          </div>
        ))}
      </div>
      <Button
        type="button"
        size="small"
        variant="secondary"
        className="self-start"
        onClick={add}
      >
        <Plus />
        {addLabel}
      </Button>
    </div>
  )
}

export default RepeatableField
