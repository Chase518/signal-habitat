package com.signalhabitat.adapters.out.analysis;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

@RegisterRestClient
@Path("/api")
public interface PythonAnalysisClient {

    @GET
    @Path("/analysis")
    PythonAnalysisResponse getAnalysis();
}
