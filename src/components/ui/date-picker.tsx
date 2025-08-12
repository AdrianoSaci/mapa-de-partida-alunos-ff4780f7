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
  const [maskValue, setMaskValue] = React.useState("dd/mm/aaaa")

  // Converte valor ISO para formato brasileiro para exibição
  React.useEffect(() => {
    if (value && value.includes('-')) {
      const [year, month, day] = value.split('-')
      setMaskValue(`${day}/${month}/${year}`)
    } else {
      setMaskValue("dd/mm/aaaa")
    }
  }, [value])

  const formatWithMask = (input: string, currentMask: string) => {
    // Remove tudo que não é dígito
    const digits = input.replace(/\D/g, '')
    let newMask = "dd/mm/aaaa"
    let digitIndex = 0

    for (let i = 0; i < newMask.length && digitIndex < digits.length; i++) {
      if (newMask[i] === 'd' || newMask[i] === 'm' || newMask[i] === 'a') {
        newMask = newMask.substring(0, i) + digits[digitIndex] + newMask.substring(i + 1)
        digitIndex++
      }
    }

    return newMask
  }

  const autoCorrectValues = (day: string, month: string, year: string) => {
    // Auto-correção para dia
    if (day.length === 2) {
      const dayNum = parseInt(day, 10)
      if (dayNum > 31) day = "31"
      if (dayNum < 1) day = "01"
    }

    // Auto-correção para mês
    if (month.length === 2) {
      const monthNum = parseInt(month, 10)
      if (monthNum > 12) month = "12"
      if (monthNum < 1) month = "01"
    }

    // Auto-correção para ano (não pode ser futuro)
    if (year.length === 4) {
      const yearNum = parseInt(year, 10)
      const currentYear = new Date().getFullYear()
      if (yearNum > currentYear) year = currentYear.toString()
      if (yearNum < 1900) year = "1900"
    }

    return { day, month, year }
  }

  const isValidDate = (day: string, month: string, year: string) => {
    if (day.length !== 2 || month.length !== 2 || year.length !== 4) return false
    
    const dayNum = parseInt(day, 10)
    const monthNum = parseInt(month, 10)
    const yearNum = parseInt(year, 10)

    // Criar data e verificar se é válida
    const date = new Date(yearNum, monthNum - 1, dayNum)
    const isRealDate = date.getDate() === dayNum && 
                      date.getMonth() === monthNum - 1 && 
                      date.getFullYear() === yearNum

    // Verificar se não é data futura
    const today = new Date()
    const isNotFuture = date <= today

    return isRealDate && isNotFuture
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    if (!isMobile) {
      // Desktop: input date nativo
      onChange?.(inputValue)
      return
    }

    // Mobile: máscara inteligente
    const newMask = formatWithMask(inputValue, maskValue)
    
    // Extrair partes da data
    const parts = newMask.split('/')
    if (parts.length === 3) {
      const [dayPart, monthPart, yearPart] = parts
      
      // Auto-correção em tempo real
      const corrected = autoCorrectValues(dayPart, monthPart, yearPart)
      const correctedMask = `${corrected.day}/${corrected.month}/${corrected.year}`
      
      setMaskValue(correctedMask)

      // Validação final e conversão para ISO
      if (corrected.day.length === 2 && corrected.month.length === 2 && corrected.year.length === 4) {
        if (isValidDate(corrected.day, corrected.month, corrected.year)) {
          const isoDate = `${corrected.year}-${corrected.month.padStart(2, '0')}-${corrected.day.padStart(2, '0')}`
          onChange?.(isoDate)
        } else {
          // Data inválida - não chama onChange
          onChange?.("")
        }
      }
    } else {
      setMaskValue(newMask)
    }
  }

  if (isMobile) {
    return (
      <Input
        id={id}
        type="text"
        value={maskValue}
        onChange={handleInputChange}
        placeholder="dd/mm/aaaa"
        disabled={disabled}
        className={className}
        inputMode="numeric"
        pattern="[0-9/]*"
        autoComplete="bday"
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