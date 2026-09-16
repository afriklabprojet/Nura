import { Metadata } from "next"
import LegalPageLayout from "@modules/legal/components/legal-page-layout"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { CONTACT_EMAIL, SERVICE_CLIENT_CONTACTS } from "@lib/constants"

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales de la maison Nura.",
}

export default function MentionsLegalesPage() {
  return (
    <LegalPageLayout title="Mentions légales" updatedAt="14 septembre 2026">
      <section>
        <h2>Éditeur du site</h2>
        <p>
          Le site nura-paris.com est édité par :
          <br />
          <strong>[À COMPLÉTER : dénomination sociale]</strong>, [À
          COMPLÉTER : forme juridique, ex. SASU / SARL], au capital de [À
          COMPLÉTER : montant] €
          <br />
          Immatriculée au RCS de [À COMPLÉTER : ville] sous le numéro [À
          COMPLÉTER : SIREN/SIRET]
          <br />
          Numéro de TVA intracommunautaire : [À COMPLÉTER]
          <br />
          Siège social : [À COMPLÉTER : adresse complète]
          <br />
          Téléphone :{" "}
          {SERVICE_CLIENT_CONTACTS.map(
            (contact) => `${contact.label} ${contact.display}`
          ).join(" · ")}
          <br />
          Email : <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </section>

      <section>
        <h2>Directeur de la publication</h2>
        <p>[À COMPLÉTER : nom du responsable légal de la publication]</p>
      </section>

      <section>
        <h2>Hébergement</h2>
        <p>
          Le site est hébergé par :
          <br />
          <strong>[À COMPLÉTER : nom de l&apos;hébergeur]</strong>
          <br />
          [À COMPLÉTER : adresse de l&apos;hébergeur]
          <br />
          [À COMPLÉTER : téléphone de l&apos;hébergeur]
        </p>
      </section>

      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble des contenus présents sur ce site (textes, images,
          logos, photographies, charte graphique) est la propriété exclusive
          de Nura ou de ses partenaires, et est protégé par le droit
          d&apos;auteur. Toute reproduction, représentation, modification ou
          exploitation, totale ou partielle, sans autorisation écrite
          préalable, est interdite et constitue une contrefaçon sanctionnée
          par le Code de la propriété intellectuelle.
        </p>
      </section>

      <section>
        <h2>Données personnelles</h2>
        <p>
          Le traitement des données personnelles collectées sur ce site est
          détaillé dans notre{" "}
          <LocalizedClientLink href="/confidentialite">
            politique de confidentialité
          </LocalizedClientLink>
          .
        </p>
      </section>

      <section>
        <h2>Médiation de la consommation</h2>
        <p>
          Conformément à l&apos;article L.616-1 du Code de la consommation,
          tout client peut recourir gratuitement au service de médiation
          [À COMPLÉTER : nom du médiateur de la consommation] en cas de
          litige non résolu directement avec notre service client, dans un
          délai d&apos;un an à compter de sa réclamation écrite. [À
          COMPLÉTER : coordonnées / site du médiateur choisi].
        </p>
      </section>
    </LegalPageLayout>
  )
}
