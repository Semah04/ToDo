/**
 * layout.tsx - Root Layout Component
 * 
 * This is the root layout component in Next.js App Router.
 * It wraps all pages and provides the base HTML structure.
 * 
 * Key Concepts:
 * - This component is shared across all pages
 * - It defines the <html> and <body> tags
 * - Metadata exports configure SEO and page metadata
 * - The {children} prop is where page content is rendered
 * 
 * In Next.js App Router:
 * - layout.tsx files create nested layouts
 * - The root layout.tsx is required
 * - It must contain <html> and <body> tags
 */
import type { Metadata } from 'next'
import './globals.css'

/**
 * Metadata Export
 * 
 * Configures the page's metadata for SEO and browser tabs.
 * This is a Next.js feature that sets the <title> and <meta> tags.
 * 
 * Properties:
 * - title: Appears in browser tab and search results
 * - description: Used by search engines and social media sharing
 */
export const metadata: Metadata = {
  title: 'ToDo App', // Browser tab title
  description: 'Simple CRUD ToDo Application', // Meta description for SEO
}

/**
 * RootLayout Component
 * 
 * @param children - React node containing the page content
 * 
 * This component wraps all pages in the application.
 * The {children} prop is where the actual page content (like page.tsx) gets rendered.
 * 
 * Structure:
 * - <html>: Root HTML element with language attribute
 * - <body>: Body element containing all page content
 * - {children}: The page component that's currently being displayed
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode // TypeScript type: can be any valid React content
}) {
  return (
    <html lang="en">
      {/* lang="en" tells browsers and screen readers the page language is English */}
      <body>
        {/* {children} renders the current page component (e.g., page.tsx) */}
        {children}
      </body>
    </html>
  )
}

