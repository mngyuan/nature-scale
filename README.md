# scale4nature

Next.js app hosted on Vercel using Supabase for auth and postgres and Docker container for [R API](https://github.com/matthewclark1223/PredictingAdoptionWebTool)

# Development

First install the dependencies

```sh
npm install
```

then run the development server

```sh
npm run dev
```

and open [http://localhost:3000](http://localhost:3000) in your browser.

# Deploying

Make sure to set the correct environment variables, i.e.

```
NEXT_PUBLIC_SUPABASE_URL=<value from supabase>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<value from supabase>

R_API_BASE_URL=https://docker-container.url
```
