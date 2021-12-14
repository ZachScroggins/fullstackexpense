import { GetStaticProps, NextPage } from 'next'
import { Fragment, useEffect, useMemo, useState } from 'react'
import {
  dehydrate,
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient
} from 'react-query'
import { useSortBy, useTable } from 'react-table'
import { useForm } from 'react-hook-form'
import { Dialog, Transition } from '@headlessui/react'
import {
  SortAscendingIcon,
  SortDescendingIcon,
  SwitchVerticalIcon,
  XIcon
} from '@heroicons/react/outline'

const getExpenses = async () => {
  const response = await fetch(
    'https://api.fullstackexpense.com/api/expense/read.php'
  )
  if (response.ok) {
    const data = await response.json()
    return data
  }
  throw new Error('Could not fetch expenses')
}

const createExpense = async (data: any) => {
  const response = await fetch(
    'https://api.fullstackexpense.com/api/expense/create.php',
    {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
  )
  if (response.ok) {
    const data = await response.json()
    return data
  }
  throw new Error('Could not fetch expenses')
}

const updateExpense = async (data: any, currentRow: any) => {
  const response = await fetch(
    'https://api.fullstackexpense.com/api/expense/update.php',
    {
      method: 'PUT',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description: data.description,
        amount: data.amount,
        employee_id: data.employee_id,
        expense_id: currentRow.id
      })
    }
  )
  if (response.ok) {
    const data = await response.json()
    return data
  }
  throw new Error('Could not fetch expenses')
}

const deleteExpense = async (currentRow: any) => {
  const response = await fetch(
    'https://api.fullstackexpense.com/api/expense/delete.php',
    {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        expense_id: currentRow.id
      })
    }
  )
  if (response.ok) {
    const data = await response.json()
    return data
  }
  throw new Error('Could not fetch expenses')
}

const calcTotalExpenses = (data: any): number => {
  let total = 0

  data.forEach((item: any) => {
    const amount = parseFloat(item.amount)
    total += amount
  })

  return Math.round((total + Number.EPSILON) * 100) / 100
}

