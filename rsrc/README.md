# Nature Scale R API

## Running locally

```sh
rscript server.r
```

## Docker

First, build the docker image

```
docker build --platform linux/amd64 -t nature-scale .
```

Then, run the docker image

```
docker run --platform linux/amd64 -it -p 8000:8000 nature-scale
```

To push to Google Cloud Run,

```
# Read .env environment variables
export $(grep -v '^#' .env | xargs -0)
# Authenticate if not already done
gcloud auth configure-docker $REGION-docker.pkg.dev
docker push $IMAGE_TAG
```

see [here](https://medium.com/@taylorhughes/how-to-deploy-an-existing-docker-container-project-to-google-cloud-run-with-the-minimum-amount-of-daca0b5978d8) for more information

Make sure to set the relevant environment variables, i.e.

```
ALLOWED_ORIGINS=https://frontend-hosted.location
```
