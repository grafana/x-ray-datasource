package datasource

// Needs to match XrayQueryType in frontend code
const (
	ModeXRay     = "X-Ray"
	ModeServices = "Services"

	QueryGetTrace                                 = "getTrace"
	QueryGetTraceSummaries                        = "getTraceSummaries"
	QueryGetTimeSeriesServiceStatistics           = "getTimeSeriesServiceStatistics"
	QueryGetAnalyticsRootCauseResponseTimeService = "getAnalyticsRootCauseResponseTimeService"
	QueryGetAnalyticsRootCauseResponseTimePath    = "getAnalyticsRootCauseResponseTimePath"
	QueryGetAnalyticsRootCauseErrorService        = "getAnalyticsRootCauseErrorService"
	QueryGetAnalyticsRootCauseErrorPath           = "getAnalyticsRootCauseErrorPath"
	QueryGetAnalyticsRootCauseErrorMessage        = "getAnalyticsRootCauseErrorMessage"
	QueryGetAnalyticsRootCauseFaultService        = "getAnalyticsRootCauseFaultService"
	QueryGetAnalyticsRootCauseFaultPath           = "getAnalyticsRootCauseFaultPath"
	QueryGetAnalyticsRootCauseFaultMessage        = "getAnalyticsRootCauseFaultMessage"
	QueryGetAnalyticsUrl                          = "getAnalyticsUrl"
	QueryGetAnalyticsUser                         = "getAnalyticsUser"
	QueryGetAnalyticsStatusCode                   = "getAnalyticsStatusCode"
	QueryGetInsights                              = "getInsights"
	QueryGetServiceMap                            = "getServiceMap"

	QueryListServices               = "listServices"
	QueryListServiceOperations      = "listServiceOperations"
	QueryListServiceDependencies    = "listServiceDependencies"
	QueryListServiceLevelObjectives = "listServiceLevelObjectives"
)
