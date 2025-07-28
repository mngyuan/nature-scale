# Contributing

Thank you for your interest in contributing to this project!

## Development

### Frontend

Please use prettier to format your code.

To tun the local frontend:

```
npm run dev
```

### Backend

Run the local backend R API server:

```bash
cd rsrc/
rscript server.r
```

## Deploying

### Frontend changes

1. Check for errors; if `npm run build` fails Vercel won't deploy

```bash
npm run lint
npx tsc --noEmit
```

2. Push to `main`; this triggers a Vercel deployment

### Backend changes

See `rsrc/README.md` for full details.

1. Build the R backend Docker image
2. Push the Docker image to Google Artifact Registry
3. `Edit and deploy` in Cloud Run and chose the newest image that you just pushed

### Database changes

1. Generate/[download](https://supabase.com/docs/guides/api/rest/generating-types) new types for typescript
