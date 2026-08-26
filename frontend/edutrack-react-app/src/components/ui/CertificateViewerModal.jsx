import { FileText } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'
import Skeleton from './Skeleton'

export default function CertificateViewerModal({ open, onClose, url, loading }) {
  return (
    <Modal open={open} onClose={onClose} title="Document Preview" className="max-w-4xl w-full">
      <div className="bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center min-h-[60vh]">
        {loading ? (
          <div className="flex flex-col items-center text-slate-400">
            <Skeleton variant="circular" className="w-12 h-12 mb-4 animate-spin" />
            <p>Loading document securely...</p>
          </div>
        ) : url ? (
          <object 
            data={url} 
            className="w-full h-[70vh]" 
            title="Certificate Viewer"
          >
            <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <FileText size={48} className="mb-4 opacity-50" />
              <p className="mb-4">Your browser does not support inline viewing of this file type.</p>
              <Button onClick={() => window.open(url, '_blank')}>
                Download / Open Externally
              </Button>
            </div>
          </object>
        ) : (
          <p className="text-rose-500 font-medium">Failed to load preview.</p>
        )}
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="secondary" onClick={onClose}>Close Viewer</Button>
      </div>
    </Modal>
  )
}
