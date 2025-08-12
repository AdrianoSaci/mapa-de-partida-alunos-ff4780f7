import * as React from "react"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"

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
  placeholder,
  disabled = false,
  className,
  id
}: DatePickerProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onChange?.(value)
  }

  return (
    <Input
      id={id}
      type="date"
      value={value}
      onChange={handleInputChange}
      disabled={disabled}
      className={className}
      min="1900-01-01"
      max={format(new Date(), "yyyy-MM-dd")}
    />
  )
}