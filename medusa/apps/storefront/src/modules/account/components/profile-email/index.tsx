import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text } from "@modules/common/components/ui"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

// Read-only: Medusa's customer record and the auth identity used to log in
// are two separate things, and changing one doesn't update the other — a
// simple edit form here would silently desync the two (the profile would
// show a new email while the customer still has to log in with the old
// one). Until there's a proper "change email" flow that updates both,
// this stays read-only rather than pretending to work.
const ProfileEmail: React.FC<MyInformationProps> = ({ customer }) => {
  return (
    <div className="text-small-regular" data-testid="account-email-editor">
      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <span className="uppercase text-ui-fg-base">Email</span>
          <span className="font-semibold" data-testid="current-info">
            {customer.email}
          </span>
        </div>
      </div>
      <Text className="txt-small text-ui-fg-subtle mt-1">
        Pour changer l&apos;email associé à votre compte,{" "}
        <LocalizedClientLink href="/contact" className="underline">
          contactez-nous
        </LocalizedClientLink>
        .
      </Text>
    </div>
  )
}

export default ProfileEmail
