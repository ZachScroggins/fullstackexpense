import { Fragment, useEffect, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
  HomeIcon,
  MenuAlt1Icon,
  XIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ReceiptTaxIcon,
  ChevronDownIcon,
  SparklesIcon
} from '@heroicons/react/outline'
import { SearchIcon, SelectorIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { classNames } from 'lib/utils/classNames'
import Image from 'next/image'
import profilePic from 'public/images/profile-pic.jpg'
import {
  GITHUB_URL,
  LINKEDIN_URL,
  PORTFOLIO_URL,
  RESUME_URL
} from 'lib/myLinks'

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon, current: true },
  {
    name: 'Expense Reports',
    href: '/expenses',
    icon: ReceiptTaxIcon,
    current: false
  },
  { name: 'Employees', href: '/employees', icon: UsersIcon, current: false }
]
const links = [
  {
    name: 'GitHub Repo',
    href: 'https://github.com/ZachScroggins/fullstackexpense',
    bgColorClass: 'bg-indigo-500'
  },
  {
    name: 'Client Code',
    href: 'https://github.com/ZachScroggins/fullstackexpense/tree/master/client',
    bgColorClass: 'bg-green-500'
  },
  {
    name: 'Server Code',
    href: 'https://github.com/ZachScroggins/fullstackexpense/tree/master/server',
    bgColorClass: 'bg-yellow-500'
  },
  {
    name: 'Server Index',
    href: 'https://api.fullstackexpense.com',
    bgColorClass: 'bg-pink-500'
  }
]

