import { defineRouteConfig } from "@medusajs/admin-sdk"
import { CogSixTooth } from "@medusajs/icons"
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
import RepeatableField from "../../components/repeatable-field"
import { adminFetch } from "../../lib/api"

type Block = { key: string; data: Record<string, any> }

type Phone = { label: string; tel: string; display: string }
type Message = { text: string }

type SettingsState = {
  email: string
  hours: string
  phones: Phone[]
  instagram: string
  tiktok: string
}

const EMPTY_SETTINGS: SettingsState = {
  email: "",
  hours: "",
  phones: [],
  instagram: "",
  tiktok: "",
}

const SiteSettingsPage = () => {
  const [settings, setSettings] = useState<SettingsState>(EMPTY_SETTINGS)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [savingSettings, setSavingSettings] = useState(false)
  const [savingAnnouncement, setSavingAnnouncement] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const { blocks } = await adminFetch<{ blocks: Block[] }>(
        "/admin/home-content"
      )

      const siteSettings = blocks.find((b) => b.key === "site_settings")?.data
      const announcement = blocks.find((b) => b.key === "announcement")?.data

      if (siteSettings) {
        setSettings({
          email: siteSettings.email ?? "",
          hours: siteSettings.hours ?? "",
          phones: siteSettings.phones ?? [],
          instagram: siteSettings.social?.instagram ?? "",
          tiktok: siteSettings.social?.tiktok ?? "",
        })
      }

      setMessages(
        (announcement?.messages ?? []).map((text: string) => ({ text }))
      )
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Chargement impossible.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const saveSettings = async () => {
    setSavingSettings(true)
    try {
      await adminFetch("/admin/home-content", {
        method: "POST",
        body: JSON.stringify({
          key: "site_settings",
          active: true,
          data: {
            email: settings.email,
            hours: settings.hours,
            phones: settings.phones,
            social: { instagram: settings.instagram, tiktok: settings.tiktok },
          },
        }),
      })
      toast.success("Coordonnées enregistrées.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Enregistrement impossible.")
    } finally {
      setSavingSettings(false)
    }
  }

  const saveAnnouncement = async () => {
    setSavingAnnouncement(true)
    try {
      await adminFetch("/admin/home-content", {
        method: "POST",
        body: JSON.stringify({
          key: "announcement",
          active: true,
          data: { messages: messages.map((m) => m.text) },
        }),
      })
      toast.success("Bandeau d'annonces enregistré.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Enregistrement impossible.")
    } finally {
      setSavingAnnouncement(false)
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
      <Container className="flex flex-col gap-y-4">
        <div>
          <Heading level="h1">Coordonnées & réseaux</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            Utilisés partout où le site affiche un contact : menu, pied de
            page, page Contact, FAQ, compte client.
          </Text>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-y-2">
            <Label size="small" weight="plus">
              Email de contact
            </Label>
            <Input
              value={settings.email}
              placeholder="contact@nura-paris.com"
              onChange={(event) =>
                setSettings((s) => ({ ...s, email: event.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label size="small" weight="plus">
              Horaires
            </Label>
            <Input
              value={settings.hours}
              placeholder="Du lundi au vendredi, 9h — 18h"
              onChange={(event) =>
                setSettings((s) => ({ ...s, hours: event.target.value }))
              }
            />
          </div>
        </div>

        <RepeatableField
          label="Numéros de téléphone"
          items={settings.phones}
          empty={{ label: "", tel: "", display: "" }}
          onChange={(phones) => setSettings((s) => ({ ...s, phones }))}
          addLabel="Ajouter un numéro"
          hint="Le numéro d'appel (tel) au format international, ex. +33745064887."
          renderItem={(phone, update) => (
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              <Input
                value={phone.label}
                placeholder="Libellé, ex. France"
                onChange={(event) => update({ label: event.target.value })}
              />
              <Input
                value={phone.tel}
                placeholder="+33745064887"
                onChange={(event) => update({ tel: event.target.value })}
              />
              <Input
                value={phone.display}
                placeholder="Affiché, ex. +33 7 45 06 48 87"
                onChange={(event) => update({ display: event.target.value })}
              />
            </div>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-y-2">
            <Label size="small" weight="plus">
              Instagram (URL)
            </Label>
            <Input
              value={settings.instagram}
              placeholder="https://instagram.com/nura"
              onChange={(event) =>
                setSettings((s) => ({ ...s, instagram: event.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label size="small" weight="plus">
              TikTok (URL)
            </Label>
            <Input
              value={settings.tiktok}
              placeholder="https://tiktok.com/@nura"
              onChange={(event) =>
                setSettings((s) => ({ ...s, tiktok: event.target.value }))
              }
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={saveSettings} isLoading={savingSettings}>
            Enregistrer
          </Button>
        </div>
      </Container>

      <Container className="flex flex-col gap-y-4">
        <div>
          <Heading level="h1">Bandeau d'annonces</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            Les messages qui défilent en haut de chaque page.
          </Text>
        </div>

        <RepeatableField
          label="Messages"
          items={messages}
          empty={{ text: "" }}
          onChange={setMessages}
          addLabel="Ajouter un message"
          renderItem={(message, update) => (
            <Textarea
              rows={1}
              value={message.text}
              placeholder="Livraison en France et en Côte d'Ivoire"
              onChange={(event) => update({ text: event.target.value })}
            />
          )}
        />

        <div className="flex justify-end">
          <Button onClick={saveAnnouncement} isLoading={savingAnnouncement}>
            Enregistrer
          </Button>
        </div>
      </Container>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Réglages du site",
  icon: CogSixTooth,
})

export default SiteSettingsPage
