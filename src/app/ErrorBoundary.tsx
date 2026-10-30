import React from 'react';
import Button from '@/components/ui/Button';

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
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-canvas px-6 text-center">
        <p className="font-mono text-mono-label text-ink-muted">ShiftPay</p>
        <h1 className="text-display text-ink">Đã xảy ra lỗi</h1>
        <p className="max-w-sm text-body-sm text-ink-soft">
          Ứng dụng gặp lỗi không mong muốn. Tải lại trang để tiếp tục.
        </p>
        <Button onClick={this.handleReload}>Tải lại trang</Button>
      </div>
    );
  }
}
