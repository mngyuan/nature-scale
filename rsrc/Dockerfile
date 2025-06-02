FROM rstudio/plumber:latest AS builder
RUN apt-get update -qq && apt-get install -y \
    # --no-install-recommends \
    # r-cran-sf \
    r-cran-dplyr \
    # r-cran-tidyverse \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN R -e "install.packages(c('rstan', 'tidybayes', 'ggthemes', 'scales', 'raster'))"
RUN R -e "install.packages(c('tidyverse', 'sf'))"
# For logging
RUN R -e "install.packages(c('logger','tictoc', 'fs'))"
# For parallel processing
RUN R -e "install.packages(c('future', 'promises'))"

# FROM rstudio/plumber:latest AS runtime
# COPY --from=builder /usr/local/lib/R/site-library/ /usr/local/lib/R/site-library/

WORKDIR /nature-scale
COPY . .

EXPOSE 8000
CMD ["server.r"]
