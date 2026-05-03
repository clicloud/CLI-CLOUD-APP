export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      background: '#0a0a0a',
      color: '#ededed',
    }}>
      <div style={{
        padding: '3rem',
        borderRadius: '12px',
        border: '1px solid #1a1a2e',
        background: '#111118',
        textAlign: 'center',
        maxWidth: '600px',
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          Deployed on <span style={{ color: '#6c63ff' }}>CLI</span>
        </h1>
        <p style={{ color: '#888', fontSize: '1.1rem', marginBottom: '2rem' }}>
          Your Next.js app is live. Start building.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/api/hello" style={{
            padding: '0.75rem 1.5rem',
            background: '#6c63ff',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
          }}>
            Test API Route
          </a>
          <a href="https://docs.cli.cloud" style={{
            padding: '0.75rem 1.5rem',
            border: '1px solid #333',
            color: '#ededed',
            borderRadius: '8px',
            textDecoration: 'none',
          }}>
            Read Docs
          </a>
        </div>
      </div>
    </main>
  )
}
