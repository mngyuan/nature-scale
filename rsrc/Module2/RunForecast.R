library(tidyverse)
library(ggthemes)
library(tidyverse)
library(tidybayes)

#RUN THESE THE FIRST TIME YOU RUN THE SCRIPT EACH SESSION
library(rstan)
rstan_options(auto_write = TRUE)
options(mc.cores = parallel::detectCores())

RunForecastAPIWrapper<-function(csv, potentialAdopters, targetAdoption=NA, width=800, height=600) {
  # Write to an image file for returning to the api
  img_file <- tempfile(fileext = ".png")
  png(img_file, width = width, height = height)

  mod<-RunForecast(csv, potentialAdopters, targetAdoption)
  calcs<-DifEqParameterPlots_Cumulative(mod)

  # Prepare data for api
  # Close graphics device
  dev.off()
  plot_data <- readBin(img_file, "raw", n = file.info(img_file)$size)
  plot_base64 <- jsonlite::base64_enc(plot_data)
  # Unlink the temporary image file
  unlink(img_file)

  return(list(
    parameters = list(
      independent = calcs$ind[1]$med[1],
      social = calcs$soc[1]$med[1]
    ),
    plot = list(
      type = "image/png",
      base64 = plot_base64
    )
  ))
}


# Save model otherwise docker will always recompile
# This adds ~2min to loading the server
model = stan_model("./Module2/SIaM.stan")
RunForecast<-function(csv, potentialAdopters, targetAdoption=NA) {

  #### STEP 1: Load adoption data
  df<-csv
  df <- df %>% mutate(Time = as.character(Time)) %>%
    mutate(Time = factor(Time, levels = df$Time)) #Make time an ordered categorical
  df2 <- df #save full version
  df<-na.omit(df) #get rid of NAs
  
  #### STEP 2: Set potential adopters (total population)
  
  #Import potential adopters from Module 1
  #sample_n = potentialAdopters
  
  # OR set the number directly if known
  
  #338 is used for the example dataset of ALL 
  #settlements inside K2c biosphere reserve over 100 buildings
  sample_n<-potentialAdopters
  
  
  #Plot adoption timeline
  #ggplot(df,aes(x=Year,y=Adopters/sample_n))+geom_point()
  
  
  ####STEP 3: get somevalues from the data
  
  #Set the number of time periods we have data for
  sample_days = nrow(df)
  
  #For now we'll assume complete sampling
  sample_time = 1:sample_days 
  
  
  #This is the length of time to fit the timeseries for
  #i.e., the full project duration. 
  #In the example data, let's do 52 weeks
  t_max<-nrow(df2)
  
  #Ideally we will create a custom csv for users to fill in
  #That has the project duration and fills in missing
  #and future data with NAs
  
  sample_y<-df$Adopters[1:sample_days]
  
  
  #### STEP 4: make full data list
  stan_d = list(n_obs = sample_days,
                n_params = 2,
                n_difeq = 3,
                n_sample = sample_n,
                n_fake = length(1:t_max),
                y = sample_y,
                t0 = 0,
                ts = sample_time,
                fake_ts = c(1:t_max))
  
  # Which parameters to monitor in the model:
  params_monitor = c("y_hat", "y0", "params", "fake_I") #fake_I from generated quantities
  
  
  #### STEP 5: run model
  
  # Fit and sample from the posterior
  mod = sampling(model,
             data = stan_d,
             pars = params_monitor,seed = 123,
             chains = 3,cores=3,
             warmup = 500,#8000
             iter = 1500) #10000
  
  #### These are supplemental/diagnostic figs. Need to figure out 
  #What to do with these
  
  # You should do some MCMC diagnostics, including:
  #traceplot(mod, pars="lp__")
  
  #traceplot(mod, pars=c("params", "y0"),inc_warmup=T )
  #summary(mod)$summary[,"Rhat"]
  
  # These all check out for my model, so I'll move on.
  
  # Extract the posterior samples to a structured list:
  posts <- rstan::extract(mod)
  #hist(posts$params[,1])
  #hist(posts$params[,2])
  
  
  
  draws<-as_tibble(posts$fake_I[,,2])%>%add_column(draw=1:3000)
  names(draws)[1:t_max]<-1:t_max
  draws <-  pivot_longer(draws, c(1:t_max) , names_to = "mod_time")
  
  
  #Plot forecast
  p<-ggplot(draws, aes(x=as.integer(mod_time), y=value)) +
    tidybayes::stat_lineribbon(data=filter(draws,as.integer(mod_time)<=sample_days),
                               aes(fill_ramp = after_stat(.width)), 
                               .width = c(0.5,0.9), fill = "#969696",
                               color=alpha("gray",0.01),linetype="blank",
                               alpha=0.75) +
    tidybayes::stat_lineribbon(data=filter(draws,as.integer(mod_time)>sample_days-1),
                               aes(fill_ramp = after_stat(.width)), 
                               .width = c(0.25,0.5,0.9), fill = "#252525",
                               color=alpha("gray",0.01),linetype="blank",
                               alpha=0.75) +
    geom_point(data=df2,aes(x=as.integer(Time),y=Adopters/sample_n),color="darkred",size=3.0,
               shape=21,fill=alpha("red",alpha=0.5),stroke=1.5)+
    geom_vline(xintercept = sample_days,linetype="longdash")+
    ggthemes::theme_clean()+
    scale_x_continuous(
      name = "Project time",
      breaks = as.integer(df2$Time[c(1, ceiling(nrow(df2) /
                                                  2), nrow(df2))]),
      labels = df2$Time[c(1, ceiling(nrow(df2) / 2), nrow(df2))]
    )+
    ylab("Adoption")+
    scale_y_continuous(labels=scales::percent)+
    theme(axis.title = element_text(colour = "black",size=16),
          axis.text=element_text(color="black",size=14))+
    theme(plot.margin = unit(c(.2, .5, .2, .2), "cm"))
  if (!is.na(targetAdoption)) {
    p<-p+
      geom_hline(yintercept = targetAdoption/sample_n, linetype="longdash")+
      annotate("text", x=Inf, y=targetAdoption/sample_n, label="Target", hjust=1)
  }
  print(p)

  return(mod)
}

#c<-read.csv("./Module2/ExampleAdoptionK2CSettlements.csv")
#RunForecast(c, 338, 152)





