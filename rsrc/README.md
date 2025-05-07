First, build the docker image

```
docker build --platform linux/amd64 -t nature-scale .
```

Then, run the docker image

```
docker run --platform linux/amd64 -it -p 8000:8000 nature-scale
```
