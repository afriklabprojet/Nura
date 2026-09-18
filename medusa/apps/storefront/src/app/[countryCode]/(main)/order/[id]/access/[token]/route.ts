import { verifyOrderAccessToken } from "@lib/data/cookies"
import { NextRequest, NextResponse } from "next/server"

type OrderAccessRouteParams = {
  params: Promise<{
    countryCode: string
    id: string
    token: string
  }>
}

export async function GET(
  request: NextRequest,
  { params }: OrderAccessRouteParams
) {
  const { countryCode, id, token } = await params

  if (!/^order_[a-z0-9]+$/i.test(id) || !verifyOrderAccessToken(id, token)) {
    return new NextResponse("Lien de commande invalide ou expiré.", {
      status: 401,
    })
  }

  const expiresAt = Number(token.split(".")[0])
  const maxAge = Math.max(1, Math.floor((expiresAt - Date.now()) / 1000))
  const response = NextResponse.redirect(
    new URL(`/${countryCode}/order/${id}/confirmed`, request.url),
    303
  )

  response.cookies.set(`_nura_order_${id}`, token, {
    maxAge,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })

  return response
}
