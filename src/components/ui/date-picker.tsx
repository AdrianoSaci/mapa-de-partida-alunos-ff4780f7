import * as React from "react"
import { format, parse, isValid } from "date-fns"
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
  const [displayValue, setDisplayValue] = React.useState("")
  const [isOpen, setIsOpen] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Convert yyyy-mm-dd to dd/mm/yyyy for display
  React.useEffect(() => {
    if (value) {
      const date = new Date(value)
      if (isValid(date)) {
        setDisplayValue(format(date, "dd/MM/yyyy"))
      }
    } else {
      setDisplayValue("")
    }
  }, [value])

  const formatDateMask = (input: string, cursorPosition: number): { formatted: string; newCursorPosition: number } => {
    // Remove all non-numeric characters
    const numbers = input.replace(/\D/g, "")
    let formatted = ""
    let newCursorPosition = cursorPosition

    // Apply progressive mask
    if (numbers.length >= 1) {
      formatted += numbers.substring(0, 2)
      if (numbers.length >= 3) {
        formatted += "/" + numbers.substring(2, 4)
        if (numbers.length >= 5) {
          formatted += "/" + numbers.substring(4, 8)
        }
      }
    }

    // Adjust cursor position after formatting
    const originalNumbers = input.substring(0, cursorPosition).replace(/\D/g, "").length
    let newPosition = 0
    let numberCount = 0
    
    for (let i = 0; i < formatted.length && numberCount < originalNumbers; i++) {
      if (/\d/.test(formatted[i])) {
        numberCount++
      }
      newPosition = i + 1
    }

    return { formatted, newCursorPosition: newPosition }
  }

  const validateDate = (day: number, month: number, year: number): boolean => {
    const currentYear = new Date().getFullYear()
    
    // Basic range validation
    if (year < 1900 || year > currentYear) return false
    if (month < 1 || month > 12) return false
    if (day < 1 || day > 31) return false

    // Month-specific day validation
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    
    // Check for leap year
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
    if (isLeapYear) daysInMonth[1] = 29

    return day <= daysInMonth[month - 1]
  }

  const convertToISODate = (dateStr: string): string => {
    const numbers = dateStr.replace(/\D/g, "")
    if (numbers.length === 8) {
      const day = parseInt(numbers.substring(0, 2))
      const month = parseInt(numbers.substring(2, 4))
      const year = parseInt(numbers.substring(4, 8))

      if (validateDate(day, month, year)) {
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
      }
    }
    return ""
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    const cursorPosition = e.target.selectionStart || 0
    
    const { formatted, newCursorPosition } = formatDateMask(input, cursorPosition)
    
    // Limit to 10 characters (dd/mm/yyyy)
    if (formatted.length <= 10) {
      setDisplayValue(formatted)
      
      // Convert to ISO format and validate
      const isoDate = convertToISODate(formatted)
      onChange?.(isoDate)

      // Restore cursor position
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition)
        }
      }, 0)
    }
  }

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      const isoDate = format(date, "yyyy-MM-dd")
      onChange?.(isoDate)
      setIsOpen(false)
    }
  }

  const selectedDate = value ? new Date(value) : undefined

  return (
    <div className="relative">
      <div className="flex">
        <Input
          ref={inputRef}
          id={id}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
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