import { useState, useEffect, useCallback } from 'react'

export function useCrud(fetchFn, { autoFetch = true } = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchFn()
      setData(res.data)
    } catch (e) {
      setError(e.response?.data?.detail || 'Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }, [fetchFn])

  useEffect(() => {
    if (autoFetch) fetch()
  }, [autoFetch, fetch])

  return { data, loading, error, refetch: fetch }
}