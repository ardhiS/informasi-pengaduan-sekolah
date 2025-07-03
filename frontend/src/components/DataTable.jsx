import React from 'react';

const DataTable = ({
  data = [],
  columns = [],
  onEdit,
  onDelete,
  loading = false,
  pagination = null,
}) => {
  if (loading) {
    return <div className='p-4 text-center'>Loading...</div>;
  }

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full bg-white shadow-md rounded-lg'>
        <thead className='bg-gray-50'>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                {column.title}
              </th>
            ))}
            <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Actions
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {data.map((item, index) => (
            <tr key={item.id || index}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'
                >
                  {column.render
                    ? column.render(item[column.key], item)
                    : item[column.key]}
                </td>
              ))}
              <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                {onEdit && (
                  <button
                    onClick={() => onEdit(item)}
                    className='text-indigo-600 hover:text-indigo-900 mr-3'
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(item)}
                    className='text-red-600 hover:text-red-900'
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {pagination && (
        <div className='px-6 py-3 flex items-center justify-between border-t border-gray-200'>
          <div className='flex-1 flex justify-between sm:hidden'>
            <button
              onClick={pagination.onPrevious}
              disabled={pagination.currentPage === 1}
              className='relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
            >
              Previous
            </button>
            <button
              onClick={pagination.onNext}
              disabled={pagination.currentPage === pagination.totalPages}
              className='ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
