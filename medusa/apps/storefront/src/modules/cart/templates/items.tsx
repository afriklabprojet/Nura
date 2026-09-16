import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Table } from "@modules/common/components/ui"

import Item from "@modules/cart/components/item"
import MobileItem from "@modules/cart/components/item/mobile-item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = [...(cart?.items || [])].sort((a, b) =>
    (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
  )

  if (!cart?.items) {
    return (
      <Table>
        <Table.Body>
          {repeat(3).map((i) => (
            <SkeletonLineItem key={i} />
          ))}
        </Table.Body>
      </Table>
    )
  }

  return (
    <div>
      {/* Cards on a phone: the four-column table cannot fit without
          truncating the price. */}
      <ul className="flex flex-col small:hidden">
        {items.map((item) => (
          <MobileItem
            key={item.id}
            item={item}
            currencyCode={cart.currency_code}
          />
        ))}
      </ul>

      <Table className="hidden small:table">
        <Table.Header className="border-t-0">
          <Table.Row className="text-ui-fg-subtle txt-medium-plus">
            <Table.HeaderCell className="!pl-0">Article</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Quantité</Table.HeaderCell>
            <Table.HeaderCell>Prix</Table.HeaderCell>
            <Table.HeaderCell className="!pr-0 text-right">
              Total
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.map((item) => (
            <Item key={item.id} item={item} currencyCode={cart.currency_code} />
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ItemsTemplate
