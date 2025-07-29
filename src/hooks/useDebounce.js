import { useEffect, useState } from "react"

const useDebounce = (value, delay) => {
    const [debounceValue, setValue] = useState(value)

    useEffect(() => {
        const timerId = setTimeout(() => setValue(value), delay)
        return () => clearTimeout(timerId)
    }, [value, delay])

    return debounceValue
}

export default useDebounce
