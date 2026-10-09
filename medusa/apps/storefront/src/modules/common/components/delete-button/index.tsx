import { deleteLineItem } from "@lib/data/cart"
import { Spinner, Trash } from "@medusajs/icons"
import { clx } from "@modules/common/components/ui"
import { useState } from "react"

const DeleteButton = ({
  id,
  children,
  className,
}: {
  id: string
  children?: React.ReactNode
  className?: string
}) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setError(null)
    setIsDeleting(true)
    await deleteLineItem(id)
      .catch(() => setError("Suppression impossible. Réessayez."))
      .finally(() => setIsDeleting(false))
  }

  return (
    <div
      className={clx(
        "flex items-center justify-between text-small-regular",
        className
      )}
    >
      <button
        type="button"
        aria-label={children ? undefined : "Retirer cet article du panier"}
        disabled={isDeleting}
        className="flex min-h-11 min-w-11 items-center justify-center gap-x-1 text-ui-fg-subtle hover:text-ui-fg-base cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-50"
        onClick={() => handleDelete(id)}
      >
        {isDeleting ? <Spinner className="animate-spin" /> : <Trash />}
        <span>{children}</span>
      </button>
      {error && <span className="ml-2 text-xs text-rose-700" role="alert">{error}</span>}
    </div>
  )
}

export default DeleteButton
