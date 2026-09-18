import { retrieveCart } from "@lib/data/cart"
import { getHomeContent } from "@lib/data/home-content"
import CartDropdown from "../cart-dropdown"

export default async function CartButton() {
  const [cart, { blocks }] = await Promise.all([
    retrieveCart().catch(() => null),
    getHomeContent(),
  ])

  return <CartDropdown cart={cart} emptyText={blocks.cart_messages?.mini_cart_empty} />
}
