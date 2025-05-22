import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bpucqovnfvgqcfqlczhg.supabase.co',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
