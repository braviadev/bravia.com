import { Img, Section } from '@react-email/components'

function Logo() {
  return (
    <Section className='mb-6'>
      <Img
        src='bravía.com/images/avatar.png'
        alt="Bravia Dper's Logo"
        width='96'
        height='96'
        className='rounded-full'
      />
    </Section>
  )
}

export default Logo
