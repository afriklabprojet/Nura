import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import { updateCustomerPasswordWorkflow } from "../../../../../workflows/update-customer-password"

type UpdatePasswordBody = {
  current_password?: string
  new_password?: string
}

export async function POST(
  req: AuthenticatedMedusaRequest<UpdatePasswordBody>,
  res: MedusaResponse
) {
  const { current_password: currentPassword, new_password: newPassword } =
    req.body ?? {}

  if (!currentPassword || !newPassword) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Current and new passwords are required."
    )
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const {
    data: [customer],
  } = await query.graph({
    entity: "customer",
    fields: ["email"],
    filters: { id: req.auth_context.actor_id },
  })

  if (!customer?.email) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "Customer not found.")
  }

  const authService = req.scope.resolve(Modules.AUTH)
  const authentication = await authService.authenticate("emailpass", {
    url: req.url,
    body: { email: customer.email, password: currentPassword },
    protocol: req.protocol,
  })

  if (!authentication.success) {
    throw new MedusaError(
      MedusaError.Types.UNAUTHORIZED,
      "Current password is incorrect."
    )
  }

  await updateCustomerPasswordWorkflow(req.scope).run({
    input: {
      email: customer.email,
      new_password: newPassword,
    },
  })

  return res.status(200).json({ success: true })
}