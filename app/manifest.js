export default function manifest() {
  return {
    name: 'Complex - Local Shops App',
    short_name: 'Complex',
    description: 'Your premium hyperlocal commerce platform',
    start_url: '/',
    display: 'standalone',
    background_color: '#F7F7F7',
    theme_color: '#0A0A0A',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
