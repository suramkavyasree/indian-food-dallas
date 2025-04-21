export function Button({ children, className = '', ...props }) {
    return (
      <button
        className={`bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-full shadow ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
  