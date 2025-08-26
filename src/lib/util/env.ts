export const getBaseURL = () => {
  const url = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:32100"
  console.log("Resolved Base URL for fetch:", url) // Added log
  return url
}