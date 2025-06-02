# TODO: The SpatRaster global variable, r, used in PlotAOI and later in Individuals and Settlements
# plot calculations, is non-exportable, but the global environment won't persist between different
# works/parallel calls. This is a serious blocker.
# https://future.futureverse.org/articles/future-4-non-exportable-objects.html#protect-against-non-exportable-objects

library(future)
library(promises)

WORKERS <- strtoi(Sys.getenv("WORKERS", 4))

future::plan(future::multisession(workers = WORKERS))

log_info(paste0("Plumber will use ", WORKERS, " workers"))
