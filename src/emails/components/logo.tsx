import { Img, Section } from '@react-email/components'

function Logo() {
  return (
    <Section className='mb-6'>
      <Img
        src='bravía.com/images/avatar.png'
        alt="Bravia Dper's Logo"
        width='70'
        height='70'
        className='rounded-full'
      />
    </Section>
  )
}

export default Logo
