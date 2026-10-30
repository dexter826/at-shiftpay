import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Unhandled render error:', error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-canvas px-6 text-center">
        <h1 className="text-lg font-semibold text-ink">Đã xảy ra lỗi</h1>
        <p className="text-sm text-ink-soft max-w-sm">
          Ứng dụng gặp lỗi không mong muốn. Tải lại trang để tiếp tục.
        </p>
        <button
          onClick={this.handleReload}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent"
        >
          Tải lại trang
        </button>
      </div>
    );
  }
}
