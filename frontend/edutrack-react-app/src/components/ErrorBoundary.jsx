import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for developers
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center p-4">
   <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-red-500 text-3xl font-bold">!</span>
            </div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Something went wrong</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">
              We encountered an unexpected error while loading this page. 
              Please try reloading the application.
            </p>
            <button
              onClick={this.handleReload}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors w-full"
            >
              Reload Application
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
