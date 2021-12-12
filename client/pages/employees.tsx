import { GetStaticProps, NextPage } from 'next'

const Employees: NextPage = () => {
  return (
    <div>
      <p>exployees</p>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ctx => {
  return {
    props: {
      data: null
    }
  }
}

export default Employees
