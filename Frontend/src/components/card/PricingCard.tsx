import { Check, Circle } from "lucide-react"

interface PricingPlan {
  id: string
  name: string
  description: string
  price: string
  period: string
  color: string
  recommended: boolean
  features: string[]
}

interface PricingCardProps {
  plan: PricingPlan
}

export default function PricingCard({ plan }: PricingCardProps) {
  return (
    <div className={`${plan.color} rounded-3xl p-6 text-white flex flex-col h-full`}>
      <div className="mb-4">
        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-white">
          <Circle className="w-4 h-4 fill-white" />
        </div>
      </div>

      <div className="mb-2">
        <h2 className="text-2xl font-bold">{plan.name}</h2>
        <p className="text-white/80">{plan.description}</p>
      </div>

      <div className="text-4xl font-bold mb-6">
        {plan.price}/<span className="text-3xl">{plan.period}</span>
      </div>

      <button className="bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg mb-8 transition-colors">
        Select
      </button>

      <div className="border-t border-white/20 pt-4 mt-auto">
        <p className="font-medium mb-4">What you will get</p>
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

