import styles from './styles.module.scss'

type SubscriptionButtonType = {
    priceId: string
}

export const SubscribeButton = ({ priceId }: SubscriptionButtonType) => {
    return (
        <button
            type='button'
            className={styles.subscribeButton}
        >
            Subscribe now
        </button>
    )
}