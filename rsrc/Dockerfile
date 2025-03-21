# stage 1 install r dependencies
# split into multi stage build as per renv docker docs
# this way stage one only runs again if stage one changes
FROM rocker/r-base AS base
# LABEL org.opencontainers.image.authors="Docker User <docker@user.org>"

COPY . /nature-scale
WORKDIR /nature-scale

# install packages and let r2u convert to binary
# RUN ["R", "-f", "setup.r"]

# install packages from binary (much faster than from source)
RUN apt-get update
# RUN apt-get install -y zlib1g-dev libfontconfig1-dev
RUN apt-get install -y r-cran-plumber r-cran-sf r-cran-dplyr r-cran-tidyverse

# WORKDIR /nature-scale

# RUN R -e "install.packages('renv', repos = c(CRAN = 'https://cloud.r-project.org'))"
# COPY renv.lock renv.lock
# "approach 2" from the renv docker docs
# RUN mkdir -p renv
# COPY renv.lock renv.lock
# COPY .Rprofile .Rprofile
# COPY renv/activate.R renv/activate.R
# this file doesn't exist so don't copy
# COPY renv/settings.json renv/settings.json

# change default location of cache to project folder
# RUN mkdir renv/.cache
# ENV RENV_PATHS_CACHE renv/.cache

# install r packages from renv.lock
# RUN R -e "renv::restore()"

# stage 2 deploy the app
# FROM rocker/tidyverse

# WORKDIR /nature-scale
# COPY --from=base /nature-scale .

EXPOSE 8000
CMD ["R", "-f", "server.r"]
