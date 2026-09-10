import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  createRbacPoliciesWorkflow,
  createRbacRolesWorkflow,
} from "@medusajs/medusa/core-flows"

/**
 * Seeds "Admin" and "Manager" roles alongside the core-seeded "Super Admin".
 * Enforcement for the resources referenced here lives in
 * src/api/middlewares.ts — see the comment there for exactly which routes
 * each policy actually gates.
 *
 * Idempotent: safe to re-run (checks for existing roles by name first).
 */
export default async function seedRbacRoles({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: existingRoles } = await query.graph({
    entity: "rbac_role",
    fields: ["id", "name"],
    filters: { name: ["Admin", "Manager"] },
  })

  if (existingRoles.length) {
    logger.info(
      `RBAC roles already seeded (${existingRoles
        .map((r) => r.name)
        .join(", ")}). Skipping.`
    )
    return
  }

  logger.info("Seeding Admin and Manager RBAC policies...")

  const adminResources = [
    "user",
    "store",
    "api_key",
    "product",
    "order",
    "customer",
    "promotion",
    "pricing",
    "inventory",
  ]

  const { result: adminPolicies } = await createRbacPoliciesWorkflow(
    container
  ).run({
    input: {
      policies: adminResources.map((resource) => ({
        key: `${resource}:*:admin`,
        resource,
        operation: "*",
        name: `Admin — ${resource}`,
      })),
    },
  })

  // Medusa's core routes check CRUD-verb operations ("create"/"read"/"update"/
  // "delete"), not "write" — and creating/editing a product also touches the
  // inventory_item and price resources under the hood, so Manager needs
  // those too (without delete) to actually be able to save a product.
  const managerResources = [
    "product",
    "order",
    "customer",
    "inventory",
    "inventory_item",
    "price",
  ]
  const managerOperations = ["read", "create", "update"]

  const { result: managerPolicies } = await createRbacPoliciesWorkflow(
    container
  ).run({
    input: {
      policies: managerResources.flatMap((resource) =>
        managerOperations.map((operation) => ({
          key: `${resource}:${operation}:manager`,
          resource,
          operation,
          name: `Manager — ${resource} (${operation})`,
        }))
      ),
    },
  })

  logger.info("Seeding Admin and Manager RBAC roles...")

  await createRbacRolesWorkflow(container).run({
    input: {
      roles: [
        {
          name: "Admin",
          description:
            "Full operational access (products, orders, customers, promotions, pricing, inventory, users, store settings). Cannot manage roles/permissions — reserved for Super Admin.",
          policy_ids: adminPolicies.map((p) => p.id),
        },
        {
          name: "Manager",
          description:
            "Day-to-day operations: read/write on products, orders, customers and inventory. No access to users, store settings, API keys, RBAC, or deleting records.",
          policy_ids: managerPolicies.map((p) => p.id),
        },
      ],
    },
  })

  logger.info("Finished seeding Admin and Manager roles.")
}
