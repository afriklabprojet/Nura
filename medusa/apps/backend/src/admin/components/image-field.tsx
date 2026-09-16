import { Button, Input, Label, Text } from "@medusajs/ui"
import { useRef, useState } from "react"
import { uploadImage } from "../lib/api"

type ImageFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  hint?: string
}

const ImageField = ({ label, value, onChange, hint }: ImageFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pick = async (file?: File) => {
    if (!file) {
      return
    }

    setBusy(true)
    setError(null)

    try {
      onChange(await uploadImage(file))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Envoi impossible.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-y-2">
      <Label size="small" weight="plus">
        {label}
      </Label>
      <div className="flex items-start gap-x-3">
        {value && /^https?:\/\//.test(value) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            className="h-20 w-20 rounded-md border object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-md border border-dashed px-2 text-center">
            <Text size="xsmall" className="text-ui-fg-muted">
              {/* A path like /images/hero.webp lives on the storefront, not
                  here, so there is nothing to preview from the admin. */}
              {value ? "Image du thème" : "Aucune"}
            </Text>
          </div>
        )}
        <div className="flex flex-1 flex-col gap-y-2">
          <Input
            value={value}
            placeholder="https://… ou /images/…"
            onChange={(event) => onChange(event.target.value)}
          />
          <div className="flex items-center gap-x-2">
            <Button
              size="small"
              variant="secondary"
              isLoading={busy}
              onClick={() => inputRef.current?.click()}
            >
              Téléverser
            </Button>
            {value && (
              <Button size="small" variant="transparent" onClick={() => onChange("")}>
                Retirer
              </Button>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => pick(event.target.files?.[0])}
          />
          {hint && (
            <Text size="xsmall" className="text-ui-fg-muted">
              {hint}
            </Text>
          )}
          {error && (
            <Text size="xsmall" className="text-ui-fg-error">
              {error}
            </Text>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImageField
