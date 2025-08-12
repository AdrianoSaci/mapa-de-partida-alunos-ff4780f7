import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useIsMobile } from "@/hooks/use-mobile"

interface DatePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  id?: string
}

export function DatePicker({
  value = "",
  onChange,
  placeholder = "dd/mm/aaaa",
  disabled = false,
  className,
  id
}: DatePickerProps) {
  const isMobile = useIsMobile()
  const [mobileDisplayValue, setMobileDisplayValue] = React.useState("")
  const [isOpen, setIsOpen] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Convert yyyy-mm-dd to dd/mm/yyyy for mobile display
  React.useEffect(() => {
    if (isMobile && value) {
      const date = new Date(value)
      if (!isNaN(date.getTime())) {
        setMobileDisplayValue(format(date, "dd/MM/yyyy"))
      }
    } else if (isMobile) {
      setMobileDisplayValue("")
    }
  }, [value, isMobile])

  const autoCorrectValue = (num: number, min: number, max: number): number => {
    if (num < min) return min
    if (num > max) return max
    return num
  }

  const formatDateMask = (input: string): string => {
    // Remove all non-numeric characters
    const numbers = input.replace(/\D/g, "")
    let formatted = ""

    if (numbers.length >= 1) {
      let day = parseInt(numbers.substring(0, 2)) || 0
      day = autoCorrectValue(day, 1, 31)
      formatted += day.toString().padStart(2, '0').substring(0, 2)
      
      if (numbers.length >= 3) {
        let month = parseInt(numbers.substring(2, 4)) || 0
        month = autoCorrectValue(month, 1, 12)
        formatted += "/" + month.toString().padStart(2, '0').substring(0, 2)
        
        if (numbers.length >= 5) {
          let year = parseInt(numbers.substring(4, 8)) || 0
          const currentYear = new Date().getFullYear()
          year = autoCorrectValue(year, 1900, currentYear)
          formatted += "/" + year.toString().substring(0, 4)
        }
      }
    }

    return formatted
  }

  const validateAndConvertToISO = (dateStr: string): string => {
    const numbers = dateStr.replace(/\D/g, "")
    if (numbers.length === 8) {
      let day = parseInt(numbers.substring(0, 2))
      let month = parseInt(numbers.substring(2, 4))
      let year = parseInt(numbers.substring(4, 8))

      const currentYear = new Date().getFullYear()
      
      // Auto-correct values
      day = autoCorrectValue(day, 1, 31)
      month = autoCorrectValue(month, 1, 12)
      year = autoCorrectValue(year, 1900, currentYear)

      // Month-specific day validation
      const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
      if (isLeapYear) daysInMonth[1] = 29
      
      day = autoCorrectValue(day, 1, daysInMonth[month - 1])

      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    }
    return ""
  }

  const handleMobileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    const formatted = formatDateMask(input)
    
    // Limit to 10 characters (dd/mm/yyyy)
    if (formatted.length <= 10) {
      setMobileDisplayValue(formatted)
      
      // Convert to ISO format
      const isoDate = validateAndConvertToISO(formatted)
      if (isoDate) {
        onChange?.(isoDate)
      }
    }
  }

  const handleDesktopInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onChange?.(value)
  }

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      const isoDate = format(date, "yyyy-MM-dd")
      onChange?.(isoDate)
      setIsOpen(false)
    }
  }

  const selectedDate = value ? new Date(value) : undefined

  // Desktop: Use native HTML5 date input (original behavior)
  if (!isMobile) {
    return (
      <div className="relative">
        <Input
          id={id}
          type="date"
          value={value}
          onChange={handleDesktopInputChange}
          disabled={disabled}
          className={className}
          min="1900-01-01"
          max={format(new Date(), "yyyy-MM-dd")}
        />
      </div>
    )
  }

  // Mobile: Custom input with mask and calendar
  return (
    <div className="relative">
      <div className="flex">
        <Input
          ref={inputRef}
          id={id}
          type="text"
          value={mobileDisplayValue}
          onChange={handleMobileInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn("pr-10", className)}
          maxLength={10}
        />
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "absolute right-0 top-0 h-full px-3 border-l-0 rounded-l-none",
                disabled && "pointer-events-none opacity-50"
              )}
              disabled={disabled}
              type="button"
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleCalendarSelect}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}