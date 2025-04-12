import { CreditCard, Crown, Zap } from "lucide-react"

export default function PricingComponent() {
  const plans = [
    {
      name: "Basic",
      price: 10,
      credits: 100,
      icon: <Zap className="w-12 h-12 text-purple-500 dark:text-purple-400" />,
    },
    {
      name: "Pro",
      price: 20,
      credits: 250,
      recommended: true,
      icon: <Crown className="w-12 h-12 text-purple-500 dark:text-purple-400" />,
    },
    {
      name: "Enterprise",
      price: 50,
      credits: 600,
      icon: <CreditCard className="w-12 h-12 text-purple-500 dark:text-purple-400" />,
    },
  ]

  return (
    <div className="w-full px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold tracking-tight text-black dark:text-white sm:text-4xl">
          Choose Your Plan
        </h2>
      </div>

      <div className="grid max-w-4xl grid-cols-1 gap-8 mx-auto mt-12 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col items-center p-8 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 ${
              plan.recommended
                ? "border-2 border-purple-500 dark:border-purple-400 relative bg-white dark:bg-gray-800"
                : "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            }`}
          >
            {plan.recommended && (
              <div className="absolute top-0 px-4 py-1 text-sm font-medium tracking-wider text-white transform -translate-y-1/2 bg-purple-500 rounded-full">
                RECOMMENDED
              </div>
            )}

            <div className="mb-4 mt-2">{plan.icon}</div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{plan.name}</h3>

            <div className="flex flex-col items-center justify-center w-full">
              <div className="text-5xl font-extrabold text-black dark:text-white mb-2">${plan.price}</div>

              <div className="text-xl font-medium text-purple-600 dark:text-purple-400 mb-8">
                {plan.credits} Credits
              </div>
            </div>

            <button
              className={`w-full py-3 px-4 rounded-md text-base font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                plan.recommended
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900 dark:hover:bg-purple-800 dark:text-purple-200"
              }`}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
