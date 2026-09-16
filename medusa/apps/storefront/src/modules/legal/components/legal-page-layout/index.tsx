type LegalPageLayoutProps = {
  title: string
  updatedAt: string
  children: React.ReactNode
}

export default function LegalPageLayout({
  title,
  updatedAt,
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="content-container py-12 small:py-24">
      <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-y-3 mb-12">
        <span className="text-xs uppercase tracking-[0.3em] text-gold">
          Nura
        </span>
        <h1 className="font-serif text-4xl text-brown">{title}</h1>
        <p className="text-ui-fg-muted txt-small">
          Dernière mise à jour : {updatedAt}
        </p>
      </div>
      <div className="max-w-2xl mx-auto flex flex-col gap-y-8 text-ui-fg-subtle txt-medium leading-relaxed [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-brown [&_h2]:mb-3 [&_section]:flex [&_section]:flex-col [&_section]:gap-y-3 [&_a]:text-gold [&_a]:hover:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-y-1 [&_strong]:text-ui-fg-base">
        {children}
      </div>
    </div>
  )
}
