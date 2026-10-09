"use client"

import { ArrowRightOnRectangle, Heart } from "@medusajs/icons"
import { clx } from "@modules/common/components/ui"
import { useParams, usePathname } from "next/navigation"

import { signout } from "@lib/data/customer"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import MapPin from "@modules/common/icons/map-pin"
import Package from "@modules/common/icons/package"
import User from "@modules/common/icons/user"

const AccountNav = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null
}) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }

  const handleLogout = async () => {
    await signout(countryCode)
  }

  return (
    <div>
      <div className="small:hidden" data-testid="mobile-account-nav">
        {route !== `/${countryCode}/account` ? (
          <LocalizedClientLink
            href="/account"
            className="flex items-center gap-x-2 text-small-regular py-2"
            data-testid="account-main-link"
          >
            <>
              <ChevronDown className="transform rotate-90" />
              <span>Compte</span>
            </>
          </LocalizedClientLink>
        ) : (
          <>
            <div className="font-serif text-2xl text-brown mb-4 px-1">
              Bonjour {customer?.first_name}
            </div>
            <div className="text-base-regular">
              <ul>
                <li>
                  <LocalizedClientLink
                    href="/account/profile"
                    className="flex items-center justify-between py-4 border-b border-nude px-1"
                    data-testid="profile-link"
                  >
                    <>
                      <div className="flex items-center gap-x-2">
                        <User size={20} />
                        <span>Profil</span>
                      </div>
                      <ChevronDown className="transform -rotate-90" />
                    </>
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/addresses"
                    className="flex items-center justify-between py-4 border-b border-nude px-1"
                    data-testid="addresses-link"
                  >
                    <>
                      <div className="flex items-center gap-x-2">
                        <MapPin size={20} />
                        <span>Adresses</span>
                      </div>
                      <ChevronDown className="transform -rotate-90" />
                    </>
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/orders"
                    className="flex items-center justify-between py-4 border-b border-nude px-1"
                    data-testid="orders-link"
                  >
                    <div className="flex items-center gap-x-2">
                      <Package size={20} />
                      <span>Commandes</span>
                    </div>
                    <ChevronDown className="transform -rotate-90" />
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/wishlist"
                    className="flex items-center justify-between py-4 border-b border-nude px-1"
                    data-testid="wishlist-link"
                  >
                    <div className="flex items-center gap-x-2">
                      <Heart width={20} height={20} />
                      <span>Favoris</span>
                    </div>
                    <ChevronDown className="transform -rotate-90" />
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/parrainage"
                    className="flex items-center justify-between border-b border-nude px-1 py-4"
                    data-testid="referral-link"
                  >
                    <div className="flex items-center gap-x-2">
                      <Heart width={20} height={20} />
                      <span>Parrainage</span>
                    </div>
                    <ChevronDown className="transform -rotate-90" />
                  </LocalizedClientLink>
                </li>
                <li>
                  <button
                    type="button"
                    className="flex items-center justify-between py-4 border-b border-nude px-1 w-full"
                    onClick={handleLogout}
                    data-testid="logout-button"
                  >
                    <div className="flex items-center gap-x-2">
                      <ArrowRightOnRectangle />
                      <span>Déconnexion</span>
                    </div>
                    <ChevronDown className="transform -rotate-90" />
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
      <div className="hidden small:block" data-testid="account-nav">
        <div>
          <div className="pb-5">
            <span className="eyebrow">Compte</span>
          </div>
          <div className="text-base-regular">
            <ul className="flex mb-0 justify-start items-start flex-col gap-y-4 border-l border-nude pl-5">
              <li>
                <AccountNavLink
                  href="/account"
                  route={route!}
                  data-testid="overview-link"
                >
                  Vue d&apos;ensemble
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/profile"
                  route={route!}
                  data-testid="profile-link"
                >
                  Profil
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/addresses"
                  route={route!}
                  data-testid="addresses-link"
                >
                  Adresses
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/orders"
                  route={route!}
                  data-testid="orders-link"
                >
                  Commandes
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/wishlist"
                  route={route!}
                  data-testid="wishlist-link"
                >
                  Favoris
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/parrainage"
                  route={route!}
                  data-testid="referral-link"
                >
                  Parrainage
                </AccountNavLink>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  data-testid="logout-button"
                  className="text-[11px] uppercase tracking-[0.15em] text-ui-fg-muted hover:text-brown"
                >
                  Déconnexion
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

type AccountNavLinkProps = {
  href: string
  route: string
  children: React.ReactNode
  "data-testid"?: string
}

const AccountNavLink = ({
  href,
  route,
  children,
  "data-testid": dataTestId,
}: AccountNavLinkProps) => {
  const { countryCode }: { countryCode: string } = useParams()

  const active = route.split(countryCode)[1] === href
  return (
    <LocalizedClientLink
      href={href}
      className={clx(
        "text-[11px] uppercase tracking-[0.15em] transition-colors hover:text-brown",
        active ? "text-brown" : "text-ui-fg-subtle"
      )}
      data-testid={dataTestId}
    >
      {children}
    </LocalizedClientLink>
  )
}

export default AccountNav
