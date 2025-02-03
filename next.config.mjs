import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"], // Add 'localhost' here to allow images from your local server
  },
  reactStrictMode: false,
};
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);

