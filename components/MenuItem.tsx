import { useRouter } from 'next/router'
import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/solid'
// @ts-ignore
const MenuItem = ({ href, children, newWindow = false }) => {
  const { asPath } = useRouter()

  return (
    <Link href={href} shallow={true}>
      <a
        className={`h-full border-b border-th-bkg-4 md:border-none flex justify-between text-th-fgd-1 font-bold items-center md:px-2 lg:px-4 py-3 md:py-0 hover:text-th-primary
          ${asPath === href ? `text-th-primary` : `border-transparent`}
        `}
        target={newWindow ? '_blank' : ''}
        rel={newWindow ? 'noopener noreferrer' : ''}
      >
        {children}
        <ChevronRightIcon className="md:hidden h-5 w-5" />
      </a>
    </Link>
  )
}

export default MenuItem
