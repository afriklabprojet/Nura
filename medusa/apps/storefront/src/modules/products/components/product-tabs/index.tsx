"use client"

import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"
import { ProductExtrasBlock } from "@lib/data/home-content"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
  content?: ProductExtrasBlock | null
}

const ProductTabs = ({ product, content }: ProductTabsProps) => {
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
    ...(content !== null
      ? [
          {
            label: content?.shipping_tab_title || "Livraison & retours",
            component: <ShippingInfoTab content={content} />,
          },
        ]
      : []),
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

const ShippingInfoTab = ({ content }: { content?: ProductExtrasBlock }) => {
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold">
              {content?.shipping_tab_title || "Livraison"}
            </span>
            {content?.shipping_tab_text && (
              <p className="max-w-sm">{content.shipping_tab_text}</p>
            )}
            {!content?.shipping_tab_text && (
              <p className="max-w-sm">
                Expédition sous 24 à 48 h, puis livraison selon la destination.
              </p>
            )}
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="font-semibold">
              {content?.returns_tab_title || "Retours"}
            </span>
            {content?.returns_tab_text && (
              <p className="max-w-sm">{content.returns_tab_text}</p>
            )}
            {!content?.returns_tab_text && (
              <p className="max-w-sm">
                Retour sous 14 jours pour tout produit non ouvert, dans son
                emballage d’origine.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
