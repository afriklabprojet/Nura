import { Text, clx } from "@modules/common/components/ui"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import React from "react"

type AccordionItemProps = AccordionPrimitive.AccordionItemProps & {
  title: string
  subtitle?: string
  description?: string
  required?: boolean
  tooltip?: string
  forceMountContent?: true
  headingSize?: "small" | "medium" | "large"
  customTrigger?: React.ReactNode
  complete?: boolean
  active?: boolean
  triggerable?: boolean
  children: React.ReactNode
}

type AccordionProps =
  | (AccordionPrimitive.AccordionSingleProps &
      React.RefAttributes<HTMLDivElement>)
  | (AccordionPrimitive.AccordionMultipleProps &
      React.RefAttributes<HTMLDivElement>)

const Accordion: React.FC<AccordionProps> & {
  Item: React.FC<AccordionItemProps>
} = ({ children, ...props }) => {
  return (
    <AccordionPrimitive.Root {...props}>{children}</AccordionPrimitive.Root>
  )
}

const Item: React.FC<AccordionItemProps> = ({
  title,
  subtitle,
  description,
  children,
  className,
  headingSize: _headingSize = "large",
  customTrigger = undefined,
  forceMountContent = undefined,
  triggerable: _triggerable,
  ...props
}) => {
  return (
    <AccordionPrimitive.Item
      {...props}
      className={clx(
        "border-grey-20 group border-t last:mb-0 last:border-b",
        "py-3",
        className
      )}
    >
      <AccordionPrimitive.Header className="px-1">
        <div className="flex flex-col">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-4">
              <Text className="text-ui-fg-subtle text-sm">{title}</Text>
            </div>
            <AccordionPrimitive.Trigger
              className="flex h-11 w-11 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-label={`${title} — afficher ou masquer`}
            >
              {customTrigger || <MorphingTrigger />}
            </AccordionPrimitive.Trigger>
          </div>
          {subtitle && (
            <Text as="span" className="mt-1 text-sm">
              {subtitle}
            </Text>
          )}
        </div>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content
        forceMount={forceMountContent}
        className={clx(
          "radix-state-closed:animate-accordion-close radix-state-open:animate-accordion-open radix-state-closed:pointer-events-none px-1"
        )}
      >
        <div className="inter-base-regular group-radix-state-closed:animate-accordion-close">
          {description && <Text>{description}</Text>}
          <div className="w-full">{children}</div>
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  )
}

Accordion.Item = Item

const MorphingTrigger = () => {
  return (
    <div className="group relative rounded-sm bg-transparent p-[6px] text-brown hover:bg-nude/40 disabled:bg-transparent disabled:text-ui-fg-muted">
      <div className="h-5 w-5">
        <span className="absolute inset-y-[31.75%] left-[48%] right-1/2 w-[1.5px] rounded-full bg-current duration-300 group-radix-state-open:rotate-90" />
        <span className="absolute inset-x-[31.75%] bottom-1/2 top-[48%] h-[1.5px] rounded-full bg-current duration-300 group-radix-state-open:left-1/2 group-radix-state-open:right-1/2 group-radix-state-open:rotate-90" />
      </div>
    </div>
  )
}

export default Accordion
