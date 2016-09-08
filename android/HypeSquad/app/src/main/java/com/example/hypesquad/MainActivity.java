package com.example.hypesquad;

import android.Manifest;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.StrictMode;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.PopupWindow;

/*
import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.VolleyLog;
import com.android.volley.toolbox.CustomRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
*/

import com.google.firebase.iid.FirebaseInstanceId;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;


import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class MainActivity extends AppCompatActivity {

    public final static String EXTRA_MESSAGE = "com.example.hypesquad.MESSAGE";
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

    }

    /**Called when user clicks send button*/
    public void sendMessage(View view) {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.INTERNET) != PackageManager.PERMISSION_GRANTED) {    //checking for internet perms
            Log.d("Permission: ", "Not Granted");
        } else {
            Log.d("Permission: ", "Granted");
        }

        final Intent intent = new Intent(this, GroupLogin.class);
        EditText editText = (EditText) findViewById(R.id.edit_message);
        String groupID = editText.getText().toString();
        intent.putExtra(EXTRA_MESSAGE, groupID);
        //contact server and wait for verification that server has identified group ID and place the device in recieval list
        //RequestQueue queue = Volley.newRequestQueue(this); //create LOCAL !!! request Q

        String url = "http://54.186.246.65:8080/";    //specify HARDCODED !!! server url
        String responseString = "";
        String FIREBASE_ID =  FirebaseInstanceId.getInstance().getToken();

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(url)
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        server api = retrofit.create(server.class);
        request req = new request("joingroup", groupID, FIREBASE_ID);

        Call<request> call = api.sendRequest(req);
        call.enqueue(new Callback<request>() {
            @Override
            public void onResponse(Call<request> call, Response<request> response) {
                request responseData = response.body();
                Gson gson = new Gson();
                JSONObject responseJSON = new JSONObject();
                try {
                    responseJSON = new JSONObject(gson.toJson(responseData));
                } catch (JSONException e) { Log.e("ERROR", "Converting JSON Response to JSON Object");}
                Log.i("RESPONSE: ", responseJSON.toString());
                if(responseData.verified)
                {
                    startActivity(intent);
                } else {
                    Log.i("INFO", "Group " + responseData.groupID + " not availiable...");
                }
            }
            @Override
            public void onFailure(Call<request> call, Throwable t) {Log.e("ERROR", "NO RESPONSE FROM GROUP SERVER");}
        });

    }
}
//User requests group
//Json request to server for group data
//server verifies group id and returns json cheer data
//provide option to manually check for group activity otherwise every x time
//server waits for event to be issued then broadcasts info for the next cheer event in json ie (when to start, countdown time, which event)
//app recieves data and displays cheer at appropriate time
/*public class groupLoader {
} public class Group { Array Cheers = []; } public class Cheer { String actionType; String actionDescription;
}
*/