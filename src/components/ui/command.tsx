import * as React from "react"
import { type DialogProps } from "@radix-ui/react-dialog"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

interface CommandDialogProps extends DialogProps {}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b border-gray-200 px-4 py-2 bg-gray-50" cmdk-input-wrapper="">
    <Search className="mr-3 h-4 w-4 shrink-0 text-gray-500" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md bg-transparent py-2 text-sm font-medium outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50 text-gray-900",
        className
      )}
      {...props}
    />
  </div>
))

CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, style, ...props }, ref) => {
  const internalRef = React.useRef<React.ElementRef<typeof CommandPrimitive.List>>(null)

  React.useEffect(() => {
    const element = internalRef.current

    if (!element) {
      return
    }

    // Manejador para scroll con rueda del mouse (desktop)
    const handleWheel = (event: WheelEvent) => {
      const { scrollHeight, clientHeight } = element
      const scrollTop = element.scrollTop
      const canScroll = scrollHeight > clientHeight

      if (!canScroll) {
        return
      }

      const isScrollingDown = event.deltaY > 0
      const isScrollingUp = event.deltaY < 0
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1
      const isAtTop = scrollTop <= 0

      if ((isScrollingDown && isAtBottom) || (isScrollingUp && isAtTop)) {
        return
      }

      event.preventDefault()
      event.stopPropagation()
      element.scrollTop += event.deltaY
    }

    // Variables para tracking de touch
    let touchStartY = 0
    let touchCurrentY = 0

    // Manejador para inicio de touch (móvil)
    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        touchStartY = event.touches[0].clientY
        touchCurrentY = touchStartY
      }
    }

    // Manejador para movimiento de touch (móvil)
    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length !== 1) return

      const { scrollHeight, clientHeight, scrollTop } = element
      const canScroll = scrollHeight > clientHeight

      if (!canScroll) return

      touchCurrentY = event.touches[0].clientY
      const deltaY = touchStartY - touchCurrentY
      
      const isScrollingDown = deltaY > 0
      const isScrollingUp = deltaY < 0
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1
      const isAtTop = scrollTop <= 0

      // Solo prevenir el evento si podemos hacer scroll internamente
      if (!((isScrollingDown && isAtBottom) || (isScrollingUp && isAtTop))) {
        event.stopPropagation()
      }
    }

    element.addEventListener("wheel", handleWheel, { passive: false })
    element.addEventListener("touchstart", handleTouchStart, { passive: true })
    element.addEventListener("touchmove", handleTouchMove, { passive: false })

    return () => {
      element.removeEventListener("wheel", handleWheel)
      element.removeEventListener("touchstart", handleTouchStart)
      element.removeEventListener("touchmove", handleTouchMove)
    }
  }, [])

  const setRefs = React.useCallback(
    (node: React.ElementRef<typeof CommandPrimitive.List> | null) => {
      internalRef.current = node

      if (!ref) {
        return
      }

      if (typeof ref === "function") {
        ref(node)
      } else {
        ;(ref as React.MutableRefObject<React.ElementRef<typeof CommandPrimitive.List> | null>).current = node
      }
    },
    [ref]
  )

  return (
    <CommandPrimitive.List
      ref={setRefs}
      className={cn(
        "max-h-[300px] overflow-y-auto overflow-x-hidden",
        // Estilos para mejorar scroll táctil en móvil
        "overscroll-contain touch-pan-y",
        // Habilitar scroll suave y momentum en iOS
        "[&]:webkit-overflow-scrolling-touch",
        className
      )}
      style={{
        ...style,
        // Scroll suave con momentum en iOS/Safari
        WebkitOverflowScrolling: 'touch',
      }}
      {...props}
    />
  )
})

CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-8 text-center text-sm text-gray-500 font-medium"
    {...props}
  />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    )}
    {...props}
  />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 h-px bg-border", className)}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50",
      className
    )}
    {...props}
  />
))

CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
CommandShortcut.displayName = "CommandShortcut"

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
