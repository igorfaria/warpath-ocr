import { NextResponse } from 'next/server'
import Users from '../../components/Users'

export async function GET({ users }) {
    let users_j = []
    if(typeof users == 'object') users_j = users 
    return NextResponse.json(users_j)
}

export async function getStaticPaths() {
    // Return empty paths because we don't want to generate anything on build
    // { fallback: blocking } will server-render pages
    // on-demand if the path doesn't exist.
    return {
      paths: [],
      fallback: 'blocking',
    };
  }

  export const getStaticProps = async () => {
    const users = Users()
    return { props: { users } }
  }

