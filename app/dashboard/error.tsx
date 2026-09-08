"use client";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="studio-empty" role="alert">
      <h1>Something didn’t load.</h1>
      <p>
        Your account data has not been changed. Try again, or return to the
        website.
      </p>
      <button className="studio-button" type="button" onClick={reset}>
        Try again
      </button>
      <a href="/">Back to website</a>
    </div>
  );
}
