import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, info: { componentStack: string }) => void
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info)
    this.props.onError?.(error, info)
  }

  render() {
    if (this.state.error) {
      return this.props.fallback ?? (
        <div className="min-h-svh bg-slate-950 flex flex-col items-center justify-center px-6 text-center">
          <p className="text-4xl mb-4">🎬</p>
          <h2 className="text-lg font-bold text-white mb-2">Scene Crash</h2>
          <p className="text-sm text-white/40 mb-6">Something broke backstage. Reload to continue.</p>
          <button
            onClick={() => this.setState({ error: null })}
            className="px-5 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white text-sm font-semibold"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 text-xs text-white/30 underline"
          >
            Reload app
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
