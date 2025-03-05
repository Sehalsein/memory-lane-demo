import Dialog from '@/src/components/Dialog'
import ShareLink from '@/src/components/ShareLink'
import { Button } from '@/src/components/ui/button'
import { Share2 } from 'lucide-react'

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? 'http://localhost:3000'

type Props = {
  slug: string
  className?: string
}

export default function ShareButton(props: Props) {
  return (
    <Dialog
      trigger={
        <Button variant='outline' size='sm' className={props.className}>
          <Share2 />
          Share
        </Button>
      }
      title='Share memory'
      description='Share this memory lane with others by copying the link below. Anyone with the link can view this memory lane.'
    >
      <ShareLink url={`${DOMAIN}/${props.slug}`} />
    </Dialog>
  )
}
