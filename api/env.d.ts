/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EMAILJS_SERVICE_ID: string
  readonly VITE_EMAILJS_PUBLIC_KEY: string
  readonly VITE_EMAILJS_BUSINESS_EMAIL: string
  readonly VITE_EMAILJS_ADMIN_TEMPLATE_ID: string
  readonly VITE_EMAILJS_CUSTOMER_TEMPLATE_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
