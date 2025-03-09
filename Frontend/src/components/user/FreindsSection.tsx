import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const FreindsSection = () => {
  return (
    <section className="container mx-auto px-4 py-12">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Suggested Friends</h2>
      <div className="flex gap-2">
        <Button variant="outline" size="icon" className="rounded-full">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((item) => (
        <Card key={item} className="p-4">
          <div className="relative h-32 mb-4 rounded-lg overflow-hidden">
            <img
              src="/placeholder.svg"
              alt="Profile"
              className="object-cover"
            />
          </div>
          <h4 className="font-bold text-sm mb-2">Developer Name</h4>
          <p className="text-xs text-gray-600 dark:text-gray-500 mb-4">
            Full Stack Developer
          </p>
          <Button className="w-full bg-primary-500 text-white hover:bg-primary-500/90 dark:hover:bg-primary-500/90 dark:bg-primary-600 dark:text-gray-300">
            Connect
          </Button>
        </Card>
      ))}
    </div>
    <div className="text-center mt-8">
      <Button variant="link" className="dark:text-primary-600 text-primary-500">
        Explore
      </Button>
    </div>
  </section>
  )
}

export default FreindsSection
