import type { NextPage } from 'next'
import Link from 'next/link'
import { GITHUB_URL } from 'lib/myLinks'

const Home: NextPage = () => {
  return (
    <div className='relative min-h-screen overflow-hidden bg-gray-50'>
      <main className='relative z-10 flex items-center justify-center min-h-screen px-4 mx-auto max-w-7xl'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl'>
            <span className='block text-gray-800 xl:inline'>A Full Stack</span>{' '}
            <span className='block text-fuchsia-600 xl:inline'>
              Expense Tracker
            </span>
          </h1>
          <p className='max-w-md mx-auto mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl'>
            Ubuntu, MySQL, and PHP API Server for the back end. Statically
            generated React app for the front end. Sortable table for managing
            expenses.
          </p>
          <div className='max-w-md mx-auto mt-5 sm:flex sm:justify-center md:mt-8'>
            <div className='rounded-md shadow'>
              <Link href='/expenses'>
                <a className='flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white border border-transparent rounded-md bg-fuchsia-600 hover:bg-fuchsia-700 md:py-4 md:text-lg md:px-10'>
                  Get started
                </a>
              </Link>
            </div>
            <div className='mt-3 rounded-md shadow sm:mt-0 sm:ml-3'>
              <a
                href='https://github.com/ZachScroggins/fullstackexpense'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center justify-center w-full px-8 py-3 text-base font-medium bg-white border border-transparent rounded-md text-fuchsia-600 hover:bg-gray-50 md:py-4 md:text-lg md:px-10'
              >
                View code
              </a>
            </div>
          </div>
        </div>
      </main>

      <div
        className='z-0 pointer-events-none sm:block sm:absolute sm:inset-y-0 sm:h-full sm:w-full'
        aria-hidden='true'
      >
        <div className='relative h-full mx-auto max-w-7xl'>
          <svg
            className='absolute transform right-full translate-y-1/4 translate-x-1/4 lg:translate-x-1/2'
            width={404}
            height={784}
            fill='none'
            viewBox='0 0 404 784'
          >
            <defs>
              <pattern
                id='f210dbf6-a58d-4871-961e-36d5016a0f49'
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits='userSpaceOnUse'
              >
                <rect
                  x={0}
                  y={0}
                  width={4}
                  height={4}
                  className='text-gray-200'
                  fill='currentColor'
                />
              </pattern>
            </defs>
            <rect
              width={404}
              height={784}
              fill='url(#f210dbf6-a58d-4871-961e-36d5016a0f49)'
            />
          </svg>
          <svg
            className='absolute transform left-full -translate-y-3/4 -translate-x-1/4 md:-translate-y-0 lg:-translate-x-1/2'
            width={404}
            height={784}
            fill='none'
            viewBox='0 0 404 784'
          >
            <defs>
              <pattern
                id='5d0dd344-b041-4d26-bec4-8d33ea57ec9b'
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits='userSpaceOnUse'
              >
                <rect
                  x={0}
                  y={0}
                  width={4}
                  height={4}
                  className='text-gray-200'
                  fill='currentColor'
                />
              </pattern>
            </defs>
            <rect
              width={404}
              height={784}
              fill='url(#5d0dd344-b041-4d26-bec4-8d33ea57ec9b)'
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default Home
