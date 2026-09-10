import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const modules: any[] = []

// Stripe is optional: only registered once STRIPE_API_KEY is set, so the
// backend keeps booting with the manual/test payment provider until a real
// Stripe account is connected.
if (process.env.STRIPE_API_KEY) {
  modules.push({
    resolve: '@medusajs/medusa/payment',
    options: {
      providers: [
        {
          resolve: '@medusajs/medusa/payment-stripe',
          id: 'stripe',
          options: {
            apiKey: process.env.STRIPE_API_KEY,
            webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
          },
        },
      ],
    },
  })
}

// Resend is optional: only registered once RESEND_API_KEY is set. Without
// it, notifications (contact form, order confirmations, invites...) just
// get logged instead of emailed.
if (process.env.RESEND_API_KEY) {
  modules.push({
    resolve: '@medusajs/medusa/notification',
    options: {
      providers: [
        {
          resolve: './src/modules/resend-notification',
          id: 'resend',
          options: {
            channels: ['email'],
            api_key: process.env.RESEND_API_KEY,
            from: process.env.RESEND_FROM_EMAIL,
          },
        },
      ],
    },
  })
}

// RBAC (Super Admin / Admin / Manager roles). Medusa's own
// `disable: !FeatureFlag.isFeatureEnabled("rbac")` default for this module
// is evaluated inside defineConfig() itself, which runs before the async
// feature-flag loader has read MEDUSA_FF_RBAC from the environment — so the
// module never actually registers even with the env var set. Registering it
// explicitly here (reading process.env directly, no such ordering issue)
// works around that. MEDUSA_FF_RBAC still needs to be set to `true` so the
// admin dashboard shows the Roles screens.
if (process.env.MEDUSA_FF_RBAC === 'true') {
  modules.push({ resolve: '@medusajs/medusa/rbac' })
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    }
  },
  modules,
})
