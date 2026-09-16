"use client"

import { getCategoryImage } from "@lib/constants"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export type MenuCategory = {
  id: string
  name: string
  handle: string
  children: { id: string; name: string; handle: string }[]
}

const DesktopMenu = ({ categories }: { categories: MenuCategory[] }) => {
  const [openId, setOpenId] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    setOpenId(null)
  }, [pathname])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null)
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  const active = categories.find((category) => category.id === openId)

  return (
    <div
      className="hidden small:flex items-center gap-x-8 h-full"
      onMouseLeave={() => setOpenId(null)}
    >
      {categories.map((category) => (
        <div
          key={category.id}
          className="h-full flex items-center"
          onMouseEnter={() =>
            setOpenId(category.children.length ? category.id : null)
          }
          onFocus={() =>
            setOpenId(category.children.length ? category.id : null)
          }
        >
          <LocalizedClientLink
            href={`/categories/${category.handle}`}
            className="nav-link link-underline"
            aria-expanded={openId === category.id}
          >
            {category.name}
          </LocalizedClientLink>
        </div>
      ))}

      <LocalizedClientLink
        href="/collections"
        className="nav-link link-underline"
      >
        Collections
      </LocalizedClientLink>

      {active && (
        <div className="absolute left-0 right-0 top-full bg-bg-alt border-t border-b border-nude shadow-[0_24px_40px_-32px_rgba(58,42,32,0.45)] animate-fade-in-top">
          <div className="content-container grid grid-cols-[1fr_320px] gap-16 py-12">
            <div className="flex flex-col gap-8">
              <span className="eyebrow">{active.name}</span>
              <div className="grid grid-cols-3 gap-x-10 gap-y-4">
                <LocalizedClientLink
                  href={`/categories/${active.handle}`}
                  className="font-serif text-xl text-brown hover:text-gold transition-colors"
                >
                  Tout voir
                </LocalizedClientLink>
                {active.children.map((child) => (
                  <LocalizedClientLink
                    key={child.id}
                    href={`/categories/${active.handle}/${child.handle}`}
                    className="font-serif text-xl text-brown hover:text-gold transition-colors"
                  >
                    {child.name}
                  </LocalizedClientLink>
                ))}
              </div>
            </div>

            <LocalizedClientLink
              href={`/categories/${active.handle}`}
              className="group relative aspect-[4/3] overflow-hidden"
            >
              <Image
                src={getCategoryImage(active.handle)}
                alt={active.name}
                fill
                sizes="320px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brown/70 to-transparent px-5 py-4 text-[11px] uppercase tracking-[0.25em] text-bg-alt">
                Découvrir {active.name}
              </span>
            </LocalizedClientLink>
          </div>
        </div>
      )}
    </div>
  )
}

export default DesktopMenu
