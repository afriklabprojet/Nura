import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ChatBubbleLeftRight } from "@medusajs/icons"
import BlockSections, { BlockSection } from "../../components/block-sections"

const SECTIONS: BlockSection[] = [
  {
    key: "cart_messages",
    title: "Panier",
    description: "Panier vide, connexion, articles indisponibles.",
    fields: [
      { name: "empty_title", label: "Panier vide — titre" },
      { name: "empty_text", label: "Panier vide — texte", multiline: true },
      { name: "empty_cta_label", label: "Panier vide — bouton" },
      { name: "empty_cta_href", label: "Panier vide — lien du bouton" },
      { name: "sign_in_title", label: "Connexion — titre" },
      { name: "sign_in_text", label: "Connexion — texte", multiline: true },
      {
        name: "fix_cart_text",
        label: "Message quand des articles sont indisponibles",
        multiline: true,
      },
      { name: "mini_cart_empty", label: "Mini-panier vide (menu)" },
      {
        name: "mismatch_error",
        label: "Erreur de transfert de panier",
        multiline: true,
      },
      {
        name: "not_found_text",
        label: "Panier introuvable (page 404)",
        multiline: true,
      },
    ],
  },
  {
    key: "checkout_messages",
    title: "Checkout",
    description: "Livraison, paiement, consentement avant de commander.",
    fields: [
      { name: "unavailable_title", label: "Checkout indisponible — titre" },
      {
        name: "unavailable_text",
        label: "Checkout indisponible — texte",
        multiline: true,
      },
      { name: "summary_question", label: "Récapitulatif — question contact" },
      { name: "shipping_question", label: "Livraison — question" },
      { name: "pickup_label", label: "Retrait en boutique — libellé" },
      { name: "pickup_choose", label: "Retrait en boutique — sous-texte" },
      {
        name: "payment_empty",
        label: "Aucun moyen de paiement — titre",
        multiline: true,
      },
      {
        name: "payment_empty_hint",
        label: "Aucun moyen de paiement — conseil",
        multiline: true,
      },
      {
        name: "payment_error_generic",
        label: "Erreur générique de paiement",
        multiline: true,
      },
      { name: "mobile_wallet_prompt", label: "Choix du portefeuille mobile" },
      {
        name: "jeko_error",
        label: "Erreur d'initiation Jèko",
        multiline: true,
      },
      {
        name: "gift_option_text",
        label: "Offre d'emballage cadeau",
        multiline: true,
      },
      {
        name: "consent_text",
        label: "Consentement avant paiement (accepte [texte](/lien))",
        multiline: true,
      },
      {
        name: "payment_failed_text",
        label: "Paiement échoué (retour depuis Stripe/Jèko)",
        multiline: true,
      },
      {
        name: "order_failed_text",
        label: "Commande non rattachée après paiement",
        multiline: true,
      },
    ],
  },
  {
    key: "account_messages",
    title: "Compte & connexion",
    description: "Connexion, inscription, mot de passe, tableau de bord.",
    fields: [
      { name: "login_title", label: "Connexion — titre" },
      { name: "login_text", label: "Connexion — texte", multiline: true },
      {
        name: "verify_sent_text",
        label: "Email de vérification envoyé (utiliser {email})",
        multiline: true,
      },
      { name: "register_title", label: "Inscription — titre" },
      {
        name: "register_text",
        label: "Inscription — texte",
        multiline: true,
      },
      {
        name: "register_verify_text",
        label: "Inscription — email de vérification (utiliser {email})",
        multiline: true,
      },
      {
        name: "register_consent_text",
        label: "Inscription — consentement (accepte [texte](/lien))",
        multiline: true,
      },
      { name: "forgot_title", label: "Mot de passe oublié — titre" },
      {
        name: "forgot_text",
        label: "Mot de passe oublié — texte",
        multiline: true,
      },
      { name: "forgot_sent_title", label: "Email envoyé — titre" },
      {
        name: "forgot_sent_text",
        label: "Email envoyé — texte",
        multiline: true,
      },
      { name: "reset_success_title", label: "Mot de passe changé — titre" },
      {
        name: "reset_success_text",
        label: "Mot de passe changé — texte",
        multiline: true,
      },
      { name: "reset_invalid_title", label: "Lien invalide — titre" },
      {
        name: "reset_invalid_text",
        label: "Lien invalide — texte",
        multiline: true,
      },
      {
        name: "verify_success_text",
        label: "Email vérifié avec succès",
        multiline: true,
      },
      {
        name: "verify_invalid_text",
        label: "Lien de vérification invalide",
        multiline: true,
      },
      { name: "sla_text", label: "Délai de réponse du service client" },
      { name: "orders_intro", label: "Intro — Mes commandes" },
      { name: "addresses_intro", label: "Intro — Adresses", multiline: true },
      { name: "profile_intro", label: "Intro — Profil", multiline: true },
      { name: "wishlist_intro", label: "Intro — Favoris" },
      { name: "wishlist_empty_text", label: "Favoris — aucun favori" },
      {
        name: "order_overview_empty_title",
        label: "Aucune commande — titre",
      },
      {
        name: "order_overview_empty_text",
        label: "Aucune commande — texte",
      },
      {
        name: "referral_text",
        label: "Intro — Parrainage",
        multiline: true,
      },
      {
        name: "transfer_intro",
        label: "Transfert de commande — intro",
        multiline: true,
      },
    ],
  },
  {
    key: "order_messages",
    title: "Commandes",
    description: "Confirmation de commande et transfert de propriété.",
    fields: [
      { name: "thank_you_title", label: "Confirmation — titre" },
      { name: "thank_you_text", label: "Confirmation — texte" },
      {
        name: "confirmation_email_text",
        label: "Email de confirmation envoyé (utiliser {email})",
        multiline: true,
      },
      { name: "help_title", label: "Besoin d'aide — titre" },
      { name: "transfer_success_text", label: "Transfert accepté" },
      { name: "transfer_declined_text", label: "Transfert refusé" },
      {
        name: "transfer_request_text",
        label: "Demande de transfert reçue (utiliser {id})",
        multiline: true,
      },
      {
        name: "transfer_ownership_text",
        label: "Transfert — conséquences pour le nouveau propriétaire",
        multiline: true,
      },
      {
        name: "transfer_ignore_text",
        label: "Transfert — si vous ignorez la demande",
        multiline: true,
      },
    ],
  },
  {
    key: "not_found_messages",
    title: "Pages d'erreur",
    description: "Page introuvable (404) et erreur de chargement.",
    fields: [
      { name: "title", label: "404 — titre" },
      { name: "text", label: "404 — texte" },
      { name: "error_eyebrow", label: "Erreur de chargement — sur-titre" },
      { name: "error_title", label: "Erreur de chargement — titre" },
      {
        name: "error_text",
        label: "Erreur de chargement — texte",
        multiline: true,
      },
    ],
  },
]

const ParcoursClientPage = () => <BlockSections sections={SECTIONS} />

export const config = defineRouteConfig({
  label: "Parcours client",
  icon: ChatBubbleLeftRight,
})

export default ParcoursClientPage
