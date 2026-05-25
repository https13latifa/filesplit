import { motion } from 'framer-motion';

export default function Card({ icon, title, value, color = 'blue', children, trend }) {
  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-blue-700 shadow-md hover:shadow-lg',
    green: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 text-green-700 shadow-md hover:shadow-lg',
    yellow: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-700 shadow-md hover:shadow-lg',
    red: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200 text-red-700 shadow-md hover:shadow-lg',
    purple: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 text-purple-700 shadow-md hover:shadow-lg',
  };

  const borderColorClasses = {
    blue: 'border-l-blue-500',
    green: 'border-l-green-500',
    yellow: 'border-l-yellow-500',
    red: 'border-l-red-500',
    purple: 'border-l-purple-500',
  };

  return (
    <motion.div
      whileHover={{ translateY: -4, transition: { duration: 0.2 } }}
      className={`${colorClasses[color]} border-2 border-l-4 ${borderColorClasses[color]} rounded-xl p-6 transition-all duration-300 cursor-pointer`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-75 uppercase tracking-wide">{title}</p>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-4xl font-bold">{value}</p>
            {trend && <span className="text-xs font-semibold opacity-75">{trend}</span>}
          </div>
        </div>
        <div className="text-4xl drop-shadow-sm">{icon}</div>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </motion.div>
  );
}
