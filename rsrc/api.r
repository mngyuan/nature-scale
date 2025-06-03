#* @apiTitle scale4nature
#* @apiDescription R backend API for scale4nature web app
#* @apiVersion 1.0.0
#* @apiContact list(name = "Github URL", url = "https://github.com/mngyuan/nature-scale")

library(sf)
library(dplyr)
library(terra)
# imports
source('./Module1/PlotAOI.R')
source('./Module2/RunForecast.R')
source('./ProjectSetup/MakeStandardReportingForm.R')
source('./Module1/IndividualsPlotsCalculations.R')
source('./Module1/SettlementPlotsCalculations.R')

#* @filter cors
cors <- function(req, res) {
  allowed_origins <- Sys.getenv("ALLOWED_ORIGINS")
  if (allowed_origins == "") {
    allowed_origins <- "http://localhost:3000"
  }
  res$setHeader("Access-Control-Allow-Origin", allowed_origins)
  res$setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
  res$setHeader("Access-Control-Allow-Headers", "Content-Type")
  
  # If this is a preflight OPTIONS request, return 200 OK immediately
  if (req$REQUEST_METHOD == "OPTIONS") {
    res$status <- 200
    return(list())
  }
  
  plumber::forward()
}

#* OPTIONS endpoint to handle preflight requests
#* @options /run-forecast
function() {
  # This function will never actually be called because the cors filter
  # will handle OPTIONS requests, but it's needed to register the endpoint
  return(NULL)
}
#* @options /plot-area-of-interest
function() {
  return(NULL)
}

#* For pinging from the web app to "wake" the docker container on the cloud
#* @serializer json
#* @get /wake
function() {
  future_promise({
    # Return system information and date
    return(list(
      system = Sys.info(),
      date = Sys.time()
    ))
  })
}

#* Return regions of given country
#* @serializer json
#* @get /boundary-names
function(country=NA, region=NA, district=NA) {
  future_promise({
    folder<-paste0("./Data/CountryShapes/",country)
    shp<-list.files(folder,pattern=".shp",full.names = T)
    shp<-read_sf(shp)

    if(is.na(district)[1]==F){
      if ("NAME_3" %in% names(shp)) {
        shp<-shp%>%filter(NAME_2 %in% district)
        return(unique(shp$NAME_3))
      }
      return (list())
    }
    if(is.na(region)[1]==F){
      shp<-shp%>%filter(NAME_1 %in% region)
      return(unique(shp$NAME_2))
    }

    return(unique(shp$NAME_1))
  })
}
#south_africa<-read_sf("./Data/ExampleBoundary/GADM_SouthAfrica/gadm41_ZAF_3.shp")

#* Plot the given area of interest
#* @serializer json
#* @get /plot-area-of-interest
function(country=NA, region=NA, district=NA, ward=NA) {
  future_promise({
    # TODO: does this handle arrays?
    aoi<-makeAOI(country=country, region=region, district=district, ward=ward)

    # Prepare data for api
    aoi_as_string <- jsonlite::base64_enc(serialize(aoi, NULL))
    serialized_data<-plotAoiAPIWrapper(aoi = aoi)
    r_as_string <- jsonlite::base64_enc(serialize(serialized_data$r, NULL))
    # r_as_string <- serialized_data$r

    return(list(
      data = list(
        aoi = aoi_as_string,
        r = r_as_string
      ),
      plot = serialized_data$plot
    ))
  })
}

