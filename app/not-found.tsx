export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "80vh",
        display: "grid",
        placeContent: "center",
        gap: 20,
        padding: 32,
        fontFamily: "Arial,sans-serif",
        color: "#202421",
      }}
    >
      <p>STACKFORGE / 404</p>
      <h1>This block isn’t connected.</h1>
      <p>The page you’re looking for doesn’t exist.</p>
      <a href="/">Back to StackForge →</a>
    </main>
  );
}
