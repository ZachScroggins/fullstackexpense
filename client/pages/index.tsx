import type { NextPage } from 'next'
import styles from '../styles/Home.module.sass'
import { useQuery, useMutation, useQueryClient } from 'react-query'

const getExpenses = async () => {
  const response = await fetch(
    'https://api.fullstackexpense.com/api/expense/read.php'
  )
  console.log(response)
  if (response.ok) {
    const data = await response.json()
    return data
  }
  return 'hi'
}

const Home: NextPage = () => {
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
        <p>loading</p>
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

export default Home
