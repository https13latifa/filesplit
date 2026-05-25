import { motion } from 'framer-motion';

export default function Table({ columns, data }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <motion.tbody
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {data.map((row, idx) => (
            <motion.tr
              key={idx}
              variants={rowVariants}
              className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-colors duration-200"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 text-sm text-gray-800">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </motion.tr>
          ))}
        </motion.tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg font-medium">Tidak ada data</p>
          <p className="text-sm">Data akan ditampilkan di sini</p>
        </div>
      )}
    </div>
  );
}
