#* @filter cors
cors <- function(res) {
    res$setHeader("Access-Control-Allow-Origin", "http://localhost:3000")
    plumber::forward()
}

library(sf)
library(dplyr)
south_africa<-read_sf("./Data/ExampleBoundary/GADM_SouthAfrica/gadm41_ZAF_3.shp")

#* Plot a histogram
#* @serializer png
#* @get /plot
function() {
  rand <- rnorm(100)
  hist(rand)
}

#* Return regions of South Africa
#* @serializer json
#* @get /south-africa
function(region="", district="") {
  sa<-south_africa
  if(district!="") {
    # sa<-sa%>%filter(NAME_1==region)
    sa<-sa%>%filter(NAME_2==district)
    return(unique(sa$NAME_3))
  }
  if(region!="") {
    sa<-sa%>%filter(NAME_1==region)
    return(unique(sa$NAME_2))
  }
  return(unique(sa$NAME_1))
}

