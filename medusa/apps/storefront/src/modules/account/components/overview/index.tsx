import { Container } from "@modules/common/components/ui"

import ChevronDown from "@modules/common/icons/chevron-down"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  return (
    <div data-testid="overview-page-wrapper">
      <div>
        <div className="mb-4 flex flex-col gap-2 text-xl-semi xsmall:flex-row xsmall:items-center xsmall:justify-between">
          <span data-testid="welcome-message" data-value={customer?.first_name}>
            Bonjour {customer?.first_name}
          </span>
          <span className="text-small-regular text-ui-fg-base">
            Connecté(e) en tant que :{" "}
            <span
              className="font-semibold"
              data-testid="customer-email"
              data-value={customer?.email}
            >
              {customer?.email}
            </span>
          </span>
        </div>
        <div className="flex flex-col border-t border-nude py-8">
          <div className="flex flex-col gap-y-4 h-full col-span-1 row-span-2 flex-1">
            <div className="mb-8 grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-y-4">
                <h3 className="text-large-semi">Profil</h3>
                <div className="flex items-end gap-x-2">
                  <span
                    className="text-3xl-semi leading-none"
                    data-testid="customer-profile-completion"
                    data-value={getProfileCompletion(customer)}
                  >
                    {getProfileCompletion(customer)}%
                  </span>
                  <span className="uppercase text-base-regular text-ui-fg-subtle">
                    Complété
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-y-4">
                <h3 className="text-large-semi">Adresses</h3>
                <div className="flex items-end gap-x-2">
                  <span
                    className="text-3xl-semi leading-none"
                    data-testid="addresses-count"
                    data-value={customer?.addresses?.length || 0}
                  >
                    {customer?.addresses?.length || 0}
                  </span>
                  <span className="uppercase text-base-regular text-ui-fg-subtle">
                    Enregistrées
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-x-2">
                <h3 className="text-large-semi">Commandes récentes</h3>
              </div>
              <ul
                className="flex flex-col gap-y-4"
                data-testid="orders-wrapper"
              >
                {orders && orders.length > 0 ? (
                  orders.slice(0, 5).map((order) => {
                    return (
                      <li
                        key={order.id}
                        data-testid="order-wrapper"
                        data-value={order.id}
                      >
                        <LocalizedClientLink
                          href={`/account/orders/details/${order.id}`}
                        >
                          <Container className="flex items-center justify-between bg-bg-alt p-4">
                            <div className="grid flex-1 grid-cols-1 gap-3 text-small-regular xsmall:grid-cols-3 xsmall:gap-4">
                              <div>
                                <span className="block font-semibold">Date</span>
                                <span data-testid="order-created-date">
                                  {new Date(order.created_at).toLocaleDateString("fr-FR")}
                                </span>
                              </div>
                              <div>
                                <span className="block font-semibold">N° de commande</span>
                                <span data-testid="order-id" data-value={order.display_id}>
                                  #{order.display_id}
                                </span>
                              </div>
                              <div>
                                <span className="block font-semibold">Montant total</span>
                                <span data-testid="order-amount">
                                  {convertToLocale({
                                    amount: order.total,
                                    currency_code: order.currency_code,
                                  })}
                                </span>
                              </div>
                            </div>
                            <span className="flex h-11 w-11 items-center justify-center" aria-hidden="true">
                              <ChevronDown className="-rotate-90" />
                            </span>
                          </Container>
                        </LocalizedClientLink>
                      </li>
                    )
                  })
                ) : (
                  <span data-testid="no-orders-message">Aucune commande récente</span>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0

  if (!customer) {
    return 0
  }

  if (customer.email) {
    count++
  }

  if (customer.first_name && customer.last_name) {
    count++
  }

  if (customer.phone) {
    count++
  }

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  if (billingAddress) {
    count++
  }

  return (count / 4) * 100
}

export default Overview
