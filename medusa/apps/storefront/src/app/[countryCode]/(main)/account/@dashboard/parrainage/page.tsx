import { Metadata } from "next"
import { notFound } from "next/navigation"

import { retrieveCustomer } from "@lib/data/customer"
import { getMyReferralCode } from "@lib/data/referral"
import { getBaseURL } from "@lib/util/env"
import ReferralLink from "@modules/account/components/referral-link"

export const metadata: Metadata = {
  title: "Parrainage",
  description: "Parrainez vos proches et gagnez des récompenses Nura.",
}

export default async function ParrainagePage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const customer = await retrieveCustomer()

  if (!customer) {
    notFound()
  }

  const code = await getMyReferralCode()

  if (!code) {
    notFound()
  }

  const link = `${getBaseURL()}/${countryCode}?ref=${code}`

  return (
    <div className="w-full" data-testid="referral-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">Parrainage</h1>
        <p className="text-base-regular">
          Partagez votre lien : dès que la personne que vous invitez passe sa
          première commande, vous recevez chacun un code de réduction.
        </p>
      </div>
      <ReferralLink link={link} />
    </div>
  )
}
