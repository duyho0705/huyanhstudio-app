import React from 'react';

const GlobalErrorBoundary = ({ error, resetErrorBoundary }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999] p-4 text-center">
      <div className="max-w-md">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#35104C] mb-2">Đã có lỗi xảy ra</h1>
        <p className="text-gray-500 mb-8">
          Chúng tôi rất tiếc về sự cố này. Vui lòng thử tải lại trang hoặc liên hệ hỗ trợ.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-[#35104C] text-white rounded-xl font-bold hover:bg-[#4a166b] transition-all"
          >
            Tải lại trang
          </button>
          <button
            onClick={resetErrorBoundary}
            className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all"
          >
            Thử lại
          </button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg text-left overflow-auto max-h-40">
            <p className="text-xs font-mono text-red-500">{error?.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalErrorBoundary;
