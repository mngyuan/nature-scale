library(plumber)
pr("api.r") %>%
  pr_run(port = 8000, host="0.0.0.0")

# Setting the host option on a VM instance ensures the application can be accessed externally.
# (This may be only true for Linux users.)
