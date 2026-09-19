import { getHomeContent } from "@lib/data/home-content"
import { Heading, Text } from "@modules/common/components/ui"
import TransferActions from "@modules/order/components/transfer-actions"
import TransferImage from "@modules/order/components/transfer-image"

export default async function TransferPage({
  params,
}: {
  params: { id: string; token: string }
}) {
  const { id, token } = params
  const { blocks } = await getHomeContent()
  const messages = blocks.order_messages

  const requestText = (
    messages?.transfer_request_text ||
    "Vous avez reçu une demande de transfert de propriété pour votre commande ({id}). Si vous acceptez cette demande, vous pouvez approuver le transfert en cliquant sur le bouton ci-dessous."
  ).replaceAll("{id}", id)

  return (
    <div className="content-container mx-auto mb-20 mt-10 flex max-w-3xl flex-col items-start gap-y-4">
      <TransferImage />
      <div className="flex flex-col gap-y-6">
        <Heading level="h1" className="break-words text-2xl text-brown">
          Demande de transfert pour la commande {id}
        </Heading>
        <Text className="text-ui-fg-subtle">{requestText}</Text>
        <div className="h-px w-full bg-nude" />
        <Text className="text-ui-fg-subtle">
          {messages?.transfer_ownership_text ||
            "Si vous acceptez, le nouveau propriétaire prendra en charge toutes les responsabilités et autorisations associées à cette commande."}
        </Text>
        <Text className="text-ui-fg-subtle">
          {messages?.transfer_ignore_text ||
            "Si vous ne reconnaissez pas cette demande ou souhaitez conserver la propriété de la commande, aucune action supplémentaire n'est nécessaire."}
        </Text>
        <div className="h-px w-full bg-nude" />
        <TransferActions
          id={id}
          token={token}
          successText={messages?.transfer_success_text}
          declinedText={messages?.transfer_declined_text}
        />
      </div>
    </div>
  )
}
