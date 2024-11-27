import { Spinner } from './Spinner';

export function LoadingButton({ 
  children, 
  loading = false, 
  disabled = false,
  className = '',
  ...props 
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        flex items-center justify-center px-4 py-2 
        border border-transparent text-sm font-medium rounded-md 
        text-white bg-blue-600 hover:bg-blue-700 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <Spinner className="w-4 h-4 mr-2" />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
}

// También puedes exportarlo por defecto si prefieres
export default LoadingButton; 