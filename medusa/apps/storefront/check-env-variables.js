const c = require("ansi-colors");

const requiredEnvs = [
  {
    key: "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY",
    description:
      "Learn how to create a publishable key: https://docs.medusajs.com/v2/resources/storefront-development/publishable-api-keys",
  },
  ...[
    "LEGAL_BUSINESS_NAME",
    "LEGAL_FORM",
    "LEGAL_CAPITAL",
    "LEGAL_REGISTRY_CITY",
    "LEGAL_REGISTRATION_NUMBER",
    "LEGAL_VAT_NUMBER",
    "LEGAL_ADDRESS",
    "LEGAL_PUBLICATION_DIRECTOR",
    "LEGAL_HOST_NAME",
    "LEGAL_HOST_ADDRESS",
    "LEGAL_HOST_PHONE",
    "LEGAL_MEDIATOR_NAME",
    "LEGAL_MEDIATOR_URL",
  ].map(function (key) {
    return {
      key,
      description: "Required for compliant production legal pages.",
      productionOnly: true,
    };
  }),
];

function checkEnvVariables() {
  const missingEnvs = requiredEnvs.filter(function (env) {
    return (
      !process.env[env.key] &&
      (!env.productionOnly || process.env.NODE_ENV === "production")
    );
  });

  if (missingEnvs.length > 0) {
    console.error(
      c.red.bold("\n🚫 Error: Missing required environment variables\n")
    );

    missingEnvs.forEach(function (env) {
      console.error(c.yellow(`  ${c.bold(env.key)}`));
      if (env.description) {
        console.error(c.dim(`    ${env.description}\n`));
      }
    });

    console.error(
      c.yellow(
        "\nPlease set these variables in your .env file or environment before starting the application.\n"
      )
    );

    process.exit(1);
  }
}

module.exports = checkEnvVariables;
