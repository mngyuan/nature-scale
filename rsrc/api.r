#* @apiTitle scale4nature
#* @apiDescription R backend API for scale4nature web app
#* @apiVersion 1.0.0
#* @apiContact list(name = "Github URL", url = "https://github.com/mngyuan/nature-scale")

# imports
source('./PlotAOI.R')
source('./Module2/RunForecast.R')
source('./ProjectSetup/MakeStandardReportingForm.R')

#* @filter cors
cors <- function(req, res) {
  res$setHeader("Access-Control-Allow-Origin", "http://localhost:3000")
  res$setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
  res$setHeader("Access-Control-Allow-Headers", "Content-Type")
  
  # If this is a preflight OPTIONS request, return 200 OK immediately
  if (req$REQUEST_METHOD == "OPTIONS") {
    res$status <- 200
    return(list())
  }
  
  plumber::forward()
}

library(sf)
library(dplyr)
south_africa<-read_sf("./Data/ExampleBoundary/GADM_SouthAfrica/gadm41_ZAF_3.shp")

#* OPTIONS endpoint to handle preflight requests
#* @options /run-forecast
function() {
  # This function will never actually be called because the cors filter
  # will handle OPTIONS requests, but it's needed to register the endpoint
  return(NULL)
}

#* Plot a histogram
#* @serializer png
#* @get /plot
function() {
  rand <- rnorm(100)
  hist(rand)
}

#* Return regions of given country
#* @serializer json
#* @get /boundary-names
function(country=NA, region=NA, district=NA) {
  folder<-paste0("./Data/CountryShapes/",country)
  shp<-list.files(folder,pattern=".shp",full.names = T)
  shp<-read_sf(shp)

  if(is.na(district)[1]==F){
    shp<-shp%>%filter(NAME_2 %in% district)
    return(unique(shp$NAME_3))
  }
  if(is.na(region)[1]==F){
    shp<-shp%>%filter(NAME_1 %in% region)
    return(unique(shp$NAME_2))
  }

  return(unique(shp$NAME_1))
}

#* Plot the given area of interest
#* @serializer png
#* @get /plot-area-of-interest
function(country=NA, region=NA, district=NA, ward=NA) {
  # TODO: does this handle arrays?
  aoi<-makeAOI(country=country, region=region, district=district, ward=ward)
  return(plotAoi(aoi=aoi))
}

#* Get the prediction chart
#* @serializer png
#* @param potentialAdopters:int
#* @param totalWeeks:int
#* @parser csv
#* @post /run-forecast
function(req, potentialAdopters, totalWeeks) {
  potentialAdopters <- as.integer(potentialAdopters)
  if (is.na(potentialAdopters)) potentialAdopters <- 0L
  totalWeeks <- as.integer(totalWeeks)
  if (is.na(totalWeeks)) totalWeeks <- 0L
  return(RunForecast(req$body, potentialAdopters, totalWeeks))
}

#* Get the standard reporting form
#* @serializer csv
#* @get /standard-reporting-form
#* @param adopterType:string
#* @param period:string
#* @param start:string
#* @param end:string
function(adopterType, period, start, end) {
  return(MakeStandardReportingForm(adopterType, period, start, end))
}
