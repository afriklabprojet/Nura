import { defineRouteConfig } from "@medusajs/admin-sdk"
import { BuildingStorefront } from "@medusajs/icons"
import BlockSections, { BlockSection } from "../../components/block-sections"

const SECTIONS: BlockSection[] = [
  {
    key: "store_page",
    title: "Boutique",
    description: "L'en-tête de la page /store, qui liste tous les produits.",
    fields: [
      { name: "eyebrow", label: "Sur-titre" },
      { name: "title", label: "Titre" },
      { name: "text", label: "Texte", multiline: true },
      { name: "empty_state", label: "Aucun résultat pour les filtres" },
    ],
  },
  {
    key: "collections_page",
    title: "Collections",
    description:
      "La liste des collections (/collections) et l'en-tête générique d'une collection.",
    fields: [
      { name: "eyebrow", label: "Sur-titre" },
      { name: "title", label: "Titre" },
      { name: "text", label: "Texte", multiline: true },
      { name: "empty_state", label: "Aucune collection" },
      {
        name: "collection_blurb_template",
        label: "Texte d'une collection (utiliser {title})",
        multiline: true,
      },
    ],
  },
  {
    key: "contact_extras",
    title: "Contact",
    description: "Le message affiché après l'envoi du formulaire de contact.",
    fields: [
      { name: "success_message", label: "Message de confirmation", multiline: true },
    ],
  },
  {
    key: "journal_page",
    title: "Journal",
    description: "L'en-tête de la liste des articles (/journal).",
    fields: [
      { name: "eyebrow", label: "Sur-titre" },
      { name: "title", label: "Titre" },
      { name: "text", label: "Texte", multiline: true },
      { name: "empty_state", label: "Aucun article pour le moment" },
    ],
  },
]

const BoutiquePage = () => <BlockSections sections={SECTIONS} />

export const config = defineRouteConfig({
  label: "Boutique",
  icon: BuildingStorefront,
})

export default BoutiquePage
