import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Photo } from "@medusajs/icons"
import {
  Button,
  Container,
  Heading,
  Input,
  Label,
  Switch,
  Text,
  Textarea,
  toast,
} from "@medusajs/ui"
import { useEffect, useState } from "react"
import ImageField from "../../components/image-field"
import { adminFetch } from "../../lib/api"

type Block = {
  id: string
  key: string
  data: Record<string, any>
  active: boolean
  starts_at: string | null
  ends_at: string | null
}

type BlockState = {
  data: Record<string, any>
  active: boolean
  starts_at: string
  ends_at: string
}

const DEFAULTS: Record<string, BlockState> = {
  hero: {
    active: true,
    starts_at: "",
    ends_at: "",
    data: {
      eyebrow: "Nura",
      title: "Votre aura commence ici.",
      text: "Parfumerie et bodycare premium, pensés pour accompagner chaque aura, chaque humeur et chaque moment.",
      cta_label: "Découvrir la collection",
      cta_href: "/store",
      secondary_label: "Explorer les parfums",
      secondary_href: "/categories/parfums",
      image: "",
      image_mobile: "",
      video: "",
    },
  },
  campaign: {
    active: true,
    starts_at: "",
    ends_at: "",
    data: {
      eyebrow: "Nouvelle collection",
      title: "Une nouvelle aura",
      text: "Découvrez notre nouvelle collection.",
      cta_label: "Découvrir",
      cta_href: "/collections",
      image: "",
      image_mobile: "",
    },
  },
  essentials: {
    active: true,
    starts_at: "",
    ends_at: "",
    data: {
      title: "Les essentiels Nura",
      subtitle: "Découvrez les signatures parfumées de la maison.",
      handles: "",
    },
  },
}

const toDateInput = (value: string | null) =>
  value ? new Date(value).toISOString().slice(0, 10) : ""

