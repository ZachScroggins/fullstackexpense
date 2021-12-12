import { GetStaticProps, NextPage } from 'next'
import { Fragment, useMemo } from 'react'
import { dehydrate, QueryClient, useQuery } from 'react-query'
import { useSortBy, useTable } from 'react-table'
import { Menu, Transition } from '@headlessui/react'
import { ChevronRightIcon, DotsVerticalIcon } from '@heroicons/react/solid'
import { classNames } from 'lib/utils/classNames'
import {
  AdjustmentsIcon,
  PencilAltIcon,
  SelectorIcon,
  SortAscendingIcon,
  SortDescendingIcon,
  SwitchVerticalIcon
} from '@heroicons/react/outline'

const stats = [
  { name: 'Total Expenses', stat: '$71.89', shadow: 'shadow-green-50' },
  { name: 'Expense Reports', stat: '5', shadow: 'shadow-purple-50' },
  { name: 'Employees', stat: '3', shadow: 'shadow-pink-50' }
]
const projects = [
  {
    id: 1,
    title: 'GraphQL API',
    initials: 'GA',
    team: 'Engineering',
    members: [
      {
        name: 'Dries Vincent',
        handle: 'driesvincent',
        imageUrl:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      {
        name: 'Lindsay Walton',
        handle: 'lindsaywalton',
        imageUrl:
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      {
        name: 'Courtney Henry',
        handle: 'courtneyhenry',
        imageUrl:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      {
        name: 'Tom Cook',
        handle: 'tomcook',
        imageUrl:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      }
    ],
    totalMembers: 12,
    lastUpdated: 'March 17, 2020',
    pinned: true,
    bgColorClass: 'bg-pink-600'
  }
  // More projects...
]
const pinnedProjects = projects.filter(project => project.pinned)

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

const Expenses: NextPage = () => {
  const {
    data: apiData,
    isLoading,
    isError,
    error
  } = useQuery<any, any>('expenses', getExpenses)
  const data = useMemo(() => apiData, [apiData])
  const columns = useMemo(
    () => [
      {
        Header: 'Description',
        accessor: 'description' // accessor is the "key" in the data
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
            className='inline-flex items-center order-1 px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:order-0 sm:ml-0'
          >
            Filter
          </button>
          <button
            type='button'
            className='inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm order-0 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:order-1 sm:ml-3'
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
          {stats.map(item => (
            <div
              key={item.name}
              className={classNames(
                item.shadow,
                'px-4 py-5 overflow-hidden bg-white rounded-lg shadow-2xl sm:p-6'
              )}
            >
              <dt className='text-sm font-medium text-gray-500 truncate'>
                {item.name}
              </dt>
              <dd className='mt-1 text-2xl font-semibold text-gray-900 sm:text-3xl'>
                {item.stat}
              </dd>
            </div>
          ))}
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
                            className='hidden md:table-cell'
                          >
                            <div className='flex items-center pl-6 lg:pl-8'>
                              <a
                                href='#'
                                className='flex-shrink-0 truncate hover:text-gray-600'
                              >
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
                              <span className='flex-shrink-o'>
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
                      <a
                        href='#'
                        className='text-indigo-600 hover:text-indigo-900'
                      >
                        Edit
                      </a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
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
