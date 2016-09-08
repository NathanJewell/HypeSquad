package com.example.hypesquad;

import com.google.gson.annotations.SerializedName;

/**
 * Created by Admin on 9/8/2016.
 */
public class request {
    @SerializedName("type")
    String type;

    @SerializedName("groupID")
    String groupID;

    @SerializedName("firetoken")
    String firetoken;

    @SerializedName("data")
    String data;

    @SerializedName("verified")
    Boolean verified = false;

    public request(String TYPE, String GROUP, String FIRETOKEN) {
        type = TYPE;            //request type
        groupID = GROUP;        //group name to deal with
        firetoken = FIRETOKEN;  //token for firebase
    }


}
