import { Container } from "@medusajs/ui"

const SkeletonProductPreview = () => {
  return (
    <div className="animate-pulse">
      <Container className="aspect-[9/16] w-full bg-gray-100 bg-ui-bg-subtle" />
      <div className="flex flex-col items-center text-base-regular mt-2">
        <div className="w-1/5 h-4 bg-gray-100 mb-1"></div> {/* Placeholder for 'New' label */}
        <div className="w-3/5 h-6 bg-gray-100"></div> {/* Placeholder for product title */}
        <div className="w-1/4 h-5 bg-gray-100 mt-2"></div> {/* Placeholder for price */}
        <div className="flex justify-center gap-1 mt-4">
          <div className="w-8 h-8 rounded-full bg-gray-100"></div>
          <div className="w-8 h-8 rounded-full bg-gray-100"></div>
          <div className="w-8 h-8 rounded-full bg-gray-100"></div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonProductPreview