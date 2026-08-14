import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'

const AchievementContext = createContext()

export function AchievementProvider({ children }) {
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(false)
  const { token, role } = useAuth()

  const mapActivity = (d) => ({
    id: d.id,
    title: d.title,
    category: d.category,
    date: d.activityDate,
    status: d.status ? d.status.charAt(0).toUpperCase() + d.status.slice(1).toLowerCase() : 'Pending',
    description: d.description,
    certificate: d.certificateReference,
    studentName: d.studentName,
    studentEmail: d.studentEmail,
    studentId: d.studentId,
    verifierName: d.verifierName,
    remarks: d.remarks,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt
  })

  const fetchAchievements = useCallback(async () => {
    if (!token || !role) {
      setAchievements([])
      return
    }

    setLoading(true)
    try {
      if (role === 'faculty') {
        const [pendingRes, verifiedRes] = await Promise.all([
          fetch('/api/activities/verification/pending', {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store'
          }),
          fetch('/api/activities/verification/verified-by-me', {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store'
          })
        ])
        const pendingData = pendingRes.ok ? await pendingRes.json() : []
        const verifiedData = verifiedRes.ok ? await verifiedRes.json() : []
        
        const getList = (d) => Array.isArray(d) ? d : (d && typeof d === 'object' ? (d.content || d.data || d.activities || d.myActivities || []) : [])
        const combined = [...getList(pendingData), ...getList(verifiedData)]
        setAchievements(combined.map(mapActivity))
      } else if (role === 'admin') {
        const res = await fetch('/api/activities/admin', {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store'
        })
        const data = res.ok ? await res.json() : []
        const getList = (d) => Array.isArray(d) ? d : (d && typeof d === 'object' ? (d.content || d.data || d.activities || d.myActivities || []) : [])
        setAchievements(getList(data).map(mapActivity))
      } else if (role === 'employer') {
        const res = await fetch('/api/activities/admin?status=VERIFIED', {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store'
        })
        const data = res.ok ? await res.json() : []
        const getList = (d) => Array.isArray(d) ? d : (d && typeof d === 'object' ? (d.content || d.data || d.activities || d.myActivities || []) : [])
        setAchievements(getList(data).map(mapActivity))
      } else {
        // student
        const res = await fetch('/api/activities/me', {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store'
        })
        const data = res.ok ? await res.json() : []
        let list = []
        if (Array.isArray(data)) {
          list = data
        } else if (data && typeof data === 'object') {
          list = data.content || data.data || data.activities || data.myActivities || []
        }
        setAchievements(list.map(mapActivity))
      }
    } catch (e) {
      console.error('Failed to fetch achievements:', e)
      setAchievements([])
    } finally {
      setLoading(false)
    }
  }, [token, role])

  useEffect(() => {
    fetchAchievements()
  }, [fetchAchievements])

  const addAchievement = async (achievement) => {
    if (!token) throw new Error('Not authenticated')

    const res = await fetch('/api/activities', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: achievement.title,
        category: achievement.category,
        activityDate: achievement.date || new Date().toISOString().split('T')[0],
        description: achievement.description,
        certificateReference: achievement.certificate
      })
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => null)
      throw new Error(errorData?.message || `Failed to create activity (${res.status})`)
    }

    const newAct = await res.json()
    setAchievements(prev => [...prev, mapActivity(newAct)])
    return newAct
  }

  const uploadFile = async (file) => {
    if (!token) return null

    // Client-side validation
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Unsupported file type: ${file.type}. Only PDF, JPG, and PNG are allowed.`)
    }
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      throw new Error(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 10MB.`)
    }

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/files', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    })

    if (!res.ok) {
      const errorText = await res.text().catch(() => '')
      throw new Error(`File upload failed (${res.status}): ${errorText}`)
    }

    return await res.text() // returns the GridFS file ID
  }

  const updateAchievementStatus = async (id, status, remarks) => {
    if (!token) return

    const endpoint = status === 'Verified' ? 'approve' : 'reject'
    const res = await fetch(`/api/activities/verification/${id}/${endpoint}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ remarks: remarks || 'Faculty review' })
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => null)
      throw new Error(errorData?.message || `Failed to ${endpoint} activity`)
    }

    // Refresh from backend to get accurate state
    await fetchAchievements()
  }

  const deleteAchievement = async (id) => {
    if (!token) return

    const res = await fetch(`/api/activities/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => null)
      throw new Error(errorData?.message || `Failed to delete activity`)
    }

    // Refresh from backend
    await fetchAchievements()
  }

  const getCertificateUrl = (fileId) => {
    if (!fileId) return null
    return `/api/files/${fileId}`
  }

  return (
    <AchievementContext.Provider
      value={{
        achievements,
        loading,
        addAchievement,
        uploadFile,
        updateAchievementStatus,
        deleteAchievement,
        fetchAchievements,
        getCertificateUrl,
        token
      }}
    >
      {children}
    </AchievementContext.Provider>
  )
}

export function useAchievements() {
  return useContext(AchievementContext)
}