import { Button, Container, Heading, Input, Label, Switch, Text, Textarea, toast } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { adminFetch } from "../lib/api"

type Block = { key: string; data: Record<string, any>; active: boolean }

export type BlockField = {
  name: string
  label: string
  multiline?: boolean
  hint?: string
}

export type BlockSection = {
  key: string
  title: string
  description: string
  fields: BlockField[]
}

type BlockState = {
  active: boolean
  data: Record<string, string>
}

/**
 * Renders a set of home_block-backed sections as plain text fields — one
 * container per section, one "Enregistrer" per section. Each section maps
 * 1:1 to a block key; fields are flat strings, which covers every
 * message/copy block that isn't list-shaped (those use RepeatableField
 * instead, as in the home-content and site-settings admin pages).
 */
const BlockSections = ({ sections }: { sections: BlockSection[] }) => {
  const empty = Object.fromEntries(
    sections.map((section) => [section.key, { active: true, data: {} }])
  ) as Record<string, BlockState>

  const [blocks, setBlocks] = useState<Record<string, BlockState>>(empty)
  const [loading, setLoading] = useState(true)
  const [savingKey, setSavingKey] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const { blocks: fetched } = await adminFetch<{ blocks: Block[] }>(
          "/admin/home-content"
        )

        setBlocks((current) => {
          const next = { ...current }

          sections.forEach((section) => {
            const block = fetched.find((item) => item.key === section.key)
            if (!block) {
              return
            }

            next[section.key] = {
              active: block.active,
              data: Object.fromEntries(
                section.fields.map((field) => [
                  field.name,
                  String(block.data?.[field.name] ?? ""),
                ])
              ),
            }
          })

          return next
        })
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Chargement impossible.")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const update = (key: string, field: string, value: string | boolean) =>
    setBlocks((current) => ({
      ...current,
      [key]:
        field === "active"
          ? { ...current[key], active: Boolean(value) }
          : { ...current[key], data: { ...current[key].data, [field]: String(value) } },
    }))

  const save = async (section: BlockSection) => {
    setSavingKey(section.key)
    try {
      const block = blocks[section.key]
      await adminFetch("/admin/home-content", {
        method: "POST",
        body: JSON.stringify({
          key: section.key,
          active: block.active,
          data: block.data,
        }),
      })
      toast.success("Contenu enregistré.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Enregistrement impossible.")
    } finally {
      setSavingKey(null)
    }
  }

  if (loading) {
    return (
      <Container>
        <Text className="text-ui-fg-subtle">Chargement…</Text>
      </Container>
    )
  }

  return (
    <div className="flex flex-col gap-y-4">
      {sections.map((section) => {
        const block = blocks[section.key]

        return (
          <Container key={section.key} className="flex flex-col gap-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Heading level="h2">{section.title}</Heading>
                <Text size="small" className="text-ui-fg-subtle">
                  {section.description}
                </Text>
              </div>
              <div className="flex items-center gap-x-2">
                <Label size="small">Visible</Label>
                <Switch
                  checked={block.active}
                  onCheckedChange={(checked) => update(section.key, "active", checked)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {section.fields.map((field) => (
                <div key={field.name} className="flex flex-col gap-y-2">
                  <Label size="small" weight="plus">
                    {field.label}
                  </Label>
                  {field.multiline ? (
                    <Textarea
                      rows={2}
                      value={block.data[field.name] ?? ""}
                      onChange={(event) =>
                        update(section.key, field.name, event.target.value)
                      }
                    />
                  ) : (
                    <Input
                      value={block.data[field.name] ?? ""}
                      onChange={(event) =>
                        update(section.key, field.name, event.target.value)
                      }
                    />
                  )}
                  {field.hint && (
                    <Text size="xsmall" className="text-ui-fg-muted">
                      {field.hint}
                    </Text>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button onClick={() => save(section)} isLoading={savingKey === section.key}>
                Enregistrer
              </Button>
            </div>
          </Container>
        )
      })}
    </div>
  )
}

export default BlockSections
