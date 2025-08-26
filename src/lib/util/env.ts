export const getBaseURL = () => {
  let url = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:32100"
  
  // Replace localhost with 127.0.0.1 for server-side fetches to avoid potential DNS resolution issues
  if (typeof window === 'undefined' && url.includes('localhost')) {
    url = url.replace('localhost', '127.0.0.1');
  }

  console.log("Resolved Base URL for fetch:", url) // Added log
  return url
}