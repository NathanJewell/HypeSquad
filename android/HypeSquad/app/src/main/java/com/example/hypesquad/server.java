package com.example.hypesquad;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;

/**
 * Created by Nathan on 9/5/2016.
 */
public interface server {

    @POST("sendRequest")
    Call<request> sendRequest(@Body request grpData);
}
