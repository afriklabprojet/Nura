import { defineRouteConfig } from "@medusajs/admin-sdk"
import { DocumentText } from "@medusajs/icons"
import {
  Button,
  Container,
  Heading,
  Input,
  Label,
  Text,
  Textarea,
  toast,
} from "@medusajs/ui"
import { useEffect, useState } from "react"
import { adminFetch } from "../../lib/api"

type Block = {
  key: string
  data: { title?: string; content?: string }
}

type PageState = { title: string; content: string }

const PAGES: { key: string; label: string; description: string }[] = [
  {
    key: "page_a_propos",
    label: "À propos",
    description: "La page /a-propos.",
  },
  {
    key: "page_contact",
    label: "Contact",
    description: "Le texte d'introduction de la page /contact.",
  },
  {
    key: "page_livraison_retours",
    label: "Livraison & retours",
    description: "La page /livraison-retours.",
  },
  {
    key: "page_politique_cookies",
    label: "Politique de cookies",
    description: "La page /politique-cookies.",
  },
]

const EMPTY: PageState = { title: "", content: "" }

const PagesPage = () => {
  const [state, setState] = useState<Record<string, PageState>>(
    Object.fromEntries(PAGES.map((page) => [page.key, EMPTY]))
  )
  const [loading, setLoading] = useState(true)
  const [savingKey, setSavingKey] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const { blocks } = await adminFetch<{ blocks: Block[] }>(
        "/admin/home-content"
      )

      setState((current) => {
        const next = { ...current }
        blocks.forEach((block) => {
          if (!next[block.key]) {
            return
          }
          next[block.key] = {
            title: block.data?.title ?? "",
            content: block.data?.content ?? "",
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

  useEffect(() => {
    load()
  }, [])

  const set = (key: string, field: keyof PageState, value: string) =>
    setState((current) => ({
      ...current,
      [key]: { ...current[key], [field]: value },
    }))

  const save = async (key: string) => {
    setSavingKey(key)
    try {
      await adminFetch("/admin/home-content", {
        method: "POST",
        body: JSON.stringify({ key, data: state[key], active: true }),
      })
      toast.success("Page enregistrée.")
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
      {PAGES.map((page) => (
        <Container key={page.key} className="flex flex-col gap-y-4">
          <div>
            <Heading level="h2">{page.label}</Heading>
            <Text size="small" className="text-ui-fg-subtle">
              {page.description}
            </Text>
          </div>

          <div className="flex flex-col gap-y-2">
            <Label size="small" weight="plus">
              Titre
            </Label>
            <Input
              value={state[page.key].title}
              onChange={(event) => set(page.key, "title", event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label size="small" weight="plus">
              Contenu
            </Label>
            <Textarea
              rows={12}
              value={state[page.key].content}
              onChange={(event) => set(page.key, "content", event.target.value)}
              placeholder={"Un paragraphe par ligne vide.\n\n## Un sous-titre\n\n- Un élément de liste\n\n[Un lien](/contact)"}
            />
            <Text size="xsmall" className="text-ui-fg-muted">
              Mise en forme simple : une ligne vide sépare les paragraphes, une
              ligne commençant par ## devient un sous-titre, une ligne
              commençant par - devient un élément de liste, et [texte](/lien)
              crée un lien.
            </Text>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => save(page.key)} isLoading={savingKey === page.key}>
              Enregistrer
            </Button>
          </div>
        </Container>
      ))}
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Pages",
  icon: DocumentText,
})

export default PagesPage
