/* eslint-disable @next/next/no-document-import-in-page */
/* eslint-disable @next/next/no-title-in-document-head */
import { GetStaticProps } from "next"
import { useSession } from "next-auth/react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { RichText } from "prismic-dom"
import { useEffect } from "react"
import { getPrismicClient } from "../../../src/services/prismic"
import styles from '../post.module.scss'

type PostProps = {
    post: {
        slug: string
        title: string
        content: string
        updatedAt: string
    }
}

export default function PostPreview ({ post }: PostProps) {
    const { data: session } = useSession()
    const router = useRouter()

    useEffect(() => {
        console.log(session)
        if (session?.activeSubscription) {
            router.push(`/posts/${post.slug}`)
        }
    }, [session])

   return (
    <>
        <Head>
            <title>{post.title} | ignews</title>
        </Head>

        <main className={styles.container} >
            <article className={styles.posts}>
                <h1>{post.title}</h1>
                <time>{post.updatedAt}</time>
                <div
                    className={`${styles.postContent} ${styles.previewContent}`}
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
                <div 
                    className={styles.continueReading}
                >
                    Wanna continue reading?
                    <Link href='/'>
                        <a href="">Subscribe Now! ✅</a>
                    </Link>
                </div>
            </article>
        </main>
    </>
   ) 
}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { slug } = params

    const prismic = getPrismicClient()
    const response = await prismic.getByUID('post', String(slug), {})
    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content.splice(0, 4)),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    return {
        props: {
            post
        },
        redirect: 60 * 30,
    }
}