import { createContext, useContext, useEffect, useState } from 'react'

const WorkspacePreferencesContext = createContext()

export function WorkspacePreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState(() => {
    // Safely migrate/clear obsolete legacy theme key
    if (localStorage.getItem('theme')) {
      localStorage.removeItem('theme')
    }

    const saved = localStorage.getItem('edutrack_preferences')
    return saved ? JSON.parse(saved) : {
      appearance: 'system', // light, dark, system
      motion: 'standard'    // standard, reduced
    }
  })

  useEffect(() => {
    localStorage.setItem('edutrack_preferences', JSON.stringify(preferences))
    
    const root = document.documentElement
    
    const applyTheme = () => {
      const isDark = preferences.appearance === 'dark' || (preferences.appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
      if (isDark) {
        root.classList.add('dark')
        root.style.colorScheme = 'dark'
      } else {
        root.classList.remove('dark')
        root.style.colorScheme = 'light'
      }
    }
    
    applyTheme()

    // Add listener for system theme changes if set to 'system'
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (preferences.appearance === 'system') {
        applyTheme()
      }
    }
    mediaQuery.addEventListener('change', handleChange)

    // Motion
    root.setAttribute('data-motion', preferences.motion)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [preferences])

  const updatePreference = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  return (
    <WorkspacePreferencesContext.Provider value={{ preferences, updatePreference }}>
      {children}
    </WorkspacePreferencesContext.Provider>
  )
}

export function useWorkspacePreferences() {
  return useContext(WorkspacePreferencesContext)
}