const Expenses: NextPage = () => {
  const queryClient = useQueryClient()
  const {
    data: apiData,
    isLoading,
    isError,
    error
  } = useQuery<any, any>('expenses', getExpenses)
  const createMutation = useMutation(createExpense, {
    onSuccess: () => {
      queryClient.invalidateQueries('expenses')
      reset()
    }
  })
  const updateMutation = useMutation(data => updateExpense(data, currentRow), {
    onSuccess: () => {
      queryClient.invalidateQueries('expenses')
      upReset()
    }
  })
  const deleteMutation = useMutation(() => deleteExpense(currentRow), {
    onSuccess: () => {
      queryClient.invalidateQueries('expenses')
      upReset()
    }
  })

  const data = useMemo(() => apiData, [apiData])
  const columns = useMemo(
    () => [
      {
        Header: 'Description',
        accessor: 'description'
      },
      {
        Header: 'Employee',
        accessor: 'employee_name'
      },
      {
        Header: 'Amount',
        accessor: 'amount'
      }
    ],
    []
  )
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy)

  useEffect(() => {
    setNumReports(data.length)
    setTotalExpenses(calcTotalExpenses(data))
  }, [data])

  const [totalExpenses, setTotalExpenses] = useState<number>(() =>
    calcTotalExpenses(data)
  )
  const [numReports, setNumReports] = useState<number>(() => data.length)
  const [open, setOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [currentRow, setCurrentRow] = useState(null)
  const { register, handleSubmit, reset } = useForm()
  const {
    register: upRegister,
    handleSubmit: upHandleSubmit,
    reset: upReset,
    setValue
  } = useForm()
  const onCreateSubmit = (data: any) => {
    createMutation.mutate(data)
    setOpen(false)
  }
  const onUpdateSubmit = (data: any) => {
    updateMutation.mutate(data)
    setUpdateOpen(false)
  }
  const openUpdate = async (row: any) => {
    setValue('employee_id', row.employee_id)
    setValue('amount', row.amount)
    setValue('description', row.description)
    await setCurrentRow(row)
    setUpdateOpen(true)
  }

  if (isError) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <>
      <main className='flex-1 min-h-screen bg-gray-50'>
        {/* Page title & actions */}
        <div className='px-4 py-4 border-b border-gray-200 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8'>
          <div className='flex-1 min-w-0'>
            <h1 className='text-lg font-medium leading-6 text-gray-900 sm:truncate'>
              Expense Reports
            </h1>
          </div>
          <div className='flex mt-4 sm:mt-0 sm:ml-4'>
            <button
              type='button'
              onClick={() => setOpen(true)}
              className='inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-lg shadow-fuchsia-100 bg-fuchsia-600 order-0 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:order-1 sm:ml-3'
            >
              Create
            </button>
          </div>
        </div>

        <div className='px-4 mt-6 sm:px-6 lg:px-8'>
          <h2 className='text-xs font-medium tracking-wide text-gray-500 uppercase'>
            Application Stats
          </h2>
          <dl className='grid grid-cols-1 gap-5 mt-3 sm:grid-cols-3'>
            <div className='px-4 py-5 overflow-hidden bg-white rounded-lg shadow-2xl shadow-green-50 sm:p-6'>
              <dt className='text-sm font-medium text-gray-500 truncate'>
                Total Expenses
              </dt>
              <dd className='mt-1 text-2xl font-semibold text-gray-900 sm:text-3xl'>
                <span>$</span>
                {totalExpenses.toFixed(2)}
              </dd>
            </div>
            <div className='px-4 py-5 overflow-hidden bg-white rounded-lg shadow-2xl shadow-purple-50 sm:p-6'>
              <dt className='text-sm font-medium text-gray-500 truncate'>
                Expense Reports
              </dt>
              <dd className='mt-1 text-2xl font-semibold text-gray-900 sm:text-3xl'>
                {numReports}
              </dd>
            </div>
            <div className='px-4 py-5 overflow-hidden bg-white rounded-lg shadow-2xl shadow-pink-50 sm:p-6'>
              <dt className='text-sm font-medium text-gray-500 truncate'>
                Employees
              </dt>
              <dd className='mt-1 text-2xl font-semibold text-gray-900 sm:text-3xl'>
                3
              </dd>
            </div>
          </dl>
        </div>

        {/* Expenses table */}
        <div className='mt-8'>
          <div className='inline-block min-w-full align-middle border-b border-gray-200'>
            <table {...getTableProps()} className='min-w-full'>
              <thead className='bg-gray-100'>
                {headerGroups.map(headerGroup => (
                  // eslint-disable-next-line react/jsx-key
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column, index) => {
                      if (index === 0) {
                        return (
                          <th
                            {...column.getHeaderProps(
                              column.getSortByToggleProps()
                            )}
                            className='hidden px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 md:table-cell'
                          >
                            <span className='lg:pl-2'>
                              {column.render('Header')}
                              <span>
                                {column.isSorted ? (
                                  column.isSortedDesc ? (
                                    <SortDescendingIcon className='inline w-4 h-4 ml-1' />
                                  ) : (
                                    <SortAscendingIcon className='inline w-4 h-4 ml-1' />
                                  )
                                ) : (
                                  <SwitchVerticalIcon className='inline w-4 h-4 ml-1' />
                                )}
                              </span>
                            </span>
                          </th>
                        )
                      }

                      if (index === 1) {
                        return (
                          <th
                            {...column.getHeaderProps(
                              column.getSortByToggleProps()
                            )}
                            className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase border-b border-gray-200'
                          >
                            {column.render('Header')}
                            <span>
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <SortDescendingIcon className='inline w-4 h-4 ml-1' />
                                ) : (
                                  <SortAscendingIcon className='inline w-4 h-4 ml-1' />
                                )
                              ) : (
                                <SwitchVerticalIcon className='inline w-4 h-4 ml-1' />
                              )}
                            </span>
                          </th>
                        )
                      }

                      if (index === 2) {
                        return (
                          <th
                            {...column.getHeaderProps(
                              column.getSortByToggleProps()
                            )}
                            className='px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase border-b border-gray-200'
                          >
                            {column.render('Header')}
                            <span>
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <SortDescendingIcon className='inline w-4 h-4 ml-1' />
                                ) : (
                                  <SortAscendingIcon className='inline w-4 h-4 ml-1' />
                                )
                              ) : (
                                <SwitchVerticalIcon className='inline w-4 h-4 ml-1' />
                              )}
                            </span>
                          </th>
                        )
                      }
                    })}
                    <th className='py-3 pr-6 text-xs font-medium tracking-wider text-right text-gray-500 uppercase border-b border-gray-200' />
                  </tr>
                ))}
              </thead>
              <tbody
                {...getTableBodyProps()}
                className='divide-y divide-gray-200'
              >
                {rows.map(row => {
                  prepareRow(row)
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell, index) => {
                        if (index === 0) {
                          return (
                            <td
                              {...cell.getCellProps()}
                              className='hidden whitespace-normal md:table-cell'
                            >
                              <div className='flex items-center pl-6 lg:pl-8'>
                                <a href='#' className=' hover:text-gray-600'>
                                  <span>{cell.render('Cell')}</span>
                                </a>
                              </div>
                            </td>
                          )
                        }
                        if (index === 1) {
                          return (
                            <td
                              {...cell.getCellProps()}
                              className='px-6 py-3 text-sm font-medium text-gray-500'
                            >
                              <div className='flex items-center'>
                                <span className='flex-shrink-0'>
                                  {cell.render('Cell')}
                                </span>
                              </div>
                            </td>
                          )
                        }
                        if (index === 2) {
                          return (
                            <td
                              {...cell.getCellProps()}
                              className='px-6 py-3 text-sm text-right text-gray-500 whitespace-nowrap'
                            >
                              $ {cell.render('Cell')}
                            </td>
                          )
                        }
                      })}
                      <td className='px-6 py-3 text-sm font-medium text-right whitespace-nowrap'>
                        <button
                          type='button'
                          onClick={() => openUpdate(row.original)}
                          className='text-fuchsia-600 hover:text-fuchsia-900'
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Create Expense Form */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as='div'
          className='fixed inset-0 z-40 overflow-hidden'
          onClose={setOpen}
        >
          <div className='absolute inset-0 overflow-hidden'>
            <Dialog.Overlay className='absolute inset-0' />

            <div className='fixed inset-y-0 right-0 flex max-w-full pl-16'>
              <Transition.Child
                as={Fragment}
                enter='transform transition ease-in-out duration-500 sm:duration-700'
                enterFrom='translate-x-full'
                enterTo='translate-x-0'
                leave='transform transition ease-in-out duration-500 sm:duration-700'
                leaveFrom='translate-x-0'
                leaveTo='translate-x-full'
              >
                <div className='w-screen max-w-md'>
                  <form
                    onSubmit={handleSubmit(onCreateSubmit)}
                    className='flex flex-col h-full bg-white divide-y divide-gray-200 shadow-xl'
                  >
                    <div className='flex-1 h-0 overflow-y-auto'>
                      <div className='px-4 py-6 bg-fuchsia-700 sm:px-6'>
                        <div className='flex items-center justify-between'>
                          <Dialog.Title className='text-lg font-medium text-white'>
                            New Expense
                          </Dialog.Title>
                          <div className='flex items-center ml-3 h-7'>
                            <button
                              type='button'
                              className='rounded-md text-fuchsia-200 bg-fuchsia-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white'
                              onClick={() => setOpen(false)}
                            >
                              <span className='sr-only'>Close panel</span>
                              <XIcon className='w-6 h-6' aria-hidden='true' />
                            </button>
                          </div>
                        </div>
                        <div className='mt-1'>
                          <p className='text-sm text-fuchsia-300'>
                            Get started by filling in the information below to
                            create your new expense.
                          </p>
                        </div>
                      </div>
                      <div className='flex flex-col justify-between flex-1'>
                        <div className='px-4 divide-y divide-gray-200 sm:px-6'>
                          <div className='pt-6 pb-5 space-y-6'>
                            <div>
                              <label
                                htmlFor='employee-name'
                                className='block text-sm font-medium text-gray-900'
                              >
                                Employee
                              </label>
                              <div className='mt-1'>
                                <select
                                  {...register('employee_id')}
                                  className='block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm'
                                  defaultValue={3}
                                  required
                                >
                                  <option value={3}>Josh Barnes</option>
                                  <option value={2}>Allie Smith</option>
                                  <option value={1}>Bill Wilson</option>
                                </select>
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor='amount'
                                className='block text-sm font-medium text-gray-700'
                              >
                                Amount
                              </label>
                              <div className='flex mt-1 rounded-md shadow-sm'>
                                <span className='inline-flex items-center px-3 text-gray-500 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 sm:text-sm'>
                                  $
                                </span>
                                <input
                                  type='number'
                                  {...register('amount')}
                                  min={0.01}
                                  step={0.01}
                                  required
                                  className='flex-1 block w-full min-w-0 px-3 py-2 border-gray-300 rounded-none rounded-r-md focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm'
                                />
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor='description'
                                className='block text-sm font-medium text-gray-900'
                              >
                                Description
                              </label>
                              <div className='mt-1'>
                                <textarea
                                  {...register('description')}
                                  rows={4}
                                  required
                                  className='block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-fuchsia-500 focus:border-fuchsia-500'
                                  defaultValue={''}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='flex justify-end flex-shrink-0 px-4 py-4'>
                      <button
                        type='button'
                        className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500'
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type='submit'
                        className='inline-flex justify-center px-4 py-2 ml-4 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500'
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Update Expense Form */}
      <Transition.Root show={updateOpen} as={Fragment}>
        <Dialog
          as='div'
          className='fixed inset-0 z-40 overflow-hidden'
          onClose={setUpdateOpen}
        >
          <div className='absolute inset-0 overflow-hidden'>
            <Dialog.Overlay className='absolute inset-0' />

            <div className='fixed inset-y-0 right-0 flex max-w-full pl-16'>
              <Transition.Child
                as={Fragment}
                enter='transform transition ease-in-out duration-500 sm:duration-700'
                enterFrom='translate-x-full'
                enterTo='translate-x-0'
                leave='transform transition ease-in-out duration-500 sm:duration-700'
                leaveFrom='translate-x-0'
                leaveTo='translate-x-full'
              >
                <div className='w-screen max-w-md'>
                  <form
                    onSubmit={upHandleSubmit(onUpdateSubmit)}
                    className='flex flex-col h-full bg-white divide-y divide-gray-200 shadow-xl'
                  >
                    <div className='flex-1 h-0 overflow-y-auto'>
                      <div className='px-4 py-6 bg-fuchsia-700 sm:px-6'>
                        <div className='flex items-center justify-between'>
                          <Dialog.Title className='text-lg font-medium text-white'>
                            Edit Expense
                          </Dialog.Title>
                          <div className='flex items-center ml-3 h-7'>
                            <button
                              type='button'
                              className='rounded-md text-fuchsia-200 bg-fuchsia-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white'
                              onClick={() => setUpdateOpen(false)}
                            >
                              <span className='sr-only'>Close panel</span>
                              <XIcon className='w-6 h-6' aria-hidden='true' />
                            </button>
                          </div>
                        </div>
                        <div className='mt-1'>
                          <p className='text-sm text-fuchsia-300'>
                            Get started by filling in the information below to
                            update your expense.
                          </p>
                        </div>
                      </div>
                      <div className='flex flex-col justify-between flex-1'>
                        <div className='px-4 divide-y divide-gray-200 sm:px-6'>
                          <div className='pt-6 pb-5 space-y-6'>
                            <div>
                              <label
                                htmlFor='employee-name'
                                className='block text-sm font-medium text-gray-900'
                              >
                                Employee
                              </label>
                              <div className='mt-1'>
                                <select
                                  {...upRegister('employee_id')}
                                  className='block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm'
                                  required
                                >
                                  <option value={3}>Josh Barnes</option>
                                  <option value={2}>Allie Smith</option>
                                  <option value={1}>Bill Wilson</option>
                                </select>
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor='amount'
                                className='block text-sm font-medium text-gray-700'
                              >
                                Amount
                              </label>
                              <div className='flex mt-1 rounded-md shadow-sm'>
                                <span className='inline-flex items-center px-3 text-gray-500 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 sm:text-sm'>
                                  $
                                </span>
                                <input
                                  type='number'
                                  {...upRegister('amount')}
                                  min={0.01}
                                  step={0.01}
                                  required
                                  className='flex-1 block w-full min-w-0 px-3 py-2 border-gray-300 rounded-none rounded-r-md focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm'
                                />
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor='description'
                                className='block text-sm font-medium text-gray-900'
                              >
                                Description
                              </label>
                              <div className='mt-1'>
                                <textarea
                                  {...upRegister('description')}
                                  rows={4}
                                  required
                                  className='block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-fuchsia-500 focus:border-fuchsia-500'
                                  defaultValue={''}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='flex justify-end flex-shrink-0 px-4 py-4'>
                      <button
                        type='button'
                        className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500'
                        onClick={() => setUpdateOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type='button'
                        className='inline-flex justify-center px-4 py-2 ml-4 text-sm font-medium text-pink-600 bg-white border border-pink-300 rounded-md shadow-sm hover:bg-pink-50 focus:outline-none hover:text-pink-700 focus:ring-2 focus:ring-offset-2 focus:ring-pink-500'
                        onClick={() => {
                          deleteMutation.mutate()
                          setUpdateOpen(false)
                        }}
                      >
                        Delete
                      </button>
                      <button
                        type='submit'
                        className='inline-flex justify-center px-4 py-2 ml-4 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500'
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ctx => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery('expenses', getExpenses)

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  }
}

export default Expenses
