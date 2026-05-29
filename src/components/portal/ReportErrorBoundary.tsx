import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  analysisId?: string | null;
}

interface State {
  hasError: boolean;
  message?: string;
}

/**
 * Catches render-time crashes inside the performance report body so a single
 * malformed report (null minutes, missing fields, NaN math) doesn't take the
 * whole page down. Logs analysis id for debugging.
 */
export class ReportErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(err: Error): State {
    return { hasError: true, message: err.message };
  }

  componentDidCatch(err: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("[ReportErrorBoundary] analysis", this.props.analysisId, err, info);
  }

  componentDidUpdate(prev: Props) {
    if (prev.analysisId !== this.props.analysisId && this.state.hasError) {
      this.setState({ hasError: false, message: undefined });
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="text-center py-12 space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted">
          <AlertTriangle className="w-7 h-7 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium">Couldn't render this report</p>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          One of the fields on this report is missing or malformed. The team has been notified — please try another report in the meantime.
        </p>
      </div>
    );
  }
}
