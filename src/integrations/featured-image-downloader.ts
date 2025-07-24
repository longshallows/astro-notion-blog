import type { AstroIntegration } from 'astro'
import {
  getAllBlogPosts,
  getAllPersonPosts,
  downloadFile,
} from '../lib/notion/client'

export default (): AstroIntegration => ({
  name: 'featured-image-downloader',
  hooks: {
    'astro:build:start': async () => {
      const [blogPosts, personPosts] = await Promise.all([
        getAllBlogPosts(),
        getAllPersonPosts(),
      ])
      const posts = [...blogPosts, ...personPosts]

      await Promise.all(
        posts.map((post) => {
          if (!post.FeaturedImage || !post.FeaturedImage.Url) {
            return Promise.resolve()
          }

          let url!: URL
          try {
            url = new URL(post.FeaturedImage.Url)
          } catch {
            console.log('Invalid FeaturedImage URL: ', post.FeaturedImage?.Url)
            return Promise.resolve()
          }

          return downloadFile(url)
        })
      )
    },
  },
})
