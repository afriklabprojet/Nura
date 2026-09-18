import { defineRouteConfig } from "@medusajs/admin-sdk"
import { DocumentText } from "@medusajs/icons"
import {
  Badge,
  Button,
  Container,
  Heading,
  Input,
  Label,
  Select,
  Text,
  Textarea,
  toast,
} from "@medusajs/ui"
import { useEffect, useState } from "react"
import ImageField from "../../components/image-field"
import { adminFetch } from "../../lib/api"

type Post = {
  id: string
  title: string
  handle: string
  excerpt: string | null
  content: string
  cover_image: string | null
  author: string | null
  seo_title: string | null
  seo_description: string | null
  status: "draft" | "published"
  published_at: string | null
  created_at: string
}

type Draft = {
  title: string
  handle: string
  excerpt: string
  content: string
  cover_image: string
  author: string
  seo_title: string
  seo_description: string
  status: "draft" | "published"
}

const EMPTY: Draft = {
  title: "",
  handle: "",
  excerpt: "",
  content: "",
  cover_image: "",
  author: "",
  seo_title: "",
  seo_description: "",
  status: "draft",
}

const toDraft = (post: Post): Draft => ({
  title: post.title,
  handle: post.handle,
  excerpt: post.excerpt ?? "",
  content: post.content,
  cover_image: post.cover_image ?? "",
  author: post.author ?? "",
  seo_title: post.seo_title ?? "",
  seo_description: post.seo_description ?? "",
  status: post.status,
})

const JournalPage = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Draft>(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const { posts } = await adminFetch<{ posts: Post[] }>("/admin/journal")
      setPosts(posts)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Chargement impossible.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const edit = (post: Post) => {
    setEditingId(post.id)
    setDraft(toDraft(post))
  }

  const reset = () => {
    setEditingId(null)
    setDraft(EMPTY)
  }

  const save = async () => {
    setSaving(true)
    try {
      await adminFetch(
        editingId ? `/admin/journal/${editingId}` : "/admin/journal",
        { method: "POST", body: JSON.stringify(draft) }
      )
      toast.success(editingId ? "Article mis à jour." : "Article créé.")
      reset()
      await load()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Enregistrement impossible.")
    } finally {
      setSaving(false)
    }
  }

  const remove = async (post: Post) => {
    if (!window.confirm(`Supprimer « ${post.title} » ? Cette action est définitive.`)) {
      return
    }

    try {
      await adminFetch(`/admin/journal/${post.id}`, { method: "DELETE" })
      toast.success("Article supprimé.")
      if (editingId === post.id) {
        reset()
      }
      await load()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Suppression impossible.")
    }
  }

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }))

  return (
    <div className="flex flex-col gap-y-4">
      <Container className="p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <Heading level="h1">Journal</Heading>
            <Text size="small" className="text-ui-fg-subtle">
              Les articles publiés apparaissent sur la boutique dans /journal.
            </Text>
          </div>
          {editingId && (
            <Button size="small" variant="secondary" onClick={reset}>
              Nouvel article
            </Button>
          )}
        </div>

        <div className="border-t">
          {loading ? (
            <Text className="px-6 py-4 text-ui-fg-subtle">Chargement…</Text>
          ) : posts.length === 0 ? (
            <Text className="px-6 py-4 text-ui-fg-subtle">
              Aucun article pour le moment.
            </Text>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between border-b px-6 py-3 last:border-b-0"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-x-2">
                    <Text weight="plus">{post.title}</Text>
                    <Badge
                      size="2xsmall"
                      color={post.status === "published" ? "green" : "grey"}
                    >
                      {post.status === "published" ? "Publié" : "Brouillon"}
                    </Badge>
                  </div>
                  <Text size="xsmall" className="text-ui-fg-muted">
                    /journal/{post.handle}
                    {post.published_at &&
                      ` — ${new Date(post.published_at).toLocaleDateString("fr-FR")}`}
                  </Text>
                </div>
                <div className="flex gap-x-2">
                  <Button size="small" variant="secondary" onClick={() => edit(post)}>
                    Modifier
                  </Button>
                  <Button size="small" variant="danger" onClick={() => remove(post)}>
                    Supprimer
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Container>

      <Container className="flex flex-col gap-y-4">
        <Heading level="h2">
          {editingId ? "Modifier l'article" : "Nouvel article"}
        </Heading>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-y-2">
            <Label size="small" weight="plus">
              Titre
            </Label>
            <Input
              value={draft.title}
              onChange={(event) => set("title", event.target.value)}
              placeholder="Ex. : Les bienfaits de l'huile d'argan"
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label size="small" weight="plus">
              URL (laisser vide pour la générer)
            </Label>
            <Input
              value={draft.handle}
              onChange={(event) => set("handle", event.target.value)}
              placeholder="les-bienfaits-de-l-huile-d-argan"
            />
          </div>
        </div>

        <div className="flex flex-col gap-y-2">
          <Label size="small" weight="plus">
            Chapô
          </Label>
          <Textarea
            rows={2}
            value={draft.excerpt}
            onChange={(event) => set("excerpt", event.target.value)}
            placeholder="Résumé affiché dans la liste des articles."
          />
        </div>

        <ImageField
          label="Image de couverture"
          value={draft.cover_image}
          onChange={(value) => set("cover_image", value)}
          hint="Format paysage recommandé, 1600 × 900 environ."
        />

        <div className="flex flex-col gap-y-2">
          <Label size="small" weight="plus">
            Contenu
          </Label>
          <Textarea
            rows={14}
            value={draft.content}
            onChange={(event) => set("content", event.target.value)}
            placeholder={"Un paragraphe par ligne vide.\n\n## Un sous-titre\n\nLa suite du texte."}
          />
          <Text size="xsmall" className="text-ui-fg-muted">
            Mise en forme simple : une ligne vide sépare les paragraphes, une
            ligne commençant par ## devient un sous-titre.
          </Text>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-y-2">
            <Label size="small" weight="plus">
              Auteur
            </Label>
            <Input
              value={draft.author}
              onChange={(event) => set("author", event.target.value)}
              placeholder="La maison Nura"
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label size="small" weight="plus">
              Titre SEO
            </Label>
            <Input
              value={draft.seo_title}
              onChange={(event) => set("seo_title", event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label size="small" weight="plus">
              Statut
            </Label>
            <Select
              value={draft.status}
              onValueChange={(value) => set("status", value as Draft["status"])}
            >
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="draft">Brouillon</Select.Item>
                <Select.Item value="published">Publié</Select.Item>
              </Select.Content>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-y-2">
          <Label size="small" weight="plus">
            Description SEO
          </Label>
          <Textarea
            rows={2}
            value={draft.seo_description}
            onChange={(event) => set("seo_description", event.target.value)}
          />
        </div>

        <div className="flex justify-end gap-x-2">
          {editingId && (
            <Button variant="secondary" onClick={reset}>
              Annuler
            </Button>
          )}
          <Button onClick={save} isLoading={saving}>
            {editingId ? "Enregistrer" : "Créer l'article"}
          </Button>
        </div>
      </Container>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Journal",
  icon: DocumentText,
})

export default JournalPage
