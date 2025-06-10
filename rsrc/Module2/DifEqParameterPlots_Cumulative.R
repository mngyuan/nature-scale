DifEqParameterPlots_Cumulative<-function(mod) {
  modd<-extract(mod)
  modd<-as.data.frame(modd)

  modd<-modd%>%dplyr::select(params.1,params.2)
  modd<-modd%>%pivot_longer(cols=1:2,names_to="parameter",values_to = "estimate")

  modd<-modd%>%group_by(parameter)%>%summarise(med=median(estimate),lower=quantile(estimate,0.05),upper=quantile(estimate,0.95))
  #true<-data.frame(parameter=modd$parameter,med=c(0.3,0.15,0.02))

  p2<-ggplot(modd)+
    geom_pointrange(aes(ymin=lower,y=med,ymax=upper,x=parameter),size=1)+
    coord_flip()+geom_hline(yintercept=0,color="grey",linetype=2)+
    #geom_point(data=true,aes(x=parameter,y=med),color="blue",alpha=0.99,size=6,shape=2)+
    scale_x_discrete(labels=c("Social    \nlearning (\U03B2)","Independent\nlearning (\u03b1)") )+
    theme_classic()+  xlab("Parameter")+ylab("Estimate")+
    theme(axis.title = element_text(colour = "black",size=16),
          axis.text=element_text(color="black",size=14))
  p2

  Ind<-paste0("The estimated rate of independent uptake for this initiative is ",round(modd[2,2],2)*100,"%",", meaning that on average this percent of the population has adopted the initiative in each sampling time, independent of whether their peers have adopted.")

  Soc<-paste0("The estimated rate of social transmission for this initiative is ",round(modd[1,2],2)*100,"%",", meaning that on average each adopter caused ", round(modd[1,2],2)," new adoptions in the next sampling time.")

  #ggsave(filename = "./Revision/RevisedFigures/R_Pars.png",p2,dpi=350,units = "in",width = 6, height = 4 )
  return(list(ind=round(modd[2,2],2)*100,soc=round(modd[1,2],2)*100))
}
