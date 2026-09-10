import { defineMiddlewares } from "@medusajs/framework/http"

/**
 * RBAC enforcement for the admin dashboard.
 *
 * Medusa's core admin routes don't enforce RBAC policies out of the box —
 * only the /admin/rbac/* management routes do. This file fills that gap for
 * the routes where the Super Admin / Admin / Manager split (see
 * src/scripts/seed-rbac-roles.ts) actually needs to matter:
 *
 * - User, invite, store and API key management: Manager is blocked
 *   entirely; only Admin and Super Admin can reach these.
 * - Deleting core commerce records: Manager can create and edit products,
 *   orders, customers, etc., but can't delete them.
 *
 * Read/write on the day-to-day commerce resources (products, orders,
 * customers, inventory, promotions, pricing) is intentionally left
 * unrestricted here — Manager is meant to operate those freely; Admin and
 * Super Admin already can via their wildcard-ish role policies.
 *
 * When MEDUSA_FF_RBAC isn't enabled, these `policies` entries are no-ops
 * (the underlying check fails open), so this file is always safe to load.
 */
export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/users*",
      policies: { resource: "user", operation: "*" },
    },
    {
      matcher: "/admin/invites*",
      policies: { resource: "user", operation: "*" },
    },
    {
      matcher: "/admin/stores*",
      policies: { resource: "store", operation: "*" },
    },
    {
      matcher: "/admin/api-keys*",
      policies: { resource: "api_key", operation: "*" },
    },
    {
      matcher: "/admin/products/:id",
      methods: ["DELETE"],
      policies: { resource: "product", operation: "delete" },
    },
    {
      matcher: "/admin/product-categories/:id",
      methods: ["DELETE"],
      policies: { resource: "product", operation: "delete" },
    },
    {
      matcher: "/admin/collections/:id",
      methods: ["DELETE"],
      policies: { resource: "product", operation: "delete" },
    },
    {
      matcher: "/admin/orders/:id",
      methods: ["DELETE"],
      policies: { resource: "order", operation: "delete" },
    },
    {
      matcher: "/admin/draft-orders/:id",
      methods: ["DELETE"],
      policies: { resource: "order", operation: "delete" },
    },
    {
      matcher: "/admin/customers/:id",
      methods: ["DELETE"],
      policies: { resource: "customer", operation: "delete" },
    },
    {
      matcher: "/admin/customer-groups/:id",
      methods: ["DELETE"],
      policies: { resource: "customer", operation: "delete" },
    },
    {
      matcher: "/admin/promotions/:id",
      methods: ["DELETE"],
      policies: { resource: "promotion", operation: "delete" },
    },
    {
      matcher: "/admin/price-lists/:id",
      methods: ["DELETE"],
      policies: { resource: "pricing", operation: "delete" },
    },
  ],
})
