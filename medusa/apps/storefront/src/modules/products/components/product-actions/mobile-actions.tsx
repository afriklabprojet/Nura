import { Dialog, Transition } from "@headlessui/react"
import { Button, clx } from "@modules/common/components/ui"
import React, { Fragment, useMemo } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import ChevronDown from "@modules/common/icons/chevron-down"
import X from "@modules/common/icons/x"

import { getProductPrice } from "@lib/util/get-product-price"
import OptionSelect from "./option-select"
import { HttpTypes } from "@medusajs/types"
import { isSimpleProduct } from "@lib/util/product"

type MobileActionsProps = {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  options: Record<string, string | undefined>
  updateOptions: (title: string, value: string) => void
  inStock?: boolean
  handleAddToCart: () => Promise<void>
  isAdding?: boolean
  show: boolean
  optionsDisabled: boolean
}

const MobileActions: React.FC<MobileActionsProps> = ({
  product,
  variant,
  options,
  updateOptions,
  inStock,
  handleAddToCart,
  isAdding,
  show,
  optionsDisabled,
}) => {
  const { state, open, close } = useToggleState()

  const price = getProductPrice({
    product: product,
    variantId: variant?.id,
  })

  const selectedPrice = useMemo(() => {
    if (!price) {
      return null
    }
    const { variantPrice, cheapestPrice } = price

    return variantPrice || cheapestPrice || null
  }, [price])

  const isSimple = isSimpleProduct(product)

  const addFromOptions = async () => {
    await handleAddToCart()
    close()
  }

  return (
    <>
      <div
        className={clx("fixed inset-x-0 bottom-0 z-50 bg-bg-alt small:hidden", {
          "pointer-events-none": !show,
        })}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <Transition
          as={Fragment}
          show={show}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="border-t border-nude bg-bg-alt/95 px-5 py-3 shadow-[0_-8px_24px_rgba(47,35,27,0.08)] backdrop-blur"
            data-testid="mobile-actions"
          >
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="truncate text-ui-fg-subtle" data-testid="mobile-title">
                {variant ? Object.values(options).join(" / ") : "Choisir un format"}
              </span>
              {selectedPrice ? (
                <div className="flex shrink-0 items-end gap-x-2 text-ui-fg-base">
                  {selectedPrice.price_type === "sale" && (
                    <p>
                      <span className="line-through text-small-regular">
                        {selectedPrice.original_price}
                      </span>
                    </p>
                  )}
                  <span
                    className={clx({
                      "text-ui-fg-interactive":
                        selectedPrice.price_type === "sale",
                    })}
                  >
                    {selectedPrice.calculated_price}
                  </span>
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <div className={clx("grid w-full grid-cols-2 gap-2", {
              "!grid-cols-1": isSimple
            })}>
              {!isSimple && <Button
                onClick={open}
                variant="secondary"
                className="h-12 w-full px-3"
                data-testid="mobile-actions-button"
              >
                <div className="flex items-center justify-between w-full">
                  <span>Options</span>
                  <ChevronDown />
                </div>
              </Button>}
              <Button
                onClick={handleAddToCart}
                disabled={!inStock || !variant || optionsDisabled}
                className="h-12 w-full px-3"
                isLoading={isAdding}
                data-testid="mobile-cart-button"
              >
                {!variant
                  ? "Sélectionner une variante"
                  : !inStock
                  ? "Épuisé"
                  : "Ajouter au panier"}
              </Button>
            </div>
          </div>
        </Transition>
      </div>
      <Transition appear show={state} as={Fragment}>
        <Dialog as="div" className="relative z-[75]" onClose={close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-700 bg-opacity-75 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-x-0 bottom-0">
            <div className="flex min-h-full items-end justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Panel
                  className="flex max-h-[100dvh] w-full transform flex-col overflow-hidden bg-bg-alt text-left shadow-2xl"
                  data-testid="mobile-actions-modal"
                >
                  <div className="flex w-full items-center justify-between border-b border-nude px-5 py-4">
                    <div>
                      <Dialog.Title className="font-serif text-2xl text-brown">
                        Choisir votre format
                      </Dialog.Title>
                      <p className="mt-1 text-sm text-ui-fg-subtle">
                        {product.title}
                      </p>
                    </div>
                    <button
                      onClick={close}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-nude text-brown"
                      aria-label="Fermer"
                      data-testid="close-modal-button"
                    >
                      <X />
                    </button>
                  </div>
                  <div className="overflow-y-auto px-5 py-6">
                    {(product.variants?.length ?? 0) > 1 && (
                      <div className="flex flex-col gap-y-6">
                        {(product.options || []).map((option) => {
                          return (
                            <div key={option.id}>
                              <OptionSelect
                                option={option}
                                variants={product.variants}
                                current={options[option.id]}
                                updateOption={updateOptions}
                                title={option.title ?? ""}
                                disabled={optionsDisabled}
                              />
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                  <div
                    className="shrink-0 border-t border-nude bg-bg-alt px-5 pt-4"
                    style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
                  >
                    <div className="mb-3 flex items-center justify-between text-sm">
                      <span className="text-ui-fg-subtle">
                        {variant ? Object.values(options).join(" / ") : "Sélectionnez un format"}
                      </span>
                      {selectedPrice && (
                        <span className="font-medium text-brown">
                          {selectedPrice.calculated_price}
                        </span>
                      )}
                    </div>
                    <Button
                      onClick={addFromOptions}
                      disabled={!inStock || !variant || optionsDisabled}
                      className="h-12 w-full"
                      isLoading={isAdding}
                    >
                      {!variant
                        ? "Sélectionner une variante"
                        : !inStock
                        ? "Épuisé"
                        : "Ajouter au panier"}
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default MobileActions
