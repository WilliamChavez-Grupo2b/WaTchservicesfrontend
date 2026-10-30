import { useEffect, useRef } from 'react'

/**
 * Calls `callback` immediately and then every `intervalMs` milliseconds.
 * Stops polling when the component unmounts.
 */
export function usePolling(callback, intervalMs = 3000, deps = []) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    savedCallback.current()
    const id = setInterval(() => savedCallback.current(), intervalMs)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
