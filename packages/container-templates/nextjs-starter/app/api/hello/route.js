export async function GET() {
  return Response.json({
    status: 'ok',
    platform: 'CLI',
    message: 'Your API is working. Build something great.',
    timestamp: new Date().toISOString(),
  })
}
