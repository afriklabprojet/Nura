"use client"

import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react"
import { CONTACT_EMAIL, SERVICE_CLIENT_CONTACTS } from "@lib/constants"
import useToggleState from "@lib/hooks/use-toggle-state"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { MenuCategory } from "@modules/layout/components/desktop-menu"
import { Text, clx } from "@modules/common/components/ui"
import { Fragment } from "react"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { Locale } from "@lib/data/locales"

const SECONDARY_LINKS = {
  "À propos": "/a-propos",
  FAQ: "/faq",
  Contact: "/contact",
  Compte: "/account",
}

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
  categories: MenuCategory[]
}

const SideMenu = ({
  regions,
  locales,
  currentLocale,
  categories,
}: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <PopoverButton
                  data-testid="nav-menu-button"
                  aria-label="Ouvrir le menu"
                  className="relative h-full flex items-center gap-x-2 text-brown focus:outline-none"
                >
                  <span className="flex flex-col gap-[5px]" aria-hidden="true">
                    <span className="block h-px w-5 bg-current" />
                    <span className="block h-px w-5 bg-current" />
                    <span className="block h-px w-5 bg-current" />
                  </span>
                </PopoverButton>
              </div>

              {open && (
                <div
                  className="fixed inset-0 z-[60] bg-ink/30"
                  onClick={close}
                  data-testid="side-menu-backdrop"
                />
              )}

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 -translate-x-4"
                enterTo="opacity-100 translate-x-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 -translate-x-4"
              >
                <PopoverPanel className="flex flex-col fixed left-0 top-0 w-full xsmall:w-[380px] h-screen z-[61] bg-bg-alt border-r border-nude">
                  <div
                    data-testid="nav-menu-popup"
                    className="flex flex-col h-full justify-between overflow-y-auto p-6 pb-10"
                  >
                    <div className="flex flex-col gap-y-8">
                      <div className="flex justify-end" id="xmark">
                        <button
                          data-testid="close-menu-button"
                          onClick={close}
                          aria-label="Fermer le menu"
                          className="text-brown hover:text-gold"
                        >
                          <XMark />
                        </button>
                      </div>

                      <ul className="flex flex-col gap-y-4">
                        {categories.map((category) => (
                          <li key={category.id}>
                            <LocalizedClientLink
                              href={`/categories/${category.handle}`}
                              className="font-serif text-3xl text-brown hover:text-gold transition-colors"
                              onClick={close}
                            >
                              {category.name}
                            </LocalizedClientLink>
                            {category.children.length > 0 && (
                              <ul className="mt-2 ml-1 flex flex-col gap-y-2 border-l border-nude pl-4">
                                {category.children.map((child) => (
                                  <li key={child.id}>
                                    <LocalizedClientLink
                                      href={`/categories/${category.handle}/${child.handle}`}
                                      className="txt-small text-ui-fg-subtle hover:text-gold"
                                      onClick={close}
                                    >
                                      {child.name}
                                    </LocalizedClientLink>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                        <li>
                          <LocalizedClientLink
                            href="/collections"
                            className="font-serif text-3xl text-brown hover:text-gold transition-colors"
                            onClick={close}
                            data-testid="collections-link"
                          >
                            Collections
                          </LocalizedClientLink>
                        </li>
                        <li>
                          <LocalizedClientLink
                            href="/store"
                            className="font-serif text-3xl text-brown hover:text-gold transition-colors"
                            onClick={close}
                            data-testid="boutique-link"
                          >
                            Tout voir
                          </LocalizedClientLink>
                        </li>
                      </ul>

                      <ul className="flex flex-col gap-y-3 border-t border-nude pt-6">
                        {Object.entries(SECONDARY_LINKS).map(([name, href]) => (
                          <li key={name}>
                            <LocalizedClientLink
                              href={href}
                              className="text-xs uppercase tracking-[0.2em] text-brown/70 hover:text-brown"
                              onClick={close}
                              data-testid={`${name.toLowerCase()}-link`}
                            >
                              {name}
                            </LocalizedClientLink>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col gap-y-5 border-t border-nude pt-6 mt-10">
                      <div className="flex flex-col gap-y-2">
                        <span className="eyebrow">Service client</span>
                        {SERVICE_CLIENT_CONTACTS.map((contact) => (
                          <a
                            key={contact.tel}
                            href={`tel:${contact.tel}`}
                            className="txt-small text-ui-fg-subtle hover:text-gold"
                          >
                            {contact.label} : {contact.display}
                          </a>
                        ))}
                        <a
                          href={`mailto:${CONTACT_EMAIL}`}
                          className="txt-small text-ui-fg-subtle hover:text-gold"
                        >
                          {CONTACT_EMAIL}
                        </a>
                      </div>

                      {!!locales?.length && (
                        <div
                          className="flex justify-between text-brown"
                          onMouseEnter={languageToggleState.open}
                          onMouseLeave={languageToggleState.close}
                        >
                          <LanguageSelect
                            toggleState={languageToggleState}
                            locales={locales}
                            currentLocale={currentLocale}
                          />
                          <ArrowRightMini
                            className={clx(
                              "transition-transform duration-150",
                              languageToggleState.state ? "-rotate-90" : ""
                            )}
                          />
                        </div>
                      )}
                      <div
                        className="flex justify-between text-brown"
                        onMouseEnter={countryToggleState.open}
                        onMouseLeave={countryToggleState.close}
                      >
                        {regions && (
                          <CountrySelect
                            toggleState={countryToggleState}
                            regions={regions}
                          />
                        )}
                        <ArrowRightMini
                          className={clx(
                            "transition-transform duration-150",
                            countryToggleState.state ? "-rotate-90" : ""
                          )}
                        />
                      </div>
                      <Text className="txt-compact-small text-ui-fg-muted">
                        © {new Date().getFullYear()} Nura
                      </Text>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