const HomeContentPage = () => {
  const [state, setState] = useState<Record<string, BlockState>>(DEFAULTS)
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
            data: { ...next[block.key].data, ...(block.data || {}) },
            active: block.active,
            starts_at: toDateInput(block.starts_at),
            ends_at: toDateInput(block.ends_at),
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

  const set = (key: string, field: string, value: unknown) =>
    setState((current) => ({
      ...current,
      [key]: {
        ...current[key],
        data: { ...current[key].data, [field]: value },
      },
    }))

  const setMeta = (key: string, field: keyof BlockState, value: unknown) =>
    setState((current) => ({
      ...current,
      [key]: { ...current[key], [field]: value },
    }))

  const save = async (key: string) => {
    setSavingKey(key)
    try {
      const block = state[key]
      await adminFetch("/admin/home-content", {
        method: "POST",
        body: JSON.stringify({
          key,
          data: block.data,
          active: block.active,
          starts_at: block.starts_at || null,
          ends_at: block.ends_at || null,
        }),
      })
      toast.success("Section enregistrée.")
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

  const field = (
    key: string,
    name: string,
    label: string,
    placeholder?: string
  ) => (
    <div className="flex flex-col gap-y-2">
      <Label size="small" weight="plus">
        {label}
      </Label>
      <Input
        value={state[key].data[name] ?? ""}
        placeholder={placeholder}
        onChange={(event) => set(key, name, event.target.value)}
      />
    </div>
  )

  const header = (key: string, title: string, description: string) => (
    <div className="flex items-start justify-between">
      <div>
        <Heading level="h2">{title}</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          {description}
        </Text>
      </div>
      <div className="flex items-center gap-x-2">
        <Label size="small">Visible</Label>
        <Switch
          checked={state[key].active}
          onCheckedChange={(checked) => setMeta(key, "active", checked)}
        />
      </div>
    </div>
  )

  const schedule = (key: string) => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-y-2">
        <Label size="small" weight="plus">
          Début (optionnel)
        </Label>
        <Input
          type="date"
          value={state[key].starts_at}
          onChange={(event) => setMeta(key, "starts_at", event.target.value)}
        />
      </div>
      <div className="flex flex-col gap-y-2">
        <Label size="small" weight="plus">
          Fin (optionnel)
        </Label>
        <Input
          type="date"
          value={state[key].ends_at}
          onChange={(event) => setMeta(key, "ends_at", event.target.value)}
        />
      </div>
    </div>
  )

  const saveButton = (key: string) => (
    <div className="flex justify-end">
      <Button onClick={() => save(key)} isLoading={savingKey === key}>
        Enregistrer
      </Button>
    </div>
  )

  return (
    <div className="flex flex-col gap-y-4">
      <Container className="flex flex-col gap-y-4">
        {header(
          "hero",
          "Hero",
          "La première image de la page d'accueil. Laissez les images vides pour garder celles du thème."
        )}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {field("hero", "eyebrow", "Sur-titre", "Nura")}
          {field("hero", "title", "Titre", "Votre aura commence ici.")}
        </div>
        <div className="flex flex-col gap-y-2">
          <Label size="small" weight="plus">
            Texte
          </Label>
          <Textarea
            rows={2}
            value={state.hero.data.text ?? ""}
            onChange={(event) => set("hero", "text", event.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {field("hero", "cta_label", "Bouton principal")}
          {field("hero", "cta_href", "Lien du bouton principal", "/store")}
          {field("hero", "secondary_label", "Bouton secondaire")}
          {field("hero", "secondary_href", "Lien du bouton secondaire")}
        </div>
        <ImageField
          label="Image desktop"
          value={state.hero.data.image ?? ""}
          onChange={(value) => set("hero", "image", value)}
          hint="Format large, 2400 × 1200 environ."
        />
        <ImageField
          label="Image mobile"
          value={state.hero.data.image_mobile ?? ""}
          onChange={(value) => set("hero", "image_mobile", value)}
          hint="Format portrait, 1000 × 1400 environ."
        />
        {field(
          "hero",
          "video",
          "Vidéo (URL mp4, optionnelle)",
          "https://…/campagne.mp4"
        )}
        {saveButton("hero")}
      </Container>

      <Container className="flex flex-col gap-y-4">
        {header(
          "campaign",
          "Campagne",
          "La bande éditoriale entre le rituel et les avis : lancement, édition limitée, collaboration."
        )}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {field("campaign", "eyebrow", "Sur-titre", "Nouvelle collection")}
          {field("campaign", "title", "Titre", "Une nouvelle aura")}
        </div>
        <div className="flex flex-col gap-y-2">
          <Label size="small" weight="plus">
            Texte
          </Label>
          <Textarea
            rows={2}
            value={state.campaign.data.text ?? ""}
            onChange={(event) => set("campaign", "text", event.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {field("campaign", "cta_label", "Bouton")}
          {field("campaign", "cta_href", "Lien", "/collections")}
        </div>
        <ImageField
          label="Image desktop"
          value={state.campaign.data.image ?? ""}
          onChange={(value) => set("campaign", "image", value)}
        />
        <ImageField
          label="Image mobile"
          value={state.campaign.data.image_mobile ?? ""}
          onChange={(value) => set("campaign", "image_mobile", value)}
        />
        {schedule("campaign")}
        {saveButton("campaign")}
      </Container>

      <Container className="flex flex-col gap-y-4">
        {header(
          "essentials",
          "Les essentiels",
          "La sélection de produits mise en avant en haut de la page d'accueil."
        )}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {field("essentials", "title", "Titre")}
          {field("essentials", "subtitle", "Sous-titre")}
        </div>
        <div className="flex flex-col gap-y-2">
          <Label size="small" weight="plus">
            Produits mis en avant
          </Label>
          <Textarea
            rows={3}
            value={state.essentials.data.handles ?? ""}
            onChange={(event) => set("essentials", "handles", event.target.value)}
            placeholder="eau-de-parfum-aura-doree, huile-corps-fleur-dambre"
          />
          <Text size="xsmall" className="text-ui-fg-muted">
            Les identifiants d&apos;URL des produits, séparés par des virgules,
            dans l&apos;ordre d&apos;affichage. Vide : la collection « Les
            Essentiels Nura » est utilisée.
          </Text>
        </div>
        {saveButton("essentials")}
      </Container>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Page d'accueil",
  icon: Photo,
})

export default HomeContentPage
