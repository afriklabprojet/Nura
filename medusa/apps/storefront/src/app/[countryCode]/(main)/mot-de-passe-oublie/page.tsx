import { Metadata } from "next"
import ForgotPassword from "@modules/account/components/forgot-password"

export const metadata: Metadata = {
  title: "Mot de passe oublié",
  description: "Réinitialisez le mot de passe de votre compte Nura.",
}

export default function ForgotPasswordPage() {
  return (
    <div className="w-full flex justify-center px-8 py-12">
      <ForgotPassword />
    </div>
  )
}
