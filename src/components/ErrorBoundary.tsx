import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#211510] text-[#f7ede8] flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#2e1e17] border border-[#6d4a37] shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-red-950/60 border border-red-800 text-red-400 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
            <p className="text-xs text-[#bfa59a] mb-6 leading-relaxed">
              An unexpected issue occurred while rendering the application. You can recover immediately by reloading.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-3 px-4 rounded-xl bg-[#c86d3b] hover:bg-[#b05d2e] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-transform active:scale-98"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
