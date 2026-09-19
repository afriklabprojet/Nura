import { getHomeContent } from "@lib/data/home-content"
import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: { absolute: "Connexion | Nura" },
  description: "Connectez-vous à votre compte Nura.",
}

export default async function Login() {
  const { blocks } = await getHomeContent()

  return <LoginTemplate messages={blocks.account_messages} />
}
