import * as React from "react"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
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
  placeholder,
  disabled = false,
  className,
  id
}: DatePickerProps) {
  const isMobile = useIsMobile()
  const [displayValue, setDisplayValue] = React.useState("")

  // Converte valor ISO para formato brasileiro para exibição
  React.useEffect(() => {
    if (value && value.includes('-')) {
      const [year, month, day] = value.split('-')
      setDisplayValue(`${day}/${month}/${year}`)
    } else if (value && !value.includes('-')) {
      setDisplayValue(value)
    } else {
      setDisplayValue("")
    }
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    if (!isMobile) {
      // Desktop: input date nativo
      onChange?.(inputValue)
      return
    }

    // Mobile: formatação manual dd/mm/aaaa
    let formattedValue = inputValue.replace(/\D/g, '') // Remove tudo que não é dígito
    
    if (formattedValue.length >= 2) {
      formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2)
    }
    if (formattedValue.length >= 5) {
      formattedValue = formattedValue.slice(0, 5) + '/' + formattedValue.slice(5, 9)
    }

    setDisplayValue(formattedValue)

    // Validação e conversão para formato ISO quando completo
    if (formattedValue.length === 10) {
      const [day, month, year] = formattedValue.split('/')
      const dayNum = parseInt(day, 10)
      const monthNum = parseInt(month, 10)
      const yearNum = parseInt(year, 10)

      // Validação básica
      if (dayNum >= 1 && dayNum <= 31 && monthNum >= 1 && monthNum <= 12 && yearNum >= 1900) {
        const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        onChange?.(isoDate)
      }
    }
  }

  if (isMobile) {
    return (
      <Input
        id={id}
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        placeholder="dd/mm/aaaa"
        disabled={disabled}
        className={className}
        maxLength={10}
      />
    )
  }

  // Desktop: input date nativo
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