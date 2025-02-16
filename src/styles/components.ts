export const buttonVariants = {
  primary: "rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 transition-colors",
  secondary: "rounded-md bg-white/10 px-4 py-2 text-white hover:bg-white/20 transition-colors",
  danger: "rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition-colors",
} as const;

export const inputVariants = {
  default: "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-purple-500 focus:ring-purple-500 transition-colors",
  disabled: "w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-900 cursor-not-allowed",
} as const;

export const cardVariants = {
  default: "rounded-lg bg-white/10 p-6",
  interactive: "rounded-lg bg-white/10 p-6 hover:bg-white/20 transition-colors cursor-pointer",
} as const;

export const textVariants = {
  h1: "text-3xl font-bold text-white",
  h2: "text-xl font-semibold text-white",
  body: "text-gray-200",
  small: "text-sm text-gray-300",
} as const;

export const layoutVariants = {
  page: "min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] p-4",
  container: "mx-auto max-w-7xl",
  section: "mb-8",
} as const;