#* Plot the given area of interest given a shp boundary
#* Note: the parameter name of the below function must match the form data name
#* of the request
#* @serializer json
#* @param files:[file]
#* @parser multi
#* @parser octet
#* @post /plot-area-of-interest
function(files) {
  future_promise({
    print(paste("Received files:", names(files)))
    if (length(files) == 0) {
      stop("No files provided")
    }
    # get .shp file name
    shp_file_name <- names(files)[grep("\\.shp$", names(files))]
    if (length(shp_file_name) == 0) {
      stop("No .shp file provided")
    }
    print(paste("Processing .shp file:", shp_file_name))

    temp_dir <- tempdir()
    # Delete temporary files
    # this makes plumber's png serializer lose its output file, so commenting
    # on.exit(unlink(temp_dir, recursive = TRUE), add = TRUE)
    for (i in seq_along(files)) {
      file_name <- names(files)[i]
      file_content <- files[[i]]
      
      # Write each file with its original name in the temp directory
      file_path <- file.path(temp_dir, file_name)
      writeBin(file_content, file_path)
      on.exit(unlink(file_path), add = TRUE)
    }
    # Find the .shp file based on shp_file_name
    shp_file <- list.files(temp_dir, pattern = paste0("^", shp_file_name), full.names = TRUE)[1]

    aoi <- read_sf(shp_file)
    # Prepare data for api
    aoi_as_string <- jsonlite::base64_enc(serialize(aoi, NULL))
    serialized_data<-plotAoiAPIWrapper(aoi = aoi)
    r_as_string <- jsonlite::base64_enc(serialize(serialized_data$r, NULL))
    # r_as_string <- serialized_data$r

    return(list(
      data = list(
        aoi = aoi_as_string,
        r = r_as_string
      ),
      plot = serialized_data$plot
    ))
  })
}

#* Get the potential adopter individuals amount
#* @serializer json
#* @param resourceTypes:[number]
#* @param bufferDistance:number
#* @post /potential-adopters/individuals
function(req, resourceTypes, bufferDistance = NA) {
  future_promise({
    resourceTypes <- jsonlite::fromJSON(as.character(resourceTypes))
    bufferDistance <- as.numeric(bufferDistance)

    if (length(resourceTypes) == 0 || all(is.na(resourceTypes))) {
      stop("No resource types provided")
    }

    reqBody<-jsonlite::fromJSON(req$body)
    aoi<-unserialize(jsonlite::base64_dec(reqBody$aoi))
    r<-terra::unwrap(unserialize(jsonlite::base64_dec(reqBody$r)))

    if (is.null(bufferDistance) || is.na(bufferDistance) || bufferDistance == 0) {
      return (IndividualsPlotsCalculations(resourceTypes, aoi=aoi, r=r))
    }
    return(IndividualsPlotsCalculations(resourceTypes, bufferDistance, aoi, r))
  })
}

#* Get the potential adopter settlement amount and png plot
#* @serializer json
#* @param countries:[string]
#* @param resourceTypes:[number]
#* @param bufferDistance:number
#* @param settlementSizes:[string]
#* @post /potential-adopters/settlements
function(req, countries, resourceTypes, bufferDistance = NA, settlementSizes) {
  future_promise({
    countries <- jsonlite::fromJSON(as.character(countries))
    resourceTypes <- jsonlite::fromJSON(as.character(resourceTypes))
    bufferDistance <- as.numeric(bufferDistance)
    settlementSizes <- jsonlite::fromJSON(as.character(settlementSizes))

    if (length(resourceTypes) == 0 || all(is.na(resourceTypes))) {
      stop("No resource types provided")
    }

    reqBody<-jsonlite::fromJSON(req$body)
    aoi<-unserialize(jsonlite::base64_dec(reqBody$aoi))
    r<-terra::unwrap(unserialize(jsonlite::base64_dec(reqBody$r)))

    if (is.null(bufferDistance) || is.na(bufferDistance) || bufferDistance == 0) {
      return (SettlementsPlotsCalculationsAPIWrapper(Countries=countries, ResourceTypes=resourceTypes, SettlementSizes=settlementSizes, aoi=aoi, r=r))
    }
    return(SettlementsPlotsCalculationsAPIWrapper(countries, resourceTypes, bufferDistance, settlementSizes, aoi, r))
  })
}

#* Get the prediction chart
#* @serializer png
#* @param potentialAdopters:int
#* @parser csv
#* @post /run-forecast
# TODO: this route doesn't work with parellization, the png created isn't detected
function(req, potentialAdopters, targetAdoption) {
  potentialAdopters <- as.integer(potentialAdopters)
  targetAdoption <- as.integer(targetAdoption)
  if (is.na(potentialAdopters)) potentialAdopters <- 0L
  if (is.na(targetAdoption)) targetAdoption <- 0L
  return(RunForecast(req$body, potentialAdopters, targetAdoption))
}

#* Get the standard reporting form
#* @serializer csv
#* @get /standard-reporting-form
#* @param adopterType:string
#* @param period:string
#* @param start:string
#* @param end:string
function(adopterType, period, start, end) {
  future_promise({
    return(MakeStandardReportingForm(adopterType, period, start, end))
  })
}