const Layout: React.FC = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const router = useRouter()

  useEffect(() => {
    if (router.pathname === '/') {
      setCurrentIndex(0)
    }
    if (router.pathname === '/expenses') {
      setCurrentIndex(1)
    }
    if (router.pathname === '/employees') {
      setCurrentIndex(2)
    }
  }, [router.pathname])

  return (
    <>
      <div className='min-h-full'>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as='div'
            className='fixed inset-0 z-40 flex lg:hidden'
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter='transition-opacity ease-linear duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='transition-opacity ease-linear duration-300'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Dialog.Overlay className='fixed inset-0 bg-gray-600 bg-opacity-75' />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter='transition ease-in-out duration-300 transform'
              enterFrom='-translate-x-full'
              enterTo='translate-x-0'
              leave='transition ease-in-out duration-300 transform'
              leaveFrom='translate-x-0'
              leaveTo='-translate-x-full'
            >
              <div className='relative flex flex-col flex-1 w-full max-w-xs pt-5 pb-4 bg-white'>
                <Transition.Child
                  as={Fragment}
                  enter='ease-in-out duration-300'
                  enterFrom='opacity-0'
                  enterTo='opacity-100'
                  leave='ease-in-out duration-300'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <div className='absolute top-0 right-0 pt-2 -mr-12'>
                    <button
                      type='button'
                      className='flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className='sr-only'>Close sidebar</span>
                      <XIcon
                        className='w-6 h-6 text-white'
                        aria-hidden='true'
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className='flex items-center flex-shrink-0 px-4 text-2xl font-bold tracking-wide text-gray-700 underline decoration-fuchsia-300 decoration-2 underline-offset-2'>
                  <SparklesIcon
                    className='w-6 h-6 mr-3 text-fuchsia-400'
                    aria-hidden={true}
                  />
                  FullStackExpense
                </div>
                <div className='flex-1 h-0 mt-5 overflow-y-auto'>
                  <nav className='px-2'>
                    <div className='space-y-1'>
                      {navigation.map((item, index) => (
                        <Link key={item.name} href={item.href}>
                          <a
                            className={classNames(
                              currentIndex === index
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                              'group flex items-center px-2 py-2 text-base leading-5 font-medium rounded-md'
                            )}
                            aria-current={
                              currentIndex === index ? 'page' : undefined
                            }
                            onClick={() => setSidebarOpen(false)}
                          >
                            <item.icon
                              className={classNames(
                                currentIndex === index
                                  ? 'text-gray-500'
                                  : 'text-gray-400 group-hover:text-gray-500',
                                'mr-3 flex-shrink-0 h-6 w-6'
                              )}
                              aria-hidden='true'
                            />
                            {item.name}
                          </a>
                        </Link>
                      ))}
                    </div>
                    <div className='mt-8'>
                      <h3
                        className='px-3 text-xs font-semibold tracking-wider text-gray-500 uppercase'
                        id='mobile-links-headline'
                      >
                        Links
                      </h3>
                      <div
                        className='mt-1 space-y-1'
                        role='group'
                        aria-labelledby='mobile-links-headline'
                      >
                        {links.map(link => (
                          <a
                            key={link.name}
                            href={link.href}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center px-3 py-2 text-base font-medium leading-5 text-gray-600 rounded-md group hover:text-gray-900 hover:bg-gray-50'
                          >
                            <span
                              className={classNames(
                                link.bgColorClass,
                                'w-2.5 h-2.5 mr-4 rounded-full'
                              )}
                              aria-hidden='true'
                            />
                            <span className='truncate'>{link.name}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </nav>
                </div>
              </div>
            </Transition.Child>
            <div className='flex-shrink-0 w-14' aria-hidden='true'>
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className='hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:pt-5 lg:pb-4 lg:bg-gray-100'>
          <div className='flex items-center flex-shrink-0 px-6 text-xl font-bold tracking-wide text-gray-700 underline decoration-fuchsia-300 decoration-2 underline-offset-2'>
            <SparklesIcon
              className='mr-2 text-2xl text-fuchsia-400'
              aria-hidden={true}
            />
            FullStackExpense
          </div>
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className='flex flex-col flex-1 h-0 mt-6 overflow-y-auto'>
            {/* User account dropdown */}
            <Menu as='div' className='relative inline-block px-3 text-left'>
              <div>
                <Menu.Button className='group w-full bg-gray-100 rounded-md px-3.5 py-2 text-sm text-left font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-purple-500'>
                  <span className='flex items-center justify-between w-full'>
                    <span className='flex items-center justify-between min-w-0 space-x-3'>
                      <span className='relative flex-shrink-0 w-10 h-10 bg-gray-300 rounded-full'>
                        <Image
                          src={profilePic}
                          alt='Zach Scroggins Profile Picture'
                          width={100}
                          height={100}
                          placeholder='blur'
                          priority
                          className='rounded-full'
                        />
                      </span>
                      <span className='flex flex-col flex-1 min-w-0'>
                        <span className='text-sm font-medium text-gray-900 truncate'>
                          Zach Scroggins
                        </span>
                        <span className='text-sm text-gray-500 truncate'>
                          @scroggins_zach
                        </span>
                      </span>
                    </span>
                    <ChevronDownIcon
                      className='flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-gray-500'
                      aria-hidden='true'
                    />
                  </span>
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter='transition ease-out duration-100'
                enterFrom='transform opacity-0 scale-95'
                enterTo='transform opacity-100 scale-100'
                leave='transition ease-in duration-75'
                leaveFrom='transform opacity-100 scale-100'
                leaveTo='transform opacity-0 scale-95'
              >
                <Menu.Items className='absolute left-0 right-0 z-10 mx-3 mt-1 origin-top bg-white divide-y divide-gray-200 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                  <div className='py-1'>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href={PORTFOLIO_URL}
                          target='_blank'
                          rel='noopener noreferrer'
                          className={classNames(
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          View Portfolio
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href={GITHUB_URL}
                          target='_blank'
                          rel='noopener noreferrer'
                          className={classNames(
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          GitHub
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href={LINKEDIN_URL}
                          target='_blank'
                          rel='noopener noreferrer'
                          className={classNames(
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          LinkedIn
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                  <div className='py-1'>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href={RESUME_URL}
                          target='_blank'
                          rel='noopener noreferrer'
                          className={classNames(
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          Resume
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            {/* Sidebar Search */}
            <div className='px-3 mt-5'>
              <label htmlFor='search' className='sr-only'>
                Search
              </label>
              <div className='relative mt-1 rounded-md shadow-sm'>
                <div
                  className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'
                  aria-hidden='true'
                >
                  <SearchIcon
                    className='w-4 h-4 mr-3 text-gray-400'
                    aria-hidden='true'
                  />
                </div>
                <input
                  type='text'
                  name='search'
                  id='search'
                  className='block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 pl-9 sm:text-sm'
                  placeholder='Search'
                />
              </div>
            </div>
            {/* Navigation */}
            <nav className='px-3 mt-6'>
              <div className='space-y-1'>
                {navigation.map((item, index) => (
                  <Link key={item.name} href={item.href}>
                    <a
                      className={classNames(
                        currentIndex === index
                          ? 'bg-gray-200 text-gray-900'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50',
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                      )}
                      aria-current={currentIndex === index ? 'page' : undefined}
                    >
                      <item.icon
                        className={classNames(
                          currentIndex === index
                            ? 'text-gray-500'
                            : 'text-gray-400 group-hover:text-gray-500',
                          'mr-3 flex-shrink-0 h-6 w-6'
                        )}
                        aria-hidden='true'
                      />
                      {item.name}
                    </a>
                  </Link>
                ))}
              </div>
              <div className='mt-8'>
                {/* Secondary navigation */}
                <h3
                  className='px-3 text-xs font-semibold tracking-wider text-gray-500 uppercase'
                  id='desktop-links-headline'
                >
                  Links
                </h3>
                <div
                  className='mt-1 space-y-1'
                  role='group'
                  aria-labelledby='desktop-links-headline'
                >
                  {links.map(link => (
                    <a
                      key={link.name}
                      href={link.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md group hover:text-gray-900 hover:bg-gray-50'
                    >
                      <span
                        className={classNames(
                          link.bgColorClass,
                          'w-2.5 h-2.5 mr-4 rounded-full'
                        )}
                        aria-hidden='true'
                      />
                      <span className='truncate'>{link.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </div>
        {/* Main column */}
        <div className='flex flex-col lg:pl-64'>
          {/* Search header */}
          <div className='sticky top-0 z-10 flex flex-shrink-0 h-16 bg-white border-b border-gray-200 lg:hidden'>
            <button
              type='button'
              className='px-4 text-gray-500 border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 lg:hidden'
              onClick={() => setSidebarOpen(true)}
            >
              <span className='sr-only'>Open sidebar</span>
              <MenuAlt1Icon className='w-6 h-6' aria-hidden='true' />
            </button>
            <div className='flex justify-between flex-1 px-4 sm:px-6 lg:px-8'>
              <div className='flex flex-1'>
                <form className='flex w-full md:ml-0' action='#' method='GET'>
                  <label htmlFor='search-field' className='sr-only'>
                    Search
                  </label>
                  <div className='relative w-full text-gray-400 focus-within:text-gray-600'>
                    <div className='absolute inset-y-0 left-0 flex items-center pointer-events-none'>
                      <SearchIcon className='w-5 h-5' aria-hidden='true' />
                    </div>
                    <input
                      id='search-field'
                      name='search-field'
                      className='block w-full h-full py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 border-transparent focus:outline-none focus:ring-0 focus:border-transparent focus:placeholder-gray-400 sm:text-sm'
                      placeholder='Search'
                      type='search'
                    />
                  </div>
                </form>
              </div>
              <div className='flex items-center'>
                {/* Profile dropdown */}
                <Menu as='div' className='relative ml-3'>
                  <div>
                    <Menu.Button className='flex items-center max-w-xs text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'>
                      <span className='sr-only'>Open user menu</span>
                      <span className='w-8 h-8 rounded-full'>
                        <Image
                          src={profilePic}
                          alt='Zach Scroggins Profile Picture'
                          width={100}
                          height={100}
                          placeholder='blur'
                          priority
                          className='rounded-full'
                        />
                      </span>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter='transition ease-out duration-100'
                    enterFrom='transform opacity-0 scale-95'
                    enterTo='transform opacity-100 scale-100'
                    leave='transition ease-in duration-75'
                    leaveFrom='transform opacity-100 scale-100'
                    leaveTo='transform opacity-0 scale-95'
                  >
                    <Menu.Items className='absolute right-0 w-48 mt-2 origin-top-right bg-white divide-y divide-gray-200 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                      <div className='py-1'>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href={PORTFOLIO_URL}
                              target='_blank'
                              rel='noopener noreferrer'
                              className={classNames(
                                active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700',
                                'block px-4 py-2 text-sm'
                              )}
                            >
                              View Portfolio
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href={GITHUB_URL}
                              target='_blank'
                              rel='noopener noreferrer'
                              className={classNames(
                                active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700',
                                'block px-4 py-2 text-sm'
                              )}
                            >
                              GitHub
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href={LINKEDIN_URL}
                              target='_blank'
                              rel='noopener noreferrer'
                              className={classNames(
                                active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700',
                                'block px-4 py-2 text-sm'
                              )}
                            >
                              LinkedIn
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                      <div className='py-1'>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href={RESUME_URL}
                              target='_blank'
                              rel='noopener noreferrer'
                              className={classNames(
                                active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700',
                                'block px-4 py-2 text-sm'
                              )}
                            >
                              Resume
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
          {children}
        </div>
      </div>
    </>
  )
}

export default Layout
