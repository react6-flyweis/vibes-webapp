export function LoadingScreen() {
  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-gradient-primary">
      <div className="flex items-center gap-2">
        <div className="animate-spin rounded-full border-2 border-current border-t-transparent h-6 w-6" />
      </div>
    </div>
  );
}
