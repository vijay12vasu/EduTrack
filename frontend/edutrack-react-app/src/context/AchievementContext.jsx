import { createContext, useContext, useState } from 'react'

const AchievementContext = createContext()

export function AchievementProvider({ children }) {
  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: 'Java Workshop',
      category: 'Workshop',
      date: '12 Jun 2026',
      status: 'Verified',
    },
    {
      id: 2,
      title: 'Hackathon 2026',
      category: 'Competition',
      date: '15 Jun 2026',
      status: 'Pending',
    },
  ])

  const addAchievement = (achievement) => {
    setAchievements((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...achievement,
        status: 'Pending',
      },
    ])
  }

  const updateAchievementStatus = (id, status) => {
    setAchievements((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    )
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