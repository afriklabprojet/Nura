"use client"

import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const metadata = (product.metadata || {}) as Record<string, string>
  const hasNotes =
    metadata.notes_tete || metadata.notes_coeur || metadata.notes_fond
  const hasUsage = metadata.conseils_utilisation || metadata.ingredients

  const tabs = [
    ...(hasNotes
      ? [
          {
            label: "Profil olfactif",
            component: <NotesTab metadata={metadata} />,
          },
        ]
      : []),
    ...(hasUsage
      ? [
          {
            label: "Conseils & ingrédients",
            component: <UsageTab metadata={metadata} />,
          },
        ]
      : []),
    {
      label: "Livraison & retours",
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const NotesTab = ({ metadata }: { metadata: Record<string, string> }) => {
  const rows = [
    { label: "Notes de tête", value: metadata.notes_tete },
    { label: "Notes de cœur", value: metadata.notes_coeur },
    { label: "Notes de fond", value: metadata.notes_fond },
  ].filter((row) => row.value)

  return (
    <div className="text-small-regular py-8">
      <div className="flex flex-col gap-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col gap-y-1">
            <span className="font-semibold uppercase tracking-wide text-xs text-brown">
              {row.label}
            </span>
            <p>{row.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const UsageTab = ({ metadata }: { metadata: Record<string, string> }) => {
  return (
    <div className="text-small-regular py-8">
      <div className="flex flex-col gap-y-4">
        {metadata.conseils_utilisation && (
          <div>
            <span className="font-semibold uppercase tracking-wide text-xs text-brown">
              Conseils d&apos;utilisation
            </span>
            <p>{metadata.conseils_utilisation}</p>
          </div>
        )}
        {metadata.ingredients && (
          <div>
            <span className="font-semibold uppercase tracking-wide text-xs text-brown">
              Ingrédients
            </span>
            <p>{metadata.ingredients}</p>
          </div>
        )}
      </div>
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold">Livraison rapide</span>
            <p className="max-w-sm">
              Expédition sous 24 à 48 h. Livraison offerte dès 49 € en France
              métropolitaine.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="font-semibold">Retours simples</span>
            <p className="max-w-sm">
              Un doute sur votre choix ? Nous échangeons votre produit sans
              difficulté.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
