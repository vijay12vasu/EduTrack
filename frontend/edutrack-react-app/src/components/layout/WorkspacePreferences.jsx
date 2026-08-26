import { useState, useRef, useEffect } from 'react'
import { Settings2, Sun, Moon, Monitor, Activity, ZapOff, Check } from 'lucide-react'
import { useWorkspacePreferences } from '../../context/WorkspacePreferencesContext'

export default function WorkspacePreferences() {
  const { preferences, updatePreference } = useWorkspacePreferences()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const OptionGroup = ({ title, options, value, onChange, icon: Icon }) => (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-3 px-1">
        {Icon && <Icon size={14} className="text-content-muted dark:text-slate-400" />}
        <h4 className="text-xs font-bold text-content-dark dark:text-white uppercase tracking-wider">{title}</h4>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => {
          const isSelected = value === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                isSelected 
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/40 dark:border-indigo-500/30 dark:text-indigo-300' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800'
              } ${opt.className || ''}`}
            >
              {opt.icon && <opt.icon size={16} className={isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'} />}
              {opt.label}
              {isSelected && <Check size={14} className="ml-auto text-indigo-600 dark:text-indigo-400" />}
            </button>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 shadow-sm transition-colors dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-slate-800"
        aria-label="Workspace Preferences"
      >
        <Settings2 size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden transition-all duration-200 transform origin-top-right dark:bg-slate-900 dark:border-slate-800">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 dark:bg-slate-900 dark:border-slate-800">
            <h3 className="font-bold text-content-dark dark:text-white">Workspace Preferences</h3>
            <p className="text-xs text-content-muted mt-0.5 dark:text-slate-400">Make EduTrack feel right for you.</p>
          </div>
          
          <div className="p-4 max-h-[70vh] overflow-y-auto">
            <OptionGroup
              title="Appearance"
              icon={Monitor}
              value={preferences.appearance}
              onChange={(val) => updatePreference('appearance', val)}
              options={[
                { label: 'Light', value: 'light', icon: Sun },
                { label: 'Dark', value: 'dark', icon: Moon },
                { label: 'System', value: 'system', icon: Monitor, className: 'col-span-2 justify-center' }
              ]}
            />

            <OptionGroup
              title="Motion"
              icon={Activity}
              value={preferences.motion}
              onChange={(val) => updatePreference('motion', val)}
              options={[
                { label: 'Standard', value: 'standard', icon: Activity },
                { label: 'Reduced', value: 'reduced', icon: ZapOff }
              ]}
            />
          </div>
          
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center dark:bg-slate-900/50 dark:border-slate-800">
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-500">Preferences are saved automatically</p>
          </div>
        </div>
      )}
    </div>
  )
}
