import { motion } from 'framer-motion';

/**
 * Horizontal step tracker for the EcoSwap order pipeline.
 *
 * @param {Array<{ id?: string, key?: string, label: string, icon?: React.ComponentType }>} steps
 * @param {number} currentIndex - Active step index (0-based); steps at or below this are marked done
 * @param {'sm' | 'md'} [size='md'] - sm = compact dots (Dashboard); md = icon circles (MySwaps)
 * @param {boolean} [animated=true] - Animate progress fill (md only uses framer-motion)
 * @param {string} [className]
 */
const FlowIndicator = ({
  steps = [],
  currentIndex = 0,
  size = 'md',
  animated = true,
  className = '',
}) => {
  if (!steps.length) return null;

  const progressPct =
    steps.length > 1
      ? (Math.max(0, currentIndex) / (steps.length - 1)) * 100
      : 0;

  if (size === 'sm') {
    return (
      <div className={`relative mb-5 px-1 ${className}`}>
        <div className="absolute top-1.5 left-2 right-2 h-1 bg-gray-100 rounded-full" />
        <div
          className="absolute top-1.5 left-2 h-1 bg-eco rounded-full transition-all duration-700"
          style={{
            width: `${progressPct}%`,
            maxWidth: 'calc(100% - 16px)',
          }}
        />
        <div className="relative flex justify-between w-full">
          {steps.map((step, idx) => {
            const isActive = idx <= currentIndex;
            const key = step.id || step.key || step.label;
            return (
              <div key={key} className="flex flex-col items-center w-8">
                <div
                  className={`w-3 h-3 rounded-full border-2 transition-all duration-500 z-10 ${
                    isActive
                      ? 'bg-eco border-eco scale-110 shadow-sm'
                      : 'bg-white border-gray-200'
                  }`}
                />
                <span
                  className={`text-[8px] font-black mt-2 tracking-wide text-center leading-tight ${
                    isActive ? 'text-eco' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative mb-8 mt-4 overflow-x-auto pb-4 md:pb-0 hide-scrollbar ${className}`}
    >
      <div className="min-w-[500px] md:min-w-0 relative">
        <div className="absolute top-5 left-[8%] right-[8%] h-1 bg-gray-100 rounded-full z-0">
          {animated ? (
            <motion.div
              className="h-full bg-eco rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1 }}
            />
          ) : (
            <div
              className="h-full bg-eco rounded-full transition-all duration-1000"
              style={{ width: `${progressPct}%` }}
            />
          )}
        </div>
        <div className="relative z-10 flex justify-between">
          {steps.map((step, index) => {
            const isActive = index <= currentIndex;
            const Icon = step.icon;
            const key = step.id || step.key || step.label;
            return (
              <div
                key={key}
                className="flex flex-col items-center gap-2 flex-1"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm ${
                    isActive
                      ? 'bg-eco text-white ring-4 ring-eco-light/30'
                      : 'bg-white text-gray-300 border-2 border-gray-100'
                  }`}
                >
                  {Icon ? <Icon className="w-5 h-5" /> : null}
                </div>
                <span
                  className={`text-[9px] md:text-[10px] font-bold text-center uppercase tracking-wider ${
                    isActive ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/** Maps swap/order status strings to the standard 6-step pipeline index. */
export const getFlowStepIndex = (status) => {
  const statusMap = {
    pending: 0,
    pending_artisan: 0,
    pending_advance: 1,
    ready_for_pickup: 2,
    picked_up: 3,
    in_progress: 4,
    completed: 5,
  };
  return statusMap[status] !== undefined ? statusMap[status] : 0;
};

export default FlowIndicator;
