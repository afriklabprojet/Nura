/** Renders an admin-editable notice with {email} swapped for the actual
 * address in bold — used by the login/register verification messages. */
const EmailNotice = ({ text, email }: { text: string; email: string }) => {
  const [before, after] = text.split("{email}")

  if (after === undefined) {
    return <>{text}</>
  }

  return (
    <>
      {before}
      <strong>{email}</strong>
      {after}
    </>
  )
}

export default EmailNotice
