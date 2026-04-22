type LogoProps = React.SVGAttributes<SVGElement>

export function Logo(props: LogoProps) {
  return (
  <svg version='1.0' xmlns='http://www.w3.org/2000/svg' viewBox='200 260 680 680' {...props}>
    <path
    d='M295 270H580C710 270 780 340 780 435C780 495 750 540 690 560C765 580 810 635 810 720C810 830 730 900 580 900H295V270ZM435 395V515H555C600 515 635 490 635 455C635 420 600 395 555 395H435ZM435 605V775H575C630 775 665 745 665 690C665 635 630 605 575 605H435Z'
    fill='currentColor' />
  </svg>
  )
}
