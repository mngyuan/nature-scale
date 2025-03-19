library(plumber)
pr("api.r") %>%
  pr_run(port = 8000)
