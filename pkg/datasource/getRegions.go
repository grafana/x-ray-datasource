package datasource

import (
	"net/http"
)

// GetRegions has no easy equivalent in aws-sdk-go-v2, so we respond with 404. (We could
// use 410, but that's intended for permanent removals, and we may find a replacement for
// this eventually.)
// The UI has been updated not to call this endpoint anyway.
func (ds *Datasource) GetRegions(rw http.ResponseWriter, req *http.Request) {
	rw.WriteHeader(http.StatusNotFound)
}
