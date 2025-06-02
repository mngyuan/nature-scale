
IndividualsPlotsCalculations<-function(
    ResourceTypes, #Resource type. Options are: closed forest, open forest, shrubs, herbaceous vegetation, bare, agriculture, freshwater, sea
    BufferDistKM, #buffer around resource type that we want to count and plot settlements. in kilometers
    aoi # Area of interest from PlotAOI script, should be a sf object
){



#Load the landscan gridded population data from 2022
Pop<-terra::rast("./Data/SettlementsPopulation/landscan-global-2022.tif")

#Crop the bounding box to the project area
Pop<-terra::crop(Pop,aoi)

#Make all values outside the project area NA
Pop<-terra::mask(Pop,aoi)


if (missing(BufferDistKM)) { #If no buffer, just plot them all
  #Get the total number of individuals living in the project area
  PotentialAdopters<-sum(Pop[],na.rm=T)
  return(PotentialAdopters)
  
} else { #If a buffer is specified


##### If buffering by distance to resource#####
# Define the land cover class of interest (for example, grassland)
land_cover_class <- c(ResourceTypes)

# Reclassify the land cover raster to binary (1 for the class of interest, NA for others)
land_cover_binary <-r #new raster
land_cover_binary[]<-ifelse(r[]==land_cover_class,1,NA) #reclassify

#This is removing pixels of land cover that aren't connected at 100< others.
#We're essentially just reducing noise here
land_cover_binary <- terra::sieve(land_cover_binary, 20,directions=8) 

#Reclassify again. The sieving creates 0's instead of NAs
land_cover_binary[]<-ifelse(land_cover_binary[]==1,1,NA)

#Plot results
#terra::plot(land_cover_binary)
#patch<-terra::patches(land_cover_binary)


#Turn the land cover into polygon data fo rbetter buffering
patchpoly<-terra::as.polygons(land_cover_binary)

#Make it an sf vector object
patchpoly<-sf::st_as_sf(patchpoly)

# Latitude conversion (constant) function
km_to_degrees_lat <- function(km) {
  return(km / 111)
}
# Convert assigned buffer distance to degrees
degrees_lat <- km_to_degrees_lat(BufferDistKM)

#Make buffer with calculated distance in degrees
buf<-st_buffer(patchpoly, degrees_lat) 
st_crs(buf)<-"+proj=longlat +datum=WGS84 +no_defs" 

#plot buffer
#p<-ggplot(patchpoly)+geom_sf(fill="green")+
 # geom_sf(data=buf,fill="red",alpha=0.4)

#Extract the population counta inside the buffer
extract <- terra::extract(x = Pop,              # Raster layer
                          y = buf,    # SpatialPoints* object   
                          na.rm = TRUE,       # Remove NAs
                          fun = sum   ) 
names(extract)[2]<-"pop" #change the column name

patchpoly$pop<-as.vector(extract$pop)#Make sure it's a vector not a df



PotentialAdopters<-sum(patchpoly$pop,na.rm=T)#Get the sum
return(PotentialAdopters)}}



#example uses
# IndividualsPlotsCalculations(
    # ResourceTypes=4, 
    # BufferDistKM=12)


# IndividualsPlotsCalculations(
  # ResourceTypes=4)
