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
    if (value && value.includes("-")) {
      const [year, month, day] = value.split("-")
      setMaskValue(`${day}/${month}/${year}`)
    } else if (!value) {
      setMaskValue("dd/mm/aaaa")
    }
  }, [value])

  const formatWithMask = (input: string) => {
    // Mantém no máximo 8 dígitos (ddmmyyyy)
    const digits = input.replace(/\D/g, "").slice(0, 8)
    let newMask = "dd/mm/aaaa"
    let di = 0

    for (let i = 0; i < newMask.length && di < digits.length; i++) {
      const ch = newMask[i]
      if (ch === "d" || ch === "m" || ch === "a") {
        newMask = newMask.substring(0, i) + digits[di] + newMask.substring(i + 1)
        di++
      }
    }

    return newMask
  }

  const autoCorrectValues = (day: string, month: string, year: string) => {
    // Corrige dia somente quando 2 dígitos numéricos
    if (/^\d{2}$/.test(day)) {
      const d = parseInt(day, 10)
      if (d > 31) day = "31"
      if (d < 1) day = "01"
    }

    // Corrige mês somente quando 2 dígitos numéricos
    if (/^\d{2}$/.test(month)) {
      const m = parseInt(month, 10)
      if (m > 12) month = "12"
      if (m < 1) month = "01"
    }

    // Corrige ano somente quando 4 dígitos numéricos
    if (/^\d{4}$/.test(year)) {
      const y = parseInt(year, 10)
      const currentYear = new Date().getFullYear()
      if (y > currentYear) year = currentYear.toString()
      if (y < 1900) year = "1900"
    }

    return { day, month, year }
  }

  const isValidDate = (day: string, month: string, year: string) => {
    if (!/^\d{2}$/.test(day) || !/^\d{2}$/.test(month) || !/^\d{4}$/.test(year)) return false

    const d = parseInt(day, 10)
    const m = parseInt(month, 10)
    const y = parseInt(year, 10)

    const date = new Date(y, m - 1, d)
    const isRealDate =
      date.getDate() === d && date.getMonth() === m - 1 && date.getFullYear() === y

    const today = new Date()
    const isNotFuture = date <= today

    return isRealDate && isNotFuture
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    if (!isMobile) {
      // Desktop: input date nativo (ISO yyyy-mm-dd)
      onChange?.(inputValue)
      return
    }

    // Mobile: máscara inteligente dd/mm/aaaa
    const newMask = formatWithMask(inputValue)

    // Extrair partes da data
    const [dayPart = "dd", monthPart = "mm", yearPart = "aaaa"] = newMask.split("/")

    // Auto-correção em tempo real
    const corrected = autoCorrectValues(dayPart, monthPart, yearPart)
    const correctedMask = `${corrected.day}/${corrected.month}/${corrected.year}`

    if (correctedMask !== maskValue) setMaskValue(correctedMask)

    // Quando completo e válido, emite ISO; caso contrário, não altera o valor externo
    if (
      /^\d{2}$/.test(corrected.day) &&
      /^\d{2}$/.test(corrected.month) &&
      /^\d{4}$/.test(corrected.year)
    ) {
      if (isValidDate(corrected.day, corrected.month, corrected.year)) {
        const isoDate = `${corrected.year}-${corrected.month.padStart(2, "0")}-${corrected.day.padStart(2, "0")}`
        onChange?.(isoDate)
      }
    }

    // Se o usuário apagou tudo, limpar valor externo
    if (newMask === "dd/mm/aaaa") {
      onChange?.("")
    }
  }

  if (isMobile) {
    return (
      <Input
        id={id}
        type="text"
        value={maskValue}
        onChange={handleInputChange}
        placeholder={placeholder ?? "dd/mm/aaaa"}
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
