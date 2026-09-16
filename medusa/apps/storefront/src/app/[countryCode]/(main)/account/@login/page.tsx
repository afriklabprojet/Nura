import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: { absolute: "Connexion | Nura" },
  description: "Connectez-vous à votre compte Nura.",
}

export default function Login() {
  return <LoginTemplate />
}
