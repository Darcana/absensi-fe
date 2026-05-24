import { useEffect, useRef } from 'react'

const useInfiniteScroll = (
  callback: () => void,
  loading: boolean,
  hasMore: boolean
) => {
  const observerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !loading && hasMore) {
        callback()
      }
    })
    if (observerRef.current) observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [loading, hasMore])

  return observerRef
}

export default useInfiniteScroll