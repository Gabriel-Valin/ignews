import { signIn, useSession } from 'next-auth/react'
import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe-client'
import styles from './styles.module.scss'

type SubscriptionButtonType = {
    priceId: string
}

export const SubscribeButton = ({ priceId }: SubscriptionButtonType) => {
    const session = useSession()

    const handleSubscription = async () => {
        if (!session) {
            signIn('github')
            return;
        }

        try {
            const response = await api.post('/subscribe')
            const { sessionId } = response.data

            const stripe = await getStripeJs()

            stripe?.redirectToCheckout({ sessionId })
        } catch (err) {
            alert(err)
        }
    }

    return (
        <button
            type='button'
            className={styles.subscribeButton}
            onClick={handleSubscription}
        >
            Subscribe now
        </button>
    )
}