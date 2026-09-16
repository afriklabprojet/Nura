"use client"

import React, { useActionState, useEffect } from "react"
import Input from "@modules/common/components/input"
import AccountInfo from "../account-info"
import { HttpTypes } from "@medusajs/types"
import { updatePassword } from "@lib/data/customer"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const ProfilePassword: React.FC<MyInformationProps> = ({
  customer: _customer,
}) => {
  const [successState, setSuccessState] = React.useState(false)

  const [state, formAction] = useActionState(updatePassword, {
    error: null as string | null,
    success: false,
  })

  const clearState = () => {
    setSuccessState(false)
  }

  useEffect(() => {
    setSuccessState(state.success)
  }, [state])

  return (
    <form action={formAction} className="w-full">
      <AccountInfo
        label="Mot de passe"
        currentInfo={
          <span>
            Le mot de passe n&apos;est pas affiché pour des raisons de
            sécurité
          </span>
        }
        isSuccess={successState}
        isError={!!state.error}
        errorMessage={state.error || undefined}
        clearState={clearState}
        data-testid="account-password-editor"
      >
        <div className="grid grid-cols-1 small:grid-cols-3 gap-4">
          <Input
            label="Mot de passe actuel"
            name="old_password"
            required
            type="password"
            autoComplete="current-password"
            data-testid="old-password-input"
          />
          <Input
            label="Nouveau mot de passe"
            type="password"
            name="new_password"
            required
            autoComplete="new-password"
            data-testid="new-password-input"
          />
          <Input
            label="Confirmer le mot de passe"
            type="password"
            name="confirm_password"
            required
            autoComplete="new-password"
            data-testid="confirm-password-input"
          />
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfilePassword
