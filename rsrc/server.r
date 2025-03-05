library(plumber)
pr("plot.r") %>%
  pr_run(port = 8000)
