import LoadingSpinner from "./LoadingSpinner";

export default function PageLoader({
  message = "Caricamento...",
  fullScreen = false,
}: {
  message?: string;
  fullScreen?: boolean;
}) {
  return (
    <div
      className={
        fullScreen
          ? "min-h-screen flex flex-col items-center justify-center px-4 bg-white"
          : "min-h-[50vh] flex flex-col items-center justify-center px-4"
      }
    >
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-sm text-slate-600">{message}</p>
    </div>
  );
}
