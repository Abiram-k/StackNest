import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const ArrowLeftButton = () => {
    const navigate = useNavigate()
  return (
    <button
    onClick={() => navigate(-1)}
    className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mb-6"
    aria-label="Go back"
  >
    <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
  </button>
  )
}

