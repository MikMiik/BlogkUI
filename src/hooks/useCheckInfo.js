import { useEffect } from "react"

import authService from "@/services/authService"
import useDebounce from "./useDebounce"
import capitalize from "@/utils/capitalize"

const useCheckInfo = (type, Form) => {
    const {
        watch,
        formState: { errors },
        setError,
    } = Form
    const value = watch(type)
    const debouncedValue = useDebounce(value, 500)

    useEffect(() => {
        if (!debouncedValue || errors[type]) return

        const checkInfo = async () => {
            const alreadyExist = await authService.checkInfo(type, debouncedValue)
            if (alreadyExist) {
                const name = capitalize(type)
                setError(type, { message: `${name} already exists` })
            }
        }

        checkInfo()
    }, [type, debouncedValue, errors, setError])
}

export default useCheckInfo
