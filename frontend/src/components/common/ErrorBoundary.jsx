import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('Error boundary caught an error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='flex min-h-screen items-center justify-center bg-slate-950 px-4 text-center'>
          <div className='max-w-xl rounded-xl border border-red-500/40 bg-red-500/10 p-6'>
            <h1 className='text-2xl font-bold text-red-300'>Something went wrong</h1>
            <p className='mt-3 text-slate-200'>
              An unexpected UI error occurred. Refresh the page or check the console logs for details.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
