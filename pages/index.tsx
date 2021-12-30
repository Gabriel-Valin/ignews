/* eslint-disable @next/next/no-img-element */
import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import { SubscribeButton } from '../src/components/SubscribeButton'
import styles from './home.module.scss'
import { stripe } from '../src/services/stripe'

type HomeProps = {
  product: {
    priceId: string
    amount: number
  }
}

const Home = ({ product }: HomeProps) => {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, Welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get access to all the publications <br />
            <span>for {
                new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(product.amount / 100)
              } month</span>
          </p>
          <SubscribeButton priceId={product.priceId}/>
        </section>

        <img src="/images/avatar.svg" alt="Girl Coding" />
      </main>

    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1KCFsyIWkEB5mLizeECV6fvg', { expand: ['product'] })

  const product = {
    priceId: price.id,
    amount: price.unit_amount,
  }

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24, // 24 hrs.
  }
}

export default Home
