MakeStandardReportingForm<-function(AdopterType, Period,Start,End) {
  if(Period == "daily"){
    Dates<-seq(from=as.Date(Start), to=as.Date(End), by="day") #daily
  }

  if(Period == "weekly"){
    Dates<-seq(from=as.Date(Start), to=as.Date(End), by="week") #weekly
  }

  if(Period == "bi-weekly"){
    Dates<-seq(from=as.Date(Start), to=as.Date(End), by="week") #biweekly
    Dates<-Dates[c(TRUE, FALSE)]
  }

  if(Period == "monthly"){
    Dates<-seq(from=as.Date(Start), to=as.Date(End), by="month") #Monthly
    Dates<-zoo::as.yearmon(Dates)
  }

  if(Period == "bi-monthly"){
    Dates<-seq(from=as.Date(Start), to=as.Date(End), by="month") #bimonthly
    Dates<-zoo::as.yearmon(Dates)
    Dates<-Dates[c(TRUE, FALSE)]
  }

  if(Period == "quarterly"){
    Dates<-seq(from=as.Date(Start), to=as.Date(End), by="quarter") #quarterly
    Dates<-zoo::as.yearqtr(Dates)

  }

  if(Period == "semi-annually"){
    Dates<-seq(from=as.Date(Start), to=as.Date(End), by="quarter") #twice-a-year
    Dates<-zoo::as.yearqtr(Dates)
    Dates<-Dates[c(TRUE, FALSE)]
  }

  if(Period == "annually"){
    Dates<-seq(from=as.Date(Start), to=as.Date(End), by="year") #yearly
    Dates<-substring(Dates,1,4)
  }

  adoptersColName<-paste0(AdopterType,"s engaged")
  df<-data.frame(Time=Dates,adoptersColName=NA)
  names(df)[2]<-adoptersColName
  return(df)
  #csvname<-paste0("Scale4Nature_StandardReportingForm_",Sys.Date(),".csv")
  #write.csv(df,"csvname")

}

#MakeForm(AdopterType = "Village",Period="Quarterly",Start = "2016-01-01",End = "2035-12-31")


