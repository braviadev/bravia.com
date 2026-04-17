import { Column, Hr, Img, Link, Row, Section, Text } from '@react-email/components'

const currentYear = new Date().getFullYear()

function Footer() {
  return (
    <>
      <Hr className='mt-6 mb-3' />
      <Section>
        <Row className='mt-4' align='left' width='auto'>
          <Column className='pr-6 align-middle'>
            <Link href='https://x.com/O_Toyyib' className='text-xl text-black'>
              <Img src='https://www.bravía.com/images/email/x.png' alt='X' width={22} height={22} />
            </Link>
          </Column>
          <Column className='align-middle'>
            <Link href='https://github.com/braviadev/bravia.dev' className='text-xl text-black'>
              <Img src='https://www.bravía.com/images/email/github.png' alt='GitHub' width={22} height={22} />
            </Link>
          </Column>
        </Row>
      </Section>
      <Text className='mx-0 mt-6 mb-0 p-0 text-xs font-normal text-gray-500'>
        © {new Date().getFullYear()} Bravia Developer. All rights reserved.
      </Text>
    </>
  )
}

export default Footer
