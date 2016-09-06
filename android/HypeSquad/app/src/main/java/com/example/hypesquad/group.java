package com.example.hypesquad;

import com.google.firebase.iid.FirebaseInstanceId;
import com.google.gson.annotations.SerializedName;

/**
 * Created by Nathan on 9/5/2016.
 */
public class group {
    @SerializedName("groupID")
    String groupID;

    @SerializedName("firetoken")
    String firetoken;

    @SerializedName("verified")
    Boolean verified;



    public group(String ID, String fireID) {
        this.groupID = ID;
        this.verified = false;
        this.firetoken = fireID;
    }
}
