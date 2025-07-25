import { useEffect, useState } from "react"
import { electricityService } from "@/lib/services/electricityService"

export function useElectricityMenuVisibility() {
  const [show, setShow] = useState(true)
  useEffect(() => {
    electricityService.getProviders()
      .then(() => setShow(true))
      .catch(() => setShow(false))
  }, [])
  return show
}
