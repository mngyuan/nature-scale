library(future)
library(promises)

WORKERS <- strtoi(Sys.getenv("WORKERS", 4))

future::plan(future::multisession(workers = WORKERS))

log_info(paste0("Plumber will use ", WORKERS, " workers"))
