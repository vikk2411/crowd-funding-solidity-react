import '../styles/globals.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
    <div> 
      <nav className="border-b mx-10 mb-5 pt-5 pb-2 ">
        <p className="text-4xl font-bold">Crowd Funding</p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-6 text-pink-500">
              Home
            </a>
          </Link>
          <Link href="/create-round">
            <a className="mr-6 text-pink-500">
              Create
            </a>
          </Link>
          
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
