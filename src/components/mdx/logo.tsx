import { Logo as BraviaLogo } from '@/components/ui/logo'

function Logo() {
  return (
    <div className='flex flex-col gap-4 md:flex-row'>
      <div className='flex h-52 w-full items-center justify-center rounded-lg bg-white'>
        <BraviaLogo className='text-black' width={48} />
      </div>
      <div className='flex h-52 w-full items-center justify-center rounded-lg bg-black'>
        <BraviaLogo className='text-white' width={48} />
      </div>
    </div>
  )
}

export default Logo
