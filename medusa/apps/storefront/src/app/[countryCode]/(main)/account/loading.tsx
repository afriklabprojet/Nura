import Spinner from "@modules/common/icons/spinner"

export default function Loading() {
  return (
    <div className="flex min-h-64 w-full items-center justify-center gap-3 text-ui-fg-base" role="status">
      <Spinner size={36} aria-hidden="true" />
      <span>Chargement de votre compte…</span>
    </div>
  )
}
