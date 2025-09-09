const LoadingState = () => {
  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <div className="flex items-center gap-2">
        <div className="animate-spin h-4 w-4 rounded-full border-2 border-gray-400 border-t-transparent" />
        <span className="text-sm text-gray-600">Loading booster data…</span>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-36 rounded-2xl bg-gray-100/60 animate-pulse"
          />
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="h-72 rounded-2xl bg-gray-100/60 animate-pulse" />
        <div className="h-72 rounded-2xl bg-gray-100/60 animate-pulse" />
      </div>
    </div>
  );
};

export default LoadingState;
