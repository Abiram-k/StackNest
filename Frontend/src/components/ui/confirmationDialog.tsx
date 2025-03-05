"use client"
import { ArrowUpRight } from "lucide-react"

interface ConfirmationDialogProps {
  onConfirm: () => void
  onCancel: () => void
  message?: string
  title?: string
}

export default function ConfirmationDialog({
  onConfirm,
  onCancel,
  message = "Once you confirm, it will remove from list and you can find from bottom permanently. Action can't be undone",
  title = "Confirmation",
}: ConfirmationDialogProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="w-full max-w-md mx-4 rounded-3xl overflow-hidden bg-[#1a1a1a] text-center p-8">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-red-600">
            <ArrowUpRight className="w-6 h-6 text-red-600" />
          </div>
        </div>

        <h2 className="text-white text-xl font-medium mb-3">{title}</h2>

        <p className="text-gray-400 text-sm mb-8 max-w-xs mx-auto leading-relaxed">{message}</p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-3 max-w-xs mx-auto">
          <button
            onClick={onConfirm}
            className="bg-red-700  hover:bg-red-800 text-white py-3 px-6 rounded-full font-medium w-full transition-colors"
          >
            Confirm
          </button>

          <button
            onClick={onCancel}
            className="border border-red-700/50 text-white py-3 px-6 rounded-full font-medium w-full hover:bg-red-950/20 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

