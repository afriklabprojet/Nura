import { Suspense } from "react"

import { listCategories } from "@lib/data/categories"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import User from "@modules/common/icons/user"
import CartButton from "@modules/layout/components/cart-button"
import DesktopMenu, {
  MenuCategory,
} from "@modules/layout/components/desktop-menu"
import SearchBar from "@modules/layout/components/search-bar"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale, categories] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
    listCategories({ fields: "id,name,handle,parent_category,category_children" }),
  ])

  const menuCategories: MenuCategory[] = categories
    .filter((category) => !category.parent_category)
    .map((category) => ({
      id: category.id,
      name: category.name,
      handle: category.handle,
      children: (category.category_children || []).map((child) => ({
        id: child.id,
        name: child.name,
        handle: child.handle,
      })),
    }))

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 small:h-[72px] mx-auto border-b duration-200 bg-bg-alt border-nude">
        <nav className="content-container flex items-center justify-between w-full h-full">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="small:hidden h-full flex items-center">
              <SideMenu
                regions={regions}
                locales={locales}
                currentLocale={currentLocale}
                categories={menuCategories}
              />
            </div>
            <DesktopMenu categories={menuCategories} />
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="font-serif text-2xl small:text-[28px] leading-none tracking-[0.3em] pl-[0.3em] text-brown hover:text-gold transition-colors uppercase"
              data-testid="nav-store-link"
            >
              Nura
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-5 small:gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6">
              <LocalizedClientLink
                href="/a-propos"
                className="nav-link link-underline"
              >
                À propos
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/contact"
                className="nav-link link-underline"
              >
                Contact
              </LocalizedClientLink>
            </div>
            <SearchBar />
            <LocalizedClientLink
              className="hidden small:flex text-brown/70 hover:text-brown transition-colors items-center"
              href="/account"
              data-testid="nav-account-link"
              aria-label="Compte"
            >
              <User size="20" />
            </LocalizedClientLink>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="nav-link"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Panier (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
