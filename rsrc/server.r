library(plumber)

options(error = function() {
  calls <- sys.calls()
  if (length(calls) >= 2L) {
    sink(stderr())
    on.exit(sink(NULL))
    cat("Backtrace:\n")
    calls <- rev(calls[-length(calls)])
    for (i in seq_along(calls)) {
      cat(i, ": ", deparse(calls[[i]], nlines = 1L), "\n", sep = "")
    }
  }
  if (!interactive()) {
    q(status = 1)
  }
})

source("./helpers/logging.r")
source("./helpers/parallel.r")

pr("api.r") %>%
  pr_hooks(list(preroute = pre_route_logging, postroute = post_route_logging)) %>%
  pr_run(port = 8000, host="0.0.0.0")

# Setting the host option on a VM instance ensures the application can be accessed externally.
# (This may be only true for Linux users.)
