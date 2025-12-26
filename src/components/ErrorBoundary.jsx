import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-900 text-white">
                    <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-md border border-red-500/30 p-8 rounded-2xl shadow-2xl text-center">

                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8 text-red-400" />
                        </div>

                        <h1 className="text-2xl font-bold mb-3">
                            เกิดข้อผิดพลาดบางอย่าง
                        </h1>

                        <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                            ระบบขัดข้องชั่วคราว เราต้องขออภัยในความไม่สะดวก
                            กรุณาลองใหม่อีกครั้ง
                        </p>

                        {this.state.error && import.meta.env.DEV && (
                            <div className="mb-6 p-4 bg-black/40 rounded-lg text-left overflow-auto max-h-40 text-xs font-mono text-red-300">
                                {this.state.error.toString()}
                            </div>
                        )}

                        <button
                            onClick={this.handleReload}
                            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-red-900/50"
                        >
                            <RefreshCw size={18} />
                            โหลดหน้าเว็บใหม่
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
