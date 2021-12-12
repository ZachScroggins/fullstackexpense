import { GetStaticProps, NextPage } from 'next'
import { dehydrate, QueryClient, useQuery } from 'react-query'

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
  const { data, isLoading, isError, error } = useQuery<any, any>(
    'expenses',
    getExpenses
  )

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
    <div>
      <p>{JSON.stringify(data)}</p>
      <div>
        {data.map((expense: any) => (
          <p key={expense?.id}>{expense?.description}</p>
        ))}
      </div>
    </div>
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
