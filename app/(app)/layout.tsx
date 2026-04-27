import { Toaster } from 'sonner'

// Demo mode — no auth check
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="bottom-right" richColors />
    </>
  )
}
