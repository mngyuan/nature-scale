SettlementsPlotsCalculationsAPIWrapper<-function(
    Countries,
    ResourceTypes,
    BufferDistKM,
    SettlementSizes,
    aoi
) {
  # Write to an image file for returning to the api
  img_file <- tempfile(fileext = ".png")
  png(img_file, width = 800, height = 600)
  # TODO: this duplicates work but has to be done because of the add=TRUE in plot calls
  # this will start something drawing onto our temp file, otherwise the add=TRUE
  # fails to do anything
  plotAoi(aoi)

  PotentialAdopters<-SettlementsPlotsCalculations(
    Countries = Countries,
    ResourceTypes = ResourceTypes,
    BufferDistKM = BufferDistKM,
    SettlementSizes = SettlementSizes,
    aoi = aoi
  )
  
  print(paste("Potential Adopters:", PotentialAdopters))

  # Prepare data for api
  # Close graphics device
  dev.off()
  plot_data <- readBin(img_file, "raw", n = file.info(img_file)$size)
  plot_base64 <- jsonlite::base64_enc(plot_data)
  # Unlink the temporary image file
  unlink(img_file)

  return(list(
    potentialAdopters = PotentialAdopters,
    plot = list(
      type = "image/png",
      base64 = plot_base64
    )
  ))
}

SettlementsPlotsCalculations<-function(
    Countries, #One or more countries. Same as in PlotAOI script
    ResourceTypes, #Resource type. Options are: closed forest, open forest, shrubs, herbaceous vegetation, bare, agriculture, freshwater, sea
    BufferDistKM, #buffer around resource type that we want to count and plot settlements. in kilometers
    SettlementSizes, # sizes of settlements considered, options are "1-50","51-100","101-250","251-1000","1001 and up"
    aoi # Area of interest from PlotAOI script, should be a sf object
  ){

#vector of countries the project area is in
COUNTRIES<-c(Countries)

#e.g., 5% of pixels need to be resource type (e.g., grassland)
#within 10 km buffer. This keeps one spuriois pixel from (mis) identifying a settlement as close to a given land cover
BUFFER_PERC<-0.05

#Sizes of settlements considered
BUILDING_COUNT<-c(SettlementSizes)#"1-50","51-100","101-250","251-1000","1001 and up"

#Identify relevent settlements files
files<-list()
for(i in 1:length(COUNTRIES)){
  country<-COUNTRIES[i]
  countryfile<-paste0("./Data/SettlementsPopulation/SettlementsCentroid/",country,"/",
                      list.files(paste0("./Data/SettlementsPopulation/SettlementsCentroid/",
                                        country),pattern=".shp"))
  files<-c(files,countryfile)
  }

#load settlements files
settlements<-lapply(c(files), sf::read_sf)  #load the country settlement files into a list

sf_use_s2(FALSE) #don#t use spherical geometry
settlementsClip<- lapply(settlements,sf::st_intersection, aoi )  #crop the settlements to the AOI

settlements<-bind_rows(settlementsClip) # get rid of the list format. bind all rows


settlements<-settlements%>%filter(is_fp==0)%>%filter(prob_fp<=0.25)%>% #remove known and suspected false positives
  filter(bld_count%in% BUILDING_COUNT) #only include settlements with specified number of buildings


if (missing(BufferDistKM)) { #If no buffer, just plot them all
  #Plot settlements
  plot(settlements, col=alpha("#dd3497",0.65), fill=alpha("black",0.65),lwd=0.9 , add=TRUE,pch=20,cex=3)
  #Identify # of settlements inside project area
  PotentialAdopters<-nrow(settlements)
  return(PotentialAdopters)
} else { #If a buffer is specified
  
  ##### If buffering by distance to resource#####
  land_cover_class<-c(ResourceTypes) #example grassland (4)
  
  
  #Function to apply within the buffer around each settlement
  check_for_grassland <- function(values,...) {
    values <- na.omit(values)
    return(length(which(values%in%land_cover_class))>=BUFFER_PERC*length(values))  #This could be modified to be more than one. That way spurious single pixels don't mess up the buffering
  }
  
  
  #Reproject settlements to a crs that uses meters 
  settlements_proj <- st_transform(settlements, crs = 32633)  # Example: UTM zone 33N
  
  # Buffer in meters (1 km = 1000 m)
  buffer <- st_buffer(settlements_proj, dist = 1000 *BufferDistKM)
  
  # Transform back to original CRS
  buffer <- st_transform(buffer, crs = st_crs(settlements))
  
  
  # Use the modified extract function
  extract <- terra::extract(x = r,              # Raster layer
                            y = buffer,    # SpatialPoints* object   
                            na.rm = TRUE,       # Remove NAs
                            fun = check_for_grassland,  # Function to check for 'grassland'
                            df = TRUE,          # Return a dataframe?
                            small = TRUE   )     # Include small buffers?
  
  #bind the T/F statement to the data and filter by T
  #If within the buffer from the resource type
  settlementsBuf<-cbind(settlements,extract)%>%filter(desc==TRUE)
  
  
  
  plot(settlementsBuf, col = alpha("#dd3497", 0.65),  # Fill color
       border = alpha("black", 0.65),lwd=0.9 , add=TRUE,pch=20,cex=3)
  
  
  #Sum the potential adopters (settlements nearby resource of interest)
  PotentialAdopters<-nrow(settlementsBuf)
}
}

#example use
# SettlementsPlotsCalculations(
    # Countries="Angola", #One or more countries. Same as in PlotAOI script
    # ResourceTypes=4, #Resource type. Options are: closed forest (1), open forest (2), shrubs (3), herbaceous vegetation (4),
    # #herbaceous wetland (5), bare (6), agriculture (8), freshwater (10), sea (11). NOTE, snow (7) and urban (9) are excluded 
    # BufferDistKM=12, #buffer around resource type that we want to count and plot settlements. in kilometers
    # SettlementSizes=c("101-250","251-1000","1001 and up") # sizes of settlements considered, options are "1-50","51-100","101-250","251-1000","1001 and up"
# )






