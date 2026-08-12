import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const AchievementContext = createContext()

export function AchievementProvider({ children }) {
  const [achievements, setAchievements] = useState([])
  const { token, role } = useAuth()

  useEffect(() => {
    if (token) {
      const url = role === 'faculty' ? '/api/activities/verification/pending' : '/api/activities/me'
      fetch(url, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => {
           const mapped = data.map(d => ({
             id: d.id,
             title: d.title,
             category: d.category,
             date: d.activityDate,
             status: d.status.charAt(0).toUpperCase() + d.status.slice(1).toLowerCase(),
             description: d.description,
             certificate: d.certificateReference,
             activity: d.title
           }))
           setAchievements(mapped)
        })
        .catch(console.error)
    } else {
      setAchievements([])
    }
  }, [token, role])

  const addAchievement = async (achievement) => {
    if (!token) return;
    try {
      const res = await fetch('/api/activities', {
         method: 'POST',
         headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
         body: JSON.stringify({
            title: achievement.title,
            category: achievement.category,
            activityDate: achievement.date || new Date().toISOString().split('T')[0],
            description: achievement.description,
            certificateReference: achievement.certificate || 'cert.pdf'
         })
      })
      const newAct = await res.json()
      setAchievements(prev => [...prev, {
         id: newAct.id,
         title: newAct.title,
         category: newAct.category,
         date: newAct.activityDate,
         status: 'Pending',
         description: newAct.description,
         certificate: newAct.certificateReference,
         activity: newAct.title
      }])
    } catch (e) {
      console.error(e)
    }
  }

  const updateAchievementStatus = async (id, status) => {
    if (!token) return;
    try {
      const endpoint = status === 'Verified' ? 'approve' : 'reject';
      await fetch(`/api/activities/verification/${id}/${endpoint}`, {
         method: 'POST',
         headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
         body: JSON.stringify({ remarks: 'Faculty review' })
      });
      setAchievements((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status } : item
        ).filter(item => role !== 'faculty' || status === 'Pending') // remove from faculty view once processed
      )
    } catch(e) {
      console.error(e)
    }
  }

  return (
    <AchievementContext.Provider
      value={{
        achievements,
        addAchievement,
        updateAchievementStatus,
      }}
    >
      {children}
    </AchievementContext.Provider>
  )
}

export function useAchievements() {
  return useContext(AchievementContext)
}