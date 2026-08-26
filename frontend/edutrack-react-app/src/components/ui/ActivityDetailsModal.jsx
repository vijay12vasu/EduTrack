import { useState } from 'react'
import Modal from './Modal'
import Button from './Button'
import Badge from './Badge'
import { FileText, Clock, User, CheckCircle, XCircle, FileSearch, ArrowRight, Shield, Download } from 'lucide-react'

export default function ActivityDetailsModal({ open, onClose, activity, onViewCertificate }) {
  if (!activity) return null

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Verified': return <CheckCircle className="text-teal-500" size={24} />
      case 'Rejected': return <XCircle className="text-rose-500" size={24} />
      default: return <Clock className="text-amber-500" size={24} />
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Verified': return 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
      case 'Rejected': return 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
      default: return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
            {getStatusIcon(activity.status)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
              {activity.title}
            </h2>
            <div className="flex gap-2 items-center mt-1">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusColor(activity.status)}`}>
                {activity.status}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                {activity.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {activity.description || 'No description provided.'}
            </p>
          </section>

          {activity.remarks && (
            <section className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30">
              <h3 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <XCircle size={14} /> Faculty Remarks
              </h3>
              <p className="text-sm text-rose-800 dark:text-rose-300 font-medium">{activity.remarks}</p>
            </section>
          )}

          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Audit History</h3>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
              {(!activity.history || activity.history.length === 0) ? (
                <div className="text-sm text-slate-500 italic pl-6">No historical records available for this activity.</div>
              ) : (
                activity.history.map((event, index) => (
                  <div key={event.id || index} className="relative flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-4 h-4 rounded-full ring-4 ring-white dark:ring-slate-900 bg-indigo-500 z-10 shrink-0 shadow-sm" />
                      <div className="ml-4 flex flex-col">
                        <span className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                          {event.action.toLowerCase()}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                          <User size={10} /> {event.actorName} ({event.actorRole})
                        </span>
                        {event.remarks && (
                          <span className="text-xs text-slate-600 dark:text-slate-300 italic mt-1 bg-slate-50 dark:bg-slate-800 p-2 rounded-md border border-slate-100 dark:border-slate-700">
                            "{event.remarks}"
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-md">
                      {new Date(event.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Meta Data</h3>
            
            <div className="space-y-3">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Student</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white truncate" title={activity.studentEmail}>{activity.studentName}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Activity Date</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{new Date(activity.activityDate).toLocaleDateString()}</span>
              </div>

              {activity.verifierName && (
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Verified By</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                    <Shield size={12} className="text-indigo-500" />
                    {activity.verifierName}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800/30">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">Evidence</h3>
            {activity.certificateReference ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText size={16} className="text-indigo-500 shrink-0" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                    {activity.certificateReference.split('/').pop() || 'certificate.pdf'}
                  </span>
                </div>
                <Button 
                  onClick={() => onViewCertificate?.(activity.certificateReference)} 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-9 text-xs shadow-sm flex items-center justify-center gap-2"
                >
                  <FileSearch size={14} /> View Document
                </Button>
              </div>
            ) : (
              <div className="text-xs text-slate-500 font-semibold italic flex items-center gap-2">
                <XCircle size={14} /> No evidence attached
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        <Button variant="ghost" onClick={onClose} className="px-6">Close</Button>
      </div>
    </Modal>
  )
}
